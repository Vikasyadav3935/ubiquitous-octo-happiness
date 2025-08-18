import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Switch, Platform, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, buttonHeight } from '../constants/spacing';
import { authService } from '../services';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;

interface ProfileScreenProps {
  navigation: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [discoverable, setDiscoverable] = useState(true);
  const [showOnline, setShowOnline] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        // Set settings from user data
        if (response.data.settings) {
          setNotifications(response.data.settings.pushNotifications);
          setDiscoverable(response.data.settings.discoveryEnabled);
          setShowOnline(response.data.settings.showOnlineStatus);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return '';
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 ? `${age} years old` : '';
  };

  const getProfilePhoto = () => {
    if (user?.profile?.photos && user.profile.photos.length > 0) {
      const primaryPhoto = user.profile.photos.find((photo: any) => photo.isPrimary);
      return primaryPhoto?.url || user.profile.photos[0]?.url || 'https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=Photo';
    }
    return 'https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=Photo';
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const ProfileOption = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <View style={styles.optionLeft}>
        <View style={styles.optionIcon}>
          <Ionicons name={icon as any} size={20} color={colors.primary} />
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{title}</Text>
          {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || <Ionicons name="chevron-forward" size={20} color={colors.text.light} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />
      <View style={[styles.safeArea, { paddingTop: STATUS_BAR_HEIGHT }]}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="settings-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
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
          
          <Text style={styles.profileName}>
            {user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName || ''}`.trim() : 'Complete Your Profile'}
          </Text>
          <Text style={styles.profileAge}>
            {user?.profile?.dateOfBirth ? calculateAge(user.profile.dateOfBirth) : 'Add your age'}
          </Text>
          
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <ProfileOption
            icon="person-outline"
            title="Personal Information"
            subtitle="Name, age, location, bio"
            onPress={() => navigation.navigate('EditProfile')}
          />
          
          <ProfileOption
            icon="images-outline"
            title="My Photos"
            subtitle="Manage your profile photos"
            onPress={() => navigation.navigate('ManagePhotos')}
          />
          
          <ProfileOption
            icon="help-circle-outline"
            title="Questions & Preferences"
            subtitle="Update personality questions and matching criteria"
            onPress={() => navigation.navigate('QuestionsFlow', { isEditMode: true })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Settings</Text>
          
          <ProfileOption
            icon="notifications-outline"
            title="Notifications"
            subtitle="Push notifications, email alerts"
            onPress={() => navigation.navigate('NotificationSettings')}
          />
          
          <ProfileOption
            icon="eye-outline"
            title="Discovery Settings"
            subtitle="Who can see your profile"
            rightElement={
              <Switch
                value={discoverable}
                onValueChange={setDiscoverable}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.text.white}
              />
            }
          />
          
          <ProfileOption
            icon="radio-outline"
            title="Show Online Status"
            subtitle="Let others know when you're active"
            rightElement={
              <Switch
                value={showOnline}
                onValueChange={setShowOnline}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.text.white}
              />
            }
          />
          
          <ProfileOption
            icon="shield-outline"
            title="Privacy & Safety"
            subtitle="Block list, safety tips"
            onPress={() => navigation.navigate('PrivacySafety')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          
          <ProfileOption
            icon="star-outline"
            title="Premium Features"
            subtitle="Unlimited likes, super likes, boosts"
            onPress={() => navigation.navigate('Premium')}
          />
          
          <ProfileOption
            icon="card-outline"
            title="Payment & Billing"
            subtitle="Manage subscription and payments"
            onPress={() => navigation.navigate('Billing')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <ProfileOption
            icon="help-buoy-outline"
            title="Help & Support"
            subtitle="FAQ, contact support"
            onPress={() => navigation.navigate('Support')}
          />
          
          <ProfileOption
            icon="document-text-outline"
            title="Terms & Privacy"
            subtitle="Terms of service, privacy policy"
            onPress={() => navigation.navigate('Legal')}
          />
          
          <ProfileOption
            icon="information-circle-outline"
            title="About"
            subtitle="App version, feedback"
            onPress={() => navigation.navigate('About')}
          />
        </View>

        <View style={styles.section}>
          <ProfileOption
            icon="log-out-outline"
            title="Sign Out"
            subtitle="Sign out of your account"
            onPress={() => {}}
          />
          
          <TouchableOpacity style={styles.deleteAccountButton}>
            <Text style={styles.deleteAccountText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerSpace} />
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
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    marginBottom: spacing.base,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
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
  profileName: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  profileAge: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  editProfileButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    height: buttonHeight.small,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
  },
  section: {
    backgroundColor: colors.surface,
    marginBottom: spacing.base,
    paddingVertical: spacing.base,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  optionSubtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  deleteAccountButton: {
    alignItems: 'center',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
  },
  deleteAccountText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.error,
  },
  footerSpace: {
    height: spacing.xl,
  },
});