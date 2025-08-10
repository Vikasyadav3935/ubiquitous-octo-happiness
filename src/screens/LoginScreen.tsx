import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, buttonHeight, inputHeight } from '../constants/spacing';

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode] = useState('+91');

  const handleSendOTP = () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 10-digit phone number');
      return;
    }
    navigation.navigate('OTPVerification', { phoneNumber: countryCode + phoneNumber });
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    return cleaned.slice(0, 10);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="phone-portrait" size={40} color={colors.primary} />
            </View>
            
            <Text style={styles.title}>Enter Your Phone Number</Text>
            <Text style={styles.subtitle}>
              We'll send you a verification code to confirm your number
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCodeContainer}>
                <Text style={styles.countryCode}>{countryCode}</Text>
              </View>
              
              <TextInput
                style={styles.phoneInput}
                placeholder="Enter phone number"
                placeholderTextColor={colors.text.light}
                keyboardType="phone-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.sendOTPButton,
                { opacity: phoneNumber.length === 10 ? 1 : 0.6 }
              ]}
              onPress={handleSendOTP}
              disabled={phoneNumber.length !== 10}
            >
              <Text style={styles.sendOTPButtonText}>Send OTP</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text style={styles.linkText}>Terms & Conditions</Text>
              {' '}and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    marginVertical:spacing.lg
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.base,
    marginBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['4xl'],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.base,
    paddingHorizontal: spacing.lg,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  countryCodeContainer: {
    paddingHorizontal: spacing.base,
    height: inputHeight.medium,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    justifyContent: 'center',
  },
  countryCode: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: spacing.base,
    height: inputHeight.medium,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
  },
  sendOTPButton: {
    backgroundColor: colors.primary,
    height: buttonHeight.medium,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendOTPButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
  },
  footer: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.sm,
  },
  linkText: {
    color: colors.primary,
    fontFamily: typography.fontFamily.medium,
  },
});