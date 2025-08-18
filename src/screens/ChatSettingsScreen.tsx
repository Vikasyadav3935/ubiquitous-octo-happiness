import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, buttonHeight } from '../constants/spacing';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;

interface ChatSettingsScreenProps {
  navigation: any;
  route: any;
}

export default function ChatSettingsScreen({ navigation, route }: ChatSettingsScreenProps) {
  const { chat } = route.params;
  
  const [settings, setSettings] = useState({
    notifications: true,
    muteMessages: false,
    readReceipts: true,
    typing: true,
    mediaAutoDownload: true,
    disappearingMessages: false,
    starredMessages: true,
  });

  const [disappearingTime, setDisappearingTime] = useState('24h');

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to clear all messages? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive', 
          onPress: () => Alert.alert('Success', 'Chat history cleared') 
        }
      ]
    );
  };

  const handleBlockUser = () => {
    Alert.alert(
      'Block User',
      `Are you sure you want to block ${chat.name}? They won't be able to message you or see your profile.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Block', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Blocked', `${chat.name} has been blocked`);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleReportUser = () => {
    navigation.navigate('BlockReportUser', { user: chat, action: 'report' });
  };

  const handleExportChat = () => {
    Alert.alert(
      'Export Chat',
      'Export chat history as a text file?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => Alert.alert('Success', 'Chat exported successfully') }
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
    subtitle?: string;
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
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
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

  const ActionItem = ({ 
    title, 
    subtitle, 
    icon, 
    onPress,
    danger = false 
  }: {
    title: string;
    subtitle?: string;
    icon: string;
    onPress: () => void;
    danger?: boolean;
  }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <View style={styles.actionLeft}>
        <View style={[styles.actionIcon, { backgroundColor: danger ? colors.error + '20' : colors.accent + '20' }]}>
          <Ionicons name={icon as any} size={20} color={danger ? colors.error : colors.accent} />
        </View>
        <View style={styles.actionText}>
          <Text style={[styles.actionTitle, danger && { color: colors.error }]}>{title}</Text>
          {subtitle && <Text style={styles.actionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text.light} />
    </TouchableOpacity>
  );

  const DisappearingTimeOption = ({ time, label }: { time: string; label: string }) => (
    <TouchableOpacity
      style={[
        styles.timeOption,
        { 
          backgroundColor: disappearingTime === time ? colors.primary : colors.surface,
          borderColor: disappearingTime === time ? colors.primary : colors.border
        }
      ]}
      onPress={() => setDisappearingTime(time)}
    >
      <Text style={[
        styles.timeOptionText,
        { color: disappearingTime === time ? colors.text.white : colors.text.primary }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

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
        
        <Text style={styles.headerTitle}>Chat Settings</Text>
        
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>{chat.name.charAt(0)}</Text>
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{chat.name}</Text>
              <Text style={styles.profileStatus}>
                {chat.isOnline ? 'Online now' : 'Last seen recently'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.viewProfileButton}
            onPress={() => navigation.navigate('UserProfile', { user: chat })}
          >
            <Text style={styles.viewProfileText}>View Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <SettingItem
            title="Chat Notifications"
            subtitle="Get notified of new messages"
            value={settings.notifications}
            onToggle={(value) => updateSetting('notifications', value)}
            icon="notifications-outline"
          />
          
          <SettingItem
            title="Mute Messages"
            subtitle="Turn off message notifications"
            value={settings.muteMessages}
            onToggle={(value) => updateSetting('muteMessages', value)}
            icon="volume-mute-outline"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <SettingItem
            title="Read Receipts"
            subtitle="Show when you've read messages"
            value={settings.readReceipts}
            onToggle={(value) => updateSetting('readReceipts', value)}
            icon="checkmark-done-outline"
          />
          
          <SettingItem
            title="Typing Indicator"
            subtitle="Show when you're typing"
            value={settings.typing}
            onToggle={(value) => updateSetting('typing', value)}
            icon="ellipsis-horizontal-outline"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Media</Text>
          
          <SettingItem
            title="Auto-Download Media"
            subtitle="Automatically download photos and videos"
            value={settings.mediaAutoDownload}
            onToggle={(value) => updateSetting('mediaAutoDownload', value)}
            icon="download-outline"
          />
          
          <ActionItem
            title="Shared Media"
            subtitle="View all shared photos and files"
            icon="images-outline"
            onPress={() => navigation.navigate('SharedMedia', { chat })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Messages</Text>
          
          <SettingItem
            title="Disappearing Messages"
            subtitle="Messages automatically delete after set time"
            value={settings.disappearingMessages}
            onToggle={(value) => updateSetting('disappearingMessages', value)}
            icon="time-outline"
          />
          
          {settings.disappearingMessages && (
            <View style={styles.disappearingOptions}>
              <Text style={styles.disappearingTitle}>Delete messages after:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeOptionsContainer}>
                <DisappearingTimeOption time="1h" label="1 Hour" />
                <DisappearingTimeOption time="24h" label="24 Hours" />
                <DisappearingTimeOption time="7d" label="7 Days" />
                <DisappearingTimeOption time="30d" label="30 Days" />
              </ScrollView>
            </View>
          )}
          
          <SettingItem
            title="Starred Messages"
            subtitle="Keep important messages starred"
            value={settings.starredMessages}
            onToggle={(value) => updateSetting('starredMessages', value)}
            icon="star-outline"
          />
          
          <ActionItem
            title="Starred Messages"
            subtitle="View all starred messages"
            icon="star-outline"
            onPress={() => navigation.navigate('StarredMessages', { chat })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chat Actions</Text>
          
          <ActionItem
            title="Search Messages"
            subtitle="Find specific messages in this chat"
            icon="search-outline"
            onPress={() => navigation.navigate('SearchMessages', { chat })}
          />
          
          <ActionItem
            title="Export Chat"
            subtitle="Save chat history as text file"
            icon="share-outline"
            onPress={handleExportChat}
          />
          
          <ActionItem
            title="Clear Chat History"
            subtitle="Delete all messages permanently"
            icon="trash-outline"
            onPress={handleClearChat}
            danger
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety</Text>
          
          <ActionItem
            title="Report User"
            subtitle="Report inappropriate behavior"
            icon="flag-outline"
            onPress={handleReportUser}
            danger
          />
          
          <ActionItem
            title="Block User"
            subtitle="Block and stop receiving messages"
            icon="ban-outline"
            onPress={handleBlockUser}
            danger
          />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle" size={24} color={colors.accent} />
              <Text style={styles.infoTitle}>Chat Info</Text>
            </View>
            <Text style={styles.infoText}>
              Messages are encrypted end-to-end. Only you and {chat.name} can read them.
            </Text>
          </View>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  profileInitial: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.white,
  },
  profileDetails: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  profileStatus: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  viewProfileButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    height: buttonHeight.small,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewProfileText: {
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
  actionItem: {
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
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  actionSubtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  disappearingOptions: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.base,
  },
  disappearingTitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  timeOptionsContainer: {
    flexGrow: 0,
  },
  timeOption: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs + 2,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  timeOptionText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
  },
  infoSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.base,
  },
  infoCard: {
    backgroundColor: colors.surface,
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
  bottomSpace: {
    height: spacing.xl,
  },
});