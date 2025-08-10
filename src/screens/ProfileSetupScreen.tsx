import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, buttonHeight, inputHeight } from '../constants/spacing';

interface ProfileSetupScreenProps {
  navigation: any;
}

export default function ProfileSetupScreen({ navigation }: ProfileSetupScreenProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    bio: '',
  });

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    const { firstName, lastName, email, dateOfBirth, gender } = formData;
    
    if (!firstName || !lastName || !email || !dateOfBirth || !gender) {
      Alert.alert('Incomplete Information', 'Please fill in all required fields');
      return;
    }

    navigation.navigate('QuestionsFlow');
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.dateOfBirth && formData.gender;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
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

          <View style={styles.profileImageContainer}>
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="camera" size={30} color={colors.text.light} />
            </View>
            <Text style={styles.addPhotoText}>Add Profile Photo</Text>
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

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter email address"
                placeholderTextColor={colors.text.light}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date of Birth *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.text.light}
                keyboardType="numeric"
                value={formData.dateOfBirth}
                onChangeText={(value) => handleInputChange('dateOfBirth', value)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gender *</Text>
              <View style={styles.genderContainer}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.genderOption,
                      { 
                        backgroundColor: formData.gender === option ? colors.primary : colors.surface,
                        borderColor: formData.gender === option ? colors.primary : colors.border
                      }
                    ]}
                    onPress={() => handleInputChange('gender', option)}
                  >
                    <Text style={[
                      styles.genderOptionText,
                      { color: formData.gender === option ? colors.text.white : colors.text.primary }
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bio (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                placeholder="Tell us about yourself..."
                placeholderTextColor={colors.text.light}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={formData.bio}
                onChangeText={(value) => handleInputChange('bio', value)}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[
              styles.continueButton,
              { opacity: isFormValid ? 1 : 0.6 }
            ]}
            onPress={handleContinue}
            disabled={!isFormValid}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginBottom: spacing.md,
  },
  addPhotoText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
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
  bioInput: {
    height: 80,
    paddingTop: spacing.base,
    paddingVertical: spacing.base,
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  genderOption: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs + 2,
    borderRadius: 20,
    borderWidth: 1,
  },
  genderOptionText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
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
});