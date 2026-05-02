import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { OTPInput } from '../../components/auth/OTPInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { useOTPTimer } from '../../hooks/useOTPTimer';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { authService } from '../../services/authService';
import { showAuthError } from '../../utils/errorHandler';

export const OTPVerificationScreen: React.FC<any> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const themeColors = theme === 'dark' ? colors.dark : colors.light;
  const { seconds, isActive, resetTimer } = useOTPTimer(30);

  const email = route?.params?.email || '';
  const devOtp = route?.params?.devOtp || null;

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If email failed to send and devOtp was returned, show a banner
  useEffect(() => {
    if (devOtp) {
      Alert.alert(
        '⚠️ Email Not Sent',
        `Email delivery failed.\n\nYour OTP for testing is:\n\n${devOtp}\n\nThis is only shown in development mode.`,
        [{ text: 'Copy OTP & Continue', style: 'default' }]
      );
    }
  }, [devOtp]);

  const handleVerify = async () => {
    const cleanOtp = otp.replace(/\D/g, '').trim();
    if (cleanOtp.length < 6) {
      Alert.alert(
        '🔢 Incomplete Code',
        'Please enter all 6 digits of the verification code sent to your email.'
      );
      return;
    }
    setIsLoading(true);
    try {
      await authService.verifyOtp(email, cleanOtp);
      setIsLoading(false);
      Alert.alert(
        '✅ Email Verified!',
        'Your account has been verified successfully. You can now log in.',
        [{ text: 'Go to Login', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      setIsLoading(false);

      // Special case: too many attempts
      const status = error.response?.status;
      const msg = error.response?.data?.message || '';
      if (status === 403 && msg.toLowerCase().includes('too many')) {
        Alert.alert(
          '🚫 Too Many Wrong Attempts',
          'You have entered the wrong OTP 3 times.\n\nPlease request a new code.',
          [
            { text: 'Resend New OTP', onPress: handleResend, style: 'default' },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        return;
      }

      showAuthError(error);
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendOtp(email);
      resetTimer();
      Alert.alert(
        '📧 New OTP Sent',
        `A fresh verification code has been sent to:\n${email}\n\nPlease check your inbox (and spam folder).`
      );
    } catch (error: any) {
      showAuthError(error);
    }
  };

  return (
    <ScreenWrapper useSafeArea withKeyboardAvoidView>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top:10, bottom:10, left:10, right:10}}>
          <Ionicons name="arrow-back" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.illustration}>
          <Ionicons name="chatbubble-ellipses-outline" size={80} color={colors.primary} />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.textCenter}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>Verify Your Account</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            We sent a 6-digit code to
          </Text>
          <Text style={[styles.emailText, { color: colors.primary }]}>
            {email}
          </Text>
        </Animated.View>

        {devOtp && (
          <Animated.View entering={FadeInUp.duration(400).delay(250)}>
            <View style={styles.devBanner}>
              <Ionicons name="warning-outline" size={16} color="#f59e0b" />
              <Text style={styles.devBannerText}>
                Dev Mode — OTP: <Text style={styles.devOtpText}>{devOtp}</Text>
              </Text>
            </View>
          </Animated.View>
        )}

        <Animated.View entering={FadeInUp.duration(600).delay(300)} style={styles.form}>
          <OTPInput length={6} onComplete={setOtp} />

          <AuthButton
            title="Verify Email"
            onPress={handleVerify}
            isLoading={isLoading}
            disabled={otp.replace(/\D/g, '').length !== 6}
          />

          <View style={styles.resendContainer}>
            {isActive ? (
              <Text style={[styles.timerText, { color: themeColors.textSecondary }]}>
                Resend code in 0:{seconds.toString().padStart(2, '0')}
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text style={[styles.resendText, { color: colors.primary }]}>
                  Didn't receive the code? Resend OTP
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.changeEmailContainer} onPress={() => navigation.goBack()}>
            <Text style={[styles.changeEmailText, { color: themeColors.textSecondary }]}>
              ← Use a different email address
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.screenPadding,
  },
  illustration: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  textCenter: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.heading,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subheading,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  timerText: {
    ...typography.label,
  },
  resendText: {
    ...typography.link,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  changeEmailContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  changeEmailText: {
    ...typography.link,
    textDecorationLine: 'underline',
  },
  devBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: spacing.md,
  },
  devBannerText: {
    color: '#92400e',
    fontSize: 13,
  },
  devOtpText: {
    fontWeight: '900',
    letterSpacing: 3,
    color: '#b45309',
  },
});
