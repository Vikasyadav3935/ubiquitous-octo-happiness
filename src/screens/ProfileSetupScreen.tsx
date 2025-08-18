import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Image, Alert, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, buttonHeight, inputHeight } from '../constants/spacing';
import { profileService } from '../services';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;

interface ProfileSetupScreenProps {
  navigation: any;
}


export default function ProfileSetupScreen({ navigation }: ProfileSetupScreenProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });
  const [photos, setPhotos] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);

  // Remove gender options since we're simplifying

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    const { firstName, lastName } = formData;
    
    if (!firstName.trim()) {
      Alert.alert('Name Required', 'Please enter your first name');
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        // Other fields can be filled later in EditProfile
      };

      console.log('Creating profile with data:', profileData);
      const response = await profileService.createProfile(profileData);
      
      console.log('Profile creation response:', response);
      
      if (response.success) {
        Alert.alert(
          'Profile Created Successfully',
          'Let\'s personalize your experience with a few questions',
          [
            {
              text: 'Continue',
              onPress: () => navigation.replace('QuestionsFlow')
            }
          ]
        );
      } else {
        console.error('Profile creation failed:', response.error);
        Alert.alert(
          'Profile Setup Failed',
          response.error || 'Unable to create your profile. Please try again.'
        );
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      Alert.alert(
        'Network Error',
        'Please check your internet connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.firstName.trim().length > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />
      <View style={[styles.safeArea, { paddingTop: STATUS_BAR_HEIGHT }]}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            
            <Text style={styles.title}>Set Up Your Profile</Text>
            <Text style={styles.subtitle}>
              Help others get to know you better
            </Text>
          </View>

          <View style={styles.photosSection}>
            <Text style={styles.photosSectionTitle}>Add Photos (Optional)</Text>
            <Text style={styles.photosSectionSubtitle}>Upload up to 6 photos to show your personality</Text>
            <View style={styles.photosGrid}>
              {photos.map((photo, index) => (
                <TouchableOpacity key={index} style={styles.photoUploadBox}>
                  {photo ? (
                    <Image source={{ uri: photo }} style={styles.uploadedPhoto} />
                  ) : (
                    <View style={styles.emptyPhotoBox}>
                      <Ionicons name="camera" size={24} color={colors.text.light} />
                      <Text style={styles.photoIndexText}>{index + 1}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.nameContainer}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: spacing.sm }]}>
                <Text style={styles.inputLabel}>First Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter first name"
                  placeholderTextColor={colors.text.light}
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                />
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: spacing.sm }]}>
                <Text style={styles.inputLabel}>Last Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter last name"
                  placeholderTextColor={colors.text.light}
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                />
              </View>
            </View>

          </View>

          <Text style={styles.noteText}>
            You can add more details like age, bio, and other information later in your profile settings.
          </Text>

          <TouchableOpacity 
            style={[
              styles.continueButton,
              { 
                opacity: (isFormValid && !isLoading) ? 1 : 0.6,
                backgroundColor: isLoading ? colors.text.light : colors.primary
              }
            ]}
            onPress={handleContinue}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.text.white} />
                <Text style={[styles.continueButtonText, { marginLeft: spacing.sm }]}>
                  Creating Profile...
                </Text>
              </View>
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.base,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  photosSection: {
    marginBottom: spacing['2xl'],
  },
  photosSectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  photosSectionSubtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  photoUploadBox: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyPhotoBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  uploadedPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  photoIndexText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.light,
    marginTop: spacing.xs,
  },
  noteText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    fontStyle: 'italic',
  },
  formContainer: {
    marginBottom: spacing.xl,
  },
  nameContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.base,
    height: inputHeight.medium,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  continueButton: {
    backgroundColor: colors.primary,
    height: buttonHeight.medium,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});