import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { authService } from '../services';

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;

interface SplashScreenProps {
  navigation: any;
}

export default function SplashScreen({ navigation }: SplashScreenProps) {
  
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user has stored auth token
      const isAuthenticated = await authService.isAuthenticated();
      
      if (!isAuthenticated) {
        // No token found, go to welcome screen
        navigation.replace('Welcome');
        return;
      }

      // Token exists, get user data to determine navigation
      const userResponse = await authService.getCurrentUser();
      
      if (userResponse.success && userResponse.data) {
        const user = userResponse.data;
        
        // Smart navigation based on user completion status
        if (!user.profile || !user.profile.firstName) {
          // No profile or missing required name - go to profile setup
          navigation.replace('ProfileSetup');
        } else if (!user.profile.answers || user.profile.answers.length === 0) {
          // Profile exists but no questions answered - go to questions
          navigation.replace('QuestionsFlow');
        } else {
          // Profile complete with name and questions - go to main app
          navigation.replace('MainApp');
        }
      } else {
        // Token exists but user data fetch failed, go to welcome
        navigation.replace('Welcome');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // On error, go to welcome screen
      navigation.replace('Welcome');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent={false} />
      <View style={[styles.safeArea, { paddingTop: STATUS_BAR_HEIGHT }]}>
        
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Ionicons name="heart" size={80} color={colors.primary} />
          </View>
          
          <Text style={styles.appName}>Connect</Text>
          <Text style={styles.tagline}>Find Your Perfect Match</Text>
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Checking authentication...</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
        
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    fontSize: typography.fontSize['4xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    marginBottom: spacing['4xl'],
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  loadingText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.secondary,
    marginTop: spacing.base,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  versionText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.light,
  },
});