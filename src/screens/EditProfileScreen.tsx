import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TextInput, TouchableOpacity, Alert, Platform, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, buttonHeight, inputHeight } from '../constants/spacing';
import { authService, profileService } from '../services';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;

interface EditProfileScreenProps {
  navigation: any;
}

export default function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    location: '',
    occupation: '',
    company: '',
    education: '',
    bio: '',
    height: '',
  });

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        const profile = response.data.profile;
        
        setFormData({
          firstName: profile?.firstName || '',
          lastName: profile?.lastName || '',
          email: response.data.email || '',
          phoneNumber: response.data.phoneNumber || '',
          dateOfBirth: profile?.dateOfBirth ? formatDate(profile.dateOfBirth) : '',
          gender: profile?.gender || '',
          location: profile?.city && profile?.country ? `${profile.city}, ${profile.country}` : '',
          occupation: profile?.occupation || '',
          company: profile?.company || '',
          education: profile?.education || '',
          bio: profile?.bio || '',
          height: profile?.height ? `${Math.floor(profile.height / 12)}'${profile.height % 12}"` : '',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateString: string) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const parseHeight = (heightString: string) => {
    if (!heightString) return null;
    const match = heightString.match(/(\d+)'(\d+)"/);
    if (match) {
      const feet = parseInt(match[1]);
      const inches = parseInt(match[2]);
      return feet * 12 + inches;
    }
    return null;
  };

  const getProfilePhoto = () => {
    if (user?.profile?.photos && user.profile.photos.length > 0) {
      const primaryPhoto = user.profile.photos.find((photo: any) => photo.isPrimary);
      return primaryPhoto?.url || user.profile.photos[0]?.url || 'https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=Photo';
    }
    return 'https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=Photo';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Parse location into city and country
      const locationParts = formData.location.split(', ');
      const city = locationParts[0] || '';
      const country = locationParts[1] || '';
      
      const profileData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        dateOfBirth: parseDate(formData.dateOfBirth),
        gender: formData.gender,
        bio: formData.bio.trim(),
        occupation: formData.occupation.trim(),
        company: formData.company.trim(),
        education: formData.education.trim(),
        height: parseHeight(formData.height),
        city: city.trim(),
        country: country.trim(),
      };

      // Remove empty fields
      Object.keys(profileData).forEach(key => {
        if (profileData[key] === '' || profileData[key] === null) {
          delete profileData[key];
        }
      });

      console.log('Updating profile with data:', profileData);
      const response = await profileService.updateProfile(profileData);
      
      if (response.success) {
        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', response.error || 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    multiline = false,
    keyboardType = 'default' as any,
    maxLength 
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    multiline?: boolean;
    keyboardType?: any;
    maxLength?: number;
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.textInput, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.light}
        multiline={multiline}
        keyboardType={keyboardType}
        maxLength={maxLength}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {maxLength && (
        <Text style={styles.characterCount}>
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );

  const SelectField = ({ 
    label, 
    value, 
    options, 
    onSelect 
  }: {
    label: string;
    value: string;
    options: string[];
    onSelect: (value: string) => void;
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              { 
                backgroundColor: value === option ? colors.primary : colors.surface,
                borderColor: value === option ? colors.primary : colors.border
              }
            ]}
            onPress={() => onSelect(option)}
          >
            <Text style={[
              styles.optionText,
              { color: value === option ? colors.text.white : colors.text.primary }
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />
      <View style={[styles.safeArea, { paddingTop: STATUS_BAR_HEIGHT }]}>
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Edit Profile</Text>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileImageSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: getProfilePhoto() }} 
              style={styles.profileImage}
              defaultSource={{ uri: 'https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=Photo' }}
            />
            <TouchableOpacity style={styles.editImageButton}>
              <Ionicons name="camera" size={16} color={colors.text.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.changePhotoText}>Tap to change photo</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.nameRow}>
            <View style={styles.halfInput}>
              <InputField
                label="First Name"
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                placeholder="Enter first name"
              />
            </View>
            <View style={styles.halfInput}>
              <InputField
                label="Last Name"
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                placeholder="Enter last name"
              />
            </View>
          </View>

          <InputField
            label="Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Enter email address"
            keyboardType="email-address"
          />

          <InputField
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange('phoneNumber', value)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />

          <InputField
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChangeText={(value) => handleInputChange('dateOfBirth', value)}
            placeholder="DD/MM/YYYY"
          />

          <SelectField
            label="Gender"
            value={formData.gender}
            options={['MALE', 'FEMALE', 'NON_BINARY', 'OTHER']}
            onSelect={(value) => handleInputChange('gender', value)}
          />

          <InputField
            label="Location"
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            placeholder="City, Country"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional</Text>
          
          <InputField
            label="Occupation"
            value={formData.occupation}
            onChangeText={(value) => handleInputChange('occupation', value)}
            placeholder="What do you do?"
          />

          <InputField
            label="Company"
            value={formData.company}
            onChangeText={(value) => handleInputChange('company', value)}
            placeholder="Where do you work?"
          />

          <InputField
            label="Education"
            value={formData.education}
            onChangeText={(value) => handleInputChange('education', value)}
            placeholder="Your education background"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          
          <SelectField
            label="Height"
            value={formData.height}
            options={['5\'0"', '5\'1"', '5\'2"', '5\'3"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"', '6\'0"', '6\'1"', '6\'2"', '6\'3"']}
            onSelect={(value) => handleInputChange('height', value)}
          />

          <SelectField
            label="Looking For"
            value={formData.lookingFor}
            options={['Casual dating', 'Long-term relationship', 'Marriage', 'Friendship', 'Something casual']}
            onSelect={(value) => handleInputChange('lookingFor', value)}
          />

          <InputField
            label="About Me"
            value={formData.bio}
            onChangeText={(value) => handleInputChange('bio', value)}
            placeholder="Tell people about yourself..."
            multiline={true}
            maxLength={500}
          />
        </View>

        <View style={styles.bottomSpace} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  saveButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  saveButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  profileImageSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    marginBottom: spacing.base,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.border,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginTop: spacing.base,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  changePhotoText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
  },
  section: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  halfInput: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
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
    backgroundColor: colors.background,
  },
  multilineInput: {
    height: 100,
    paddingVertical: spacing.base,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.light,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  optionsContainer: {
    flexGrow: 0,
  },
  optionButton: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs + 2,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  optionText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
  },
  bottomSpace: {
    height: spacing.xl,
  },
});