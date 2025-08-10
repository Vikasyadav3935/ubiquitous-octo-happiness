import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, buttonHeight, inputHeight } from '../constants/spacing';

interface BlockReportUserScreenProps {
  navigation: any;
  route: any;
}

const reportReasons = [
  {
    id: 'inappropriate_messages',
    title: 'Inappropriate Messages',
    description: 'Sending offensive or sexual content'
  },
  {
    id: 'fake_profile',
    title: 'Fake Profile',
    description: 'Using fake photos or information'
  },
  {
    id: 'harassment',
    title: 'Harassment',
    description: 'Bullying or threatening behavior'
  },
  {
    id: 'spam',
    title: 'Spam',
    description: 'Sending repetitive or promotional content'
  },
  {
    id: 'underage',
    title: 'Underage User',
    description: 'Appears to be under 18 years old'
  },
  {
    id: 'offline_behavior',
    title: 'Offline Behavior',
    description: 'Inappropriate behavior during meetup'
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Something else that violates our guidelines'
  }
];

export default function BlockReportUserScreen({ navigation, route }: BlockReportUserScreenProps) {
  const { user, action } = route.params; // action: 'block' | 'report'
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (action === 'report' && !selectedReason) {
      Alert.alert('Select a Reason', 'Please select a reason for reporting this user');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      if (action === 'block') {
        Alert.alert(
          'User Blocked',
          `${user.name} has been blocked. They won't be able to see your profile or send you messages.`,
          [{ text: 'OK', onPress: () => navigation.navigate('MainApp') }]
        );
      } else {
        Alert.alert(
          'Report Submitted',
          'Thank you for reporting this user. We\'ll review your report and take appropriate action.',
          [{ text: 'OK', onPress: () => navigation.navigate('MainApp') }]
        );
      }
    }, 2000);
  };

  const ReasonItem = ({ reason }: { reason: typeof reportReasons[0] }) => (
    <TouchableOpacity
      style={[
        styles.reasonItem,
        {
          backgroundColor: selectedReason === reason.id ? colors.primary + '10' : colors.surface,
          borderColor: selectedReason === reason.id ? colors.primary : colors.border
        }
      ]}
      onPress={() => setSelectedReason(reason.id)}
    >
      <View style={styles.reasonLeft}>
        <View style={[
          styles.radioButton,
          { borderColor: selectedReason === reason.id ? colors.primary : colors.border }
        ]}>
          {selectedReason === reason.id && (
            <View style={styles.radioButtonSelected} />
          )}
        </View>
        
        <View style={styles.reasonText}>
          <Text style={[
            styles.reasonTitle,
            { color: selectedReason === reason.id ? colors.primary : colors.text.primary }
          ]}>
            {reason.title}
          </Text>
          <Text style={styles.reasonDescription}>{reason.description}</Text>
        </View>
      </View>
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
        
        <Text style={styles.headerTitle}>
          {action === 'block' ? 'Block User' : 'Report User'}
        </Text>
        
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitial}>{user.name?.charAt(0) || 'U'}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name || 'User'}</Text>
              <Text style={styles.userDescription}>
                {action === 'block' 
                  ? 'This user will be blocked from contacting you'
                  : 'Report this user for violating community guidelines'
                }
              </Text>
            </View>
          </View>
        </View>

        {action === 'block' ? (
          <View style={styles.section}>
            <View style={styles.warningCard}>
              <View style={styles.warningHeader}>
                <Ionicons name="warning" size={24} color={colors.warning} />
                <Text style={styles.warningTitle}>Block User</Text>
              </View>
              <Text style={styles.warningText}>
                When you block someone:{'\n\n'}
                • They won't be able to see your profile{'\n'}
                • They can't send you messages{'\n'}
                • You won't appear in each other's discovery{'\n'}
                • Your match will be removed{'\n\n'}
                You can unblock them later from your privacy settings.
              </Text>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Why are you reporting this user?</Text>
              <Text style={styles.sectionDescription}>
                Your report is anonymous and helps us keep the community safe.
              </Text>
              
              {reportReasons.map((reason) => (
                <ReasonItem key={reason.id} reason={reason} />
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Details (Optional)</Text>
              <Text style={styles.sectionDescription}>
                Provide more context to help us understand the situation better.
              </Text>
              
              <TextInput
                style={styles.detailsInput}
                placeholder="Tell us more about what happened..."
                placeholderTextColor={colors.text.light}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={additionalDetails}
                onChangeText={setAdditionalDetails}
                maxLength={500}
              />
              
              <Text style={styles.characterCount}>
                {additionalDetails.length}/500
              </Text>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <View style={styles.infoHeader}>
                  <Ionicons name="information-circle" size={24} color={colors.accent} />
                  <Text style={styles.infoTitle}>What Happens Next?</Text>
                </View>
                <Text style={styles.infoText}>
                  • Our safety team will review your report within 24 hours{'\n'}
                  • We may take action including warnings or account removal{'\n'}
                  • You'll be notified if we need more information{'\n'}
                  • Reports are confidential and anonymous
                </Text>
              </View>
            </View>
          </>
        )}

        <TouchableOpacity 
          style={[
            styles.submitButton,
            { 
              opacity: (action === 'report' && !selectedReason) || isSubmitting ? 0.6 : 1,
              backgroundColor: action === 'block' ? colors.error : colors.primary
            }
          ]}
          onPress={handleSubmit}
          disabled={(action === 'report' && !selectedReason) || isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting 
              ? 'Processing...' 
              : action === 'block' 
                ? 'Block User' 
                : 'Submit Report'
            }
          </Text>
        </TouchableOpacity>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            {action === 'block' 
              ? 'You can unblock users anytime from Privacy & Safety settings.'
              : 'False reports may result in action against your account. Please report only genuine violations.'
            }
          </Text>
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
  userSection: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.base,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  userInitial: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.white,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.sm * 1.2,
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
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    lineHeight: typography.lineHeight.sm * 1.2,
  },
  warningCard: {
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.warning,
    backgroundColor: colors.warning + '10',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  warningTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.warning,
    marginLeft: spacing.sm,
  },
  warningText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.sm * 1.3,
  },
  reasonItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  reasonLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
    marginTop: 2,
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  reasonText: {
    flex: 1,
  },
  reasonTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    marginBottom: spacing.xs,
  },
  reasonDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  detailsInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    height: 100,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
    backgroundColor: colors.background,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.light,
    textAlign: 'right',
    marginTop: spacing.xs,
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
    lineHeight: typography.lineHeight.sm * 1.3,
  },
  submitButton: {
    marginHorizontal: spacing.xl,
    height: buttonHeight.medium,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
  },
  footerSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.base,
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.sm * 1.2,
  },
  bottomSpace: {
    height: spacing.xl,
  },
});