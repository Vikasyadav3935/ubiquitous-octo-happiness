import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, buttonHeight, inputHeight } from '../constants/spacing';

interface EditProfileScreenProps {
  navigation: any;
}

export default function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phoneNumber: '+91 9876543210',
    dateOfBirth: '15/06/1995',
    gender: 'Male',
    location: 'Mumbai, India',
    occupation: 'Software Engineer',
    company: 'Tech Solutions Inc.',
    education: 'Bachelor of Technology',
    bio: 'Love traveling, photography, and meeting new people. Always up for an adventure and good conversation!',
    height: '5\'10"',
    lookingFor: 'Long-term relationship',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }, 1000);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
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
            <View style={styles.profileImage}>
              <Ionicons name="person" size={40} color={colors.text.light} />
            </View>
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
            options={['Male', 'Female', 'Non-binary', 'Prefer not to say']}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    alignItems: 'center',
    justifyContent: 'center',
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