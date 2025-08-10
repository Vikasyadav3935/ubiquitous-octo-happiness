import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, buttonHeight } from '../constants/spacing';

interface AboutScreenProps {
  navigation: any;
}

export default function AboutScreen({ navigation }: AboutScreenProps) {
  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  const InfoItem = ({ 
    icon, 
    title, 
    value, 
    onPress 
  }: {
    icon: string;
    title: string;
    value: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.infoItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.infoLeft}>
        <View style={styles.infoIcon}>
          <Ionicons name={icon as any} size={20} color={colors.primary} />
        </View>
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
      <View style={styles.infoRight}>
        <Text style={styles.infoValue}>{value}</Text>
        {onPress && <Ionicons name="chevron-forward" size={16} color={colors.text.light} />}
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
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <View style={styles.appLogo}>
            <Ionicons name="heart" size={60} color={colors.primary} />
          </View>
          <Text style={styles.appName}>Match</Text>
          <Text style={styles.appTagline}>Find Your Perfect Connection</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <InfoItem
            icon="information-circle-outline"
            title="Version"
            value="1.0.0"
          />
          
          <InfoItem
            icon="calendar-outline"
            title="Release Date"
            value="December 2024"
          />
          
          <InfoItem
            icon="people-outline"
            title="Developer"
            value="Match Team"
          />
          
          <InfoItem
            icon="construct-outline"
            title="Built with"
            value="React Native & Expo"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.featureText}>Smart personality-based matching</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.featureText}>Secure messaging system</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.featureText}>Advanced privacy controls</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.featureText}>Real-time compatibility scoring</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.featureText}>Professional photo verification</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal & Support</Text>
          
          <InfoItem
            icon="document-text-outline"
            title="Terms of Service"
            value="View"
            onPress={() => handleLinkPress('https://example.com/terms')}
          />
          
          <InfoItem
            icon="shield-outline"
            title="Privacy Policy"
            value="View"
            onPress={() => handleLinkPress('https://example.com/privacy')}
          />
          
          <InfoItem
            icon="help-circle-outline"
            title="Help Center"
            value="Visit"
            onPress={() => handleLinkPress('https://example.com/help')}
          />
          
          <InfoItem
            icon="mail-outline"
            title="Contact Support"
            value="Email Us"
            onPress={() => handleLinkPress('mailto:support@matchapp.com')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          
          <View style={styles.socialLinks}>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleLinkPress('https://instagram.com/matchapp')}
            >
              <Ionicons name="logo-instagram" size={24} color={colors.text.white} />
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleLinkPress('https://twitter.com/matchapp')}
            >
              <Ionicons name="logo-twitter" size={24} color={colors.text.white} />
              <Text style={styles.socialText}>Twitter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleLinkPress('https://facebook.com/matchapp')}
            >
              <Ionicons name="logo-facebook" size={24} color={colors.text.white} />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Made with ❤️ for meaningful connections
          </Text>
          <Text style={styles.copyrightText}>
            © 2024 Match App. All rights reserved.
          </Text>
        </View>

        <View style={styles.footerSpace} />
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
  logoSection: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    backgroundColor: colors.surface,
    marginBottom: spacing.base,
  },
  appLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appName: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  appTagline: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  infoTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
  },
  infoRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  featuresList: {
    paddingHorizontal: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  featureText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
    marginLeft: spacing.base,
    flex: 1,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xl,
  },
  socialButton: {
    backgroundColor: colors.primary,
    height: buttonHeight.small,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  socialText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.white,
    marginTop: spacing.xs,
  },
  footerSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  footerText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  copyrightText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  footerSpace: {
    height: spacing.xl,
  },
});