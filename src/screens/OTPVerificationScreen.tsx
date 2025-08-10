import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing, buttonHeight } from '../constants/spacing';

interface OTPVerificationScreenProps {
  navigation: any;
  route: any;
}

export default function OTPVerificationScreen({ navigation, route }: OTPVerificationScreenProps) {
  const { phoneNumber } = route.params;
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOTPChange = (value: string, index: number) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP');
      return;
    }
    
    navigation.navigate('ProfileSetup');
  };

  const handleResendOTP = () => {
    setTimer(30);
    setCanResend(false);
    setOTP(['', '', '', '', '', '']);
    Alert.alert('OTP Sent', 'A new OTP has been sent to your phone number');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail" size={40} color={colors.primary} />
          </View>
          
          <Text style={styles.title}>Verify Phone Number</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to{'\n'}
            <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          </Text>
        </View>

        <View style={styles.otpContainer}>
          <View style={styles.otpInputContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (otpRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  { borderColor: digit ? colors.primary : colors.border }
                ]}
                value={digit}
                onChangeText={(value) => handleOTPChange(value, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectionColor={colors.primary}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={[
              styles.verifyButton,
              { opacity: otp.join('').length === 6 ? 1 : 0.6 }
            ]}
            onPress={handleVerifyOTP}
            disabled={otp.join('').length !== 6}
          >
            <Text style={styles.verifyButtonText}>Verify OTP</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.timerText}>
            {canResend ? (
              <Text>
                Didn't receive the code?{' '}
                <TouchableOpacity onPress={handleResendOTP}>
                  <Text style={styles.resendText}>Resend</Text>
                </TouchableOpacity>
              </Text>
            ) : (
              `Resend OTP in ${timer}s`
            )}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  },
  phoneNumber: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily.semiBold,
  },
  otpContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing['3xl'],
    paddingHorizontal: spacing.md,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  verifyButton: {
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
  verifyButtonText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text.white,
  },
  footer: {
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  timerText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  resendText: {
    color: colors.primary,
    fontFamily: typography.fontFamily.semiBold,
    textDecorationLine: 'underline',
  },
});