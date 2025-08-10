import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, buttonHeight } from '../constants/spacing';

interface PrivacySafetyScreenProps {
  navigation: any;
}

export default function PrivacySafetyScreen({ navigation }: PrivacySafetyScreenProps) {
  const [settings, setSettings] = useState({
    showAge: true,
    showDistance: true,
    showOnlineStatus: false,
    showLastSeen: false,
    allowMessagesFromMatches: true,
    allowMessagesFromEveryone: false,
    shareReadReceipts: true,
    shareTypingIndicator: true,
    shareLocationData: true,
    dataAnalytics: false,
    personalizedAds: true,
  });

  const [blockedUsers] = useState([
    { id: '1', name: 'User 1', blockedDate: '2024-01-15' },
    { id: '2', name: 'User 2', blockedDate: '2024-01-10' },
    { id: '3', name: 'User 3', blockedDate: '2024-01-05' },
  ]);

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleReportUser = () => {
    Alert.alert(
      'Report a User',
      'If someone is making you uncomfortable or violating our community guidelines, please report them.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Report User', onPress: () => navigation.navigate('ReportUser') }
      ]
    );
  };

  const handleBlockUser = () => {
    Alert.alert(
      'Block a User',
      'Blocked users won\'t be able to see your profile or message you.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Block User', onPress: () => navigation.navigate('BlockUser') }
      ]
    );
  };

  const handleUnblockUser = (userId: string, userName: string) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Unblock', onPress: () => Alert.alert('Success', 'User unblocked') }
      ]
    );
  };

  const SettingItem = ({ 
    title, 
    subtitle, 
    value, 
    onToggle, 
    icon 
  }: {
    title: string;
    subtitle: string;
    value: boolean;
    onToggle: (value: boolean) => void;
    icon: string;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon as any} size={20} color={colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.text.white}
      />
    </View>
  );

  const ActionButton = ({ 
    title, 
    subtitle, 
    icon, 
    onPress, 
    color = colors.text.primary 
  }: {
    title: string;
    subtitle: string;
    icon: string;
    onPress: () => void;
    color?: string;
  }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <View style={styles.actionLeft}>
        <View style={[styles.actionIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <View style={styles.actionText}>
          <Text style={[styles.actionTitle, { color }]}>{title}</Text>
          <Text style={styles.actionSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text.light} />
    </TouchableOpacity>
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
        
        <Text style={styles.headerTitle}>Privacy & Safety</Text>
        
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Visibility</Text>
          
          <SettingItem
            title="Show Age"
            subtitle="Display your age on your profile"
            value={settings.showAge}
            onToggle={(value) => updateSetting('showAge', value)}
            icon="calendar-outline"
          />
          
          <SettingItem
            title="Show Distance"
            subtitle="Show how far you are from others"
            value={settings.showDistance}
            onToggle={(value) => updateSetting('showDistance', value)}
            icon="location-outline"
          />
          
          <SettingItem
            title="Show Online Status"
            subtitle="Let others see when you're active"
            value={settings.showOnlineStatus}
            onToggle={(value) => updateSetting('showOnlineStatus', value)}
            icon="radio-outline"
          />
          
          <SettingItem
            title="Show Last Seen"
            subtitle="Display when you were last online"
            value={settings.showLastSeen}
            onToggle={(value) => updateSetting('showLastSeen', value)}
            icon="time-outline"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Messaging</Text>
          
          <SettingItem
            title="Messages from Matches"
            subtitle="Allow messages from your matches"
            value={settings.allowMessagesFromMatches}
            onToggle={(value) => updateSetting('allowMessagesFromMatches', value)}
            icon="chatbubble-outline"
          />
          
          <SettingItem
            title="Messages from Everyone"
            subtitle="Allow messages from non-matches (Premium)"
            value={settings.allowMessagesFromEveryone}
            onToggle={(value) => updateSetting('allowMessagesFromEveryone', value)}
            icon="chatbubbles-outline"
          />
          
          <SettingItem
            title="Read Receipts"
            subtitle="Show when you've read messages"
            value={settings.shareReadReceipts}
            onToggle={(value) => updateSetting('shareReadReceipts', value)}
            icon="checkmark-done-outline"
          />
          
          <SettingItem
            title="Typing Indicator"
            subtitle="Show when you're typing"
            value={settings.shareTypingIndicator}
            onToggle={(value) => updateSetting('shareTypingIndicator', value)}
            icon="ellipsis-horizontal-outline"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          
          <SettingItem
            title="Location Data"
            subtitle="Share location for better matches"
            value={settings.shareLocationData}
            onToggle={(value) => updateSetting('shareLocationData', value)}
            icon="navigate-outline"
          />
          
          <SettingItem
            title="Analytics"
            subtitle="Help improve our service with usage data"
            value={settings.dataAnalytics}
            onToggle={(value) => updateSetting('dataAnalytics', value)}
            icon="analytics-outline"
          />
          
          <SettingItem
            title="Personalized Ads"
            subtitle="Show ads based on your interests"
            value={settings.personalizedAds}
            onToggle={(value) => updateSetting('personalizedAds', value)}
            icon="pricetag-outline"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Actions</Text>
          
          <ActionButton
            title="Report a User"
            subtitle="Report inappropriate behavior"
            icon="flag-outline"
            onPress={handleReportUser}
            color={colors.warning}
          />
          
          <ActionButton
            title="Block a User"
            subtitle="Prevent someone from contacting you"
            icon="ban-outline"
            onPress={handleBlockUser}
            color={colors.error}
          />
          
          <ActionButton
            title="Safety Tips"
            subtitle="Learn how to stay safe while dating"
            icon="shield-outline"
            onPress={() => navigation.navigate('SafetyTips')}
          />
          
          <ActionButton
            title="Community Guidelines"
            subtitle="Our rules for respectful behavior"
            icon="document-text-outline"
            onPress={() => navigation.navigate('Guidelines')}
          />
        </View>

        {blockedUsers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Blocked Users ({blockedUsers.length})</Text>
            
            {blockedUsers.map((user) => (
              <View key={user.id} style={styles.blockedUserItem}>
                <View style={styles.blockedUserInfo}>
                  <View style={styles.blockedUserAvatar}>
                    <Ionicons name="person" size={20} color={colors.text.light} />
                  </View>
                  <View style={styles.blockedUserText}>
                    <Text style={styles.blockedUserName}>{user.name}</Text>
                    <Text style={styles.blockedUserDate}>
                      Blocked on {new Date(user.blockedDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.unblockButton}
                  onPress={() => handleUnblockUser(user.id, user.name)}
                >
                  <Text style={styles.unblockButtonText}>Unblock</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.emergencySection}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="warning" size={24} color={colors.error} />
            <Text style={styles.emergencyTitle}>Emergency Support</Text>
          </View>
          <Text style={styles.emergencyText}>
            If you're in immediate danger, contact local emergency services. 
            For dating safety resources and support, contact our safety team.
          </Text>
          <TouchableOpacity style={styles.emergencyButton}>
            <Text style={styles.emergencyButtonText}>Get Safety Resources</Text>
          </TouchableOpacity>
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
  placeholder: {
    width: 40,
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    marginBottom: spacing.xs,
  },
  actionSubtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  blockedUserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  blockedUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  blockedUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  blockedUserText: {
    flex: 1,
  },
  blockedUserName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  blockedUserDate: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  unblockButton: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  unblockButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
  emergencySection: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.base,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.error,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emergencyTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.error,
    marginLeft: spacing.sm,
  },
  emergencyText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.sm * 1.2,
    marginBottom: spacing.lg,
  },
  emergencyButton: {
    backgroundColor: colors.error,
    height: buttonHeight.small,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
  },
  bottomSpace: {
    height: spacing.xl,
  },
});