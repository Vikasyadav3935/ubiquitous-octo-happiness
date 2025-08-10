import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, buttonHeight } from '../constants/spacing';

interface NotificationSettingsScreenProps {
  navigation: any;
}

export default function NotificationSettingsScreen({ navigation }: NotificationSettingsScreenProps) {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    
    // Match notifications
    newMatches: true,
    likedYou: true,
    superLiked: true,
    
    // Message notifications
    newMessages: true,
    messageReply: true,
    messageRead: false,
    
    // Activity notifications
    profileViews: true,
    photoLikes: false,
    profileLikes: true,
    
    // Marketing notifications
    promotions: false,
    tips: true,
    events: false,
    newsletter: false,
    
    // Sound & vibration
    soundEnabled: true,
    vibrationEnabled: true,
    
    // Quiet hours
    quietHoursEnabled: false,
  });

  const [quietHours, setQuietHours] = useState({
    startTime: '22:00',
    endTime: '08:00',
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    if (key === 'pushNotifications' && !value) {
      Alert.alert(
        'Push Notifications Disabled',
        'You won\'t receive real-time notifications. You can still check updates in the app.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleTestNotification = () => {
    Alert.alert('Test Notification', 'This is how notifications will appear on your device!');
  };

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingItem = ({ 
    title, 
    subtitle, 
    value, 
    onToggle, 
    icon,
    disabled = false 
  }: {
    title: string;
    subtitle?: string;
    value: boolean;
    onToggle: (value: boolean) => void;
    icon: string;
    disabled?: boolean;
  }) => (
    <View style={[styles.settingItem, disabled && styles.disabledSetting]}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons 
            name={icon as any} 
            size={20} 
            color={disabled ? colors.text.light : colors.primary} 
          />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, disabled && styles.disabledText]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, disabled && styles.disabledText]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.text.white}
        disabled={disabled}
      />
    </View>
  );

  const TimeSelector = ({ 
    label, 
    time, 
    onPress 
  }: {
    label: string;
    time: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.timeSelector} onPress={onPress}>
      <Text style={styles.timeLabel}>{label}</Text>
      <View style={styles.timeValue}>
        <Text style={styles.timeText}>{time}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.text.light} />
      </View>
    </TouchableOpacity>
  );

  const isPushDisabled = !settings.pushNotifications;

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
        
        <Text style={styles.headerTitle}>Notifications</Text>
        
        <TouchableOpacity 
          style={styles.testButton}
          onPress={handleTestNotification}
        >
          <Ionicons name="notifications-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SettingSection title="General">
          <SettingItem
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            value={settings.pushNotifications}
            onToggle={(value) => updateSetting('pushNotifications', value)}
            icon="notifications-outline"
          />
          
          <SettingItem
            title="Email Notifications"
            subtitle="Receive updates via email"
            value={settings.emailNotifications}
            onToggle={(value) => updateSetting('emailNotifications', value)}
            icon="mail-outline"
          />
          
          <SettingItem
            title="SMS Notifications"
            subtitle="Receive important updates via SMS"
            value={settings.smsNotifications}
            onToggle={(value) => updateSetting('smsNotifications', value)}
            icon="chatbubble-outline"
          />
        </SettingSection>

        <SettingSection title="Matches">
          <SettingItem
            title="New Matches"
            subtitle="When you get a new match"
            value={settings.newMatches}
            onToggle={(value) => updateSetting('newMatches', value)}
            icon="heart-outline"
            disabled={isPushDisabled}
          />
          
          <SettingItem
            title="Someone Liked You"
            subtitle="When someone likes your profile"
            value={settings.likedYou}
            onToggle={(value) => updateSetting('likedYou', value)}
            icon="star-outline"
            disabled={isPushDisabled}
          />
          
          <SettingItem
            title="Super Liked"
            subtitle="When someone super likes you"
            value={settings.superLiked}
            onToggle={(value) => updateSetting('superLiked', value)}
            icon="flash-outline"
            disabled={isPushDisabled}
          />
        </SettingSection>

        <SettingSection title="Messages">
          <SettingItem
            title="New Messages"
            subtitle="When you receive a message"
            value={settings.newMessages}
            onToggle={(value) => updateSetting('newMessages', value)}
            icon="chatbubbles-outline"
            disabled={isPushDisabled}
          />
          
          <SettingItem
            title="Message Replies"
            subtitle="When someone replies to your message"
            value={settings.messageReply}
            onToggle={(value) => updateSetting('messageReply', value)}
            icon="arrow-undo-outline"
            disabled={isPushDisabled}
          />
          
          <SettingItem
            title="Read Receipts"
            subtitle="When your messages are read"
            value={settings.messageRead}
            onToggle={(value) => updateSetting('messageRead', value)}
            icon="checkmark-done-outline"
            disabled={isPushDisabled}
          />
        </SettingSection>

        <SettingSection title="Activity">
          <SettingItem
            title="Profile Views"
            subtitle="When someone views your profile"
            value={settings.profileViews}
            onToggle={(value) => updateSetting('profileViews', value)}
            icon="eye-outline"
            disabled={isPushDisabled}
          />
          
          <SettingItem
            title="Photo Likes"
            subtitle="When someone likes your photos"
            value={settings.photoLikes}
            onToggle={(value) => updateSetting('photoLikes', value)}
            icon="image-outline"
            disabled={isPushDisabled}
          />
          
          <SettingItem
            title="Profile Likes"
            subtitle="Daily summary of profile activity"
            value={settings.profileLikes}
            onToggle={(value) => updateSetting('profileLikes', value)}
            icon="thumbs-up-outline"
            disabled={isPushDisabled}
          />
        </SettingSection>

        <SettingSection title="Sound & Vibration">
          <SettingItem
            title="Sound"
            subtitle="Play notification sounds"
            value={settings.soundEnabled}
            onToggle={(value) => updateSetting('soundEnabled', value)}
            icon="volume-high-outline"
            disabled={isPushDisabled}
          />
          
          <SettingItem
            title="Vibration"
            subtitle="Vibrate for notifications"
            value={settings.vibrationEnabled}
            onToggle={(value) => updateSetting('vibrationEnabled', value)}
            icon="phone-portrait-outline"
            disabled={isPushDisabled}
          />
        </SettingSection>

        <SettingSection title="Quiet Hours">
          <SettingItem
            title="Enable Quiet Hours"
            subtitle="Pause notifications during specific hours"
            value={settings.quietHoursEnabled}
            onToggle={(value) => updateSetting('quietHoursEnabled', value)}
            icon="moon-outline"
            disabled={isPushDisabled}
          />
          
          {settings.quietHoursEnabled && !isPushDisabled && (
            <View style={styles.quietHoursContainer}>
              <TimeSelector
                label="Start Time"
                time={quietHours.startTime}
                onPress={() => Alert.alert('Time Picker', 'Time picker would open here')}
              />
              <TimeSelector
                label="End Time"
                time={quietHours.endTime}
                onPress={() => Alert.alert('Time Picker', 'Time picker would open here')}
              />
            </View>
          )}
        </SettingSection>

        <SettingSection title="Marketing & Updates">
          <SettingItem
            title="Promotions"
            subtitle="Special offers and discounts"
            value={settings.promotions}
            onToggle={(value) => updateSetting('promotions', value)}
            icon="pricetag-outline"
          />
          
          <SettingItem
            title="Dating Tips"
            subtitle="Helpful tips and advice"
            value={settings.tips}
            onToggle={(value) => updateSetting('tips', value)}
            icon="bulb-outline"
          />
          
          <SettingItem
            title="Events"
            subtitle="Local events and meetups"
            value={settings.events}
            onToggle={(value) => updateSetting('events', value)}
            icon="calendar-outline"
          />
          
          <SettingItem
            title="Newsletter"
            subtitle="Weekly newsletter with app updates"
            value={settings.newsletter}
            onToggle={(value) => updateSetting('newsletter', value)}
            icon="newspaper-outline"
          />
        </SettingSection>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color={colors.accent} />
            <Text style={styles.infoTitle}>Notification Tips</Text>
          </View>
          <Text style={styles.infoText}>
            • Keep "New Matches" and "New Messages" enabled for the best experience{'\n'}
            • Use Quiet Hours to avoid late night notifications{'\n'}
            • You can always check missed notifications in the app{'\n'}
            • Customize settings based on your dating activity level
          </Text>
        </View>

        <TouchableOpacity style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset to Default Settings</Text>
        </TouchableOpacity>

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
  testButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  disabledSetting: {
    opacity: 0.5,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  settingSubtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  disabledText: {
    color: colors.text.light,
  },
  quietHoursContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.base,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.base,
  },
  timeLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
  },
  timeValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.base,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.sm * 1.2,
  },
  resetButton: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.base,
    height: buttonHeight.medium,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
  },
  bottomSpace: {
    height: spacing.xl,
  },
});