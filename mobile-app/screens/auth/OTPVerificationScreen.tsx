import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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

export const OTPVerificationScreen: React.FC<any> = ({ navigation, route }) => {
  const { theme } = useTheme();
  const themeColors = theme === 'dark' ? colors.dark : colors.light;
  const { seconds, isActive, resetTimer } = useOTPTimer(30);

  const phone = route?.params?.phone || '+91 9876543210';
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = () => {
    if (otp.length < 6) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // navigation.replace('Main');
    }, 1500);
  };

  return (
    <ScreenWrapper useSafeArea>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top:10, bottom:10, left:10, right:10}}>
          <Ionicons name="arrow-back" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.illustration}>
          <Ionicons name="chatbubble-ellipses-outline" size={80} color={colors.primary} />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.textCenter}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>Verify Your Account</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            We sent a 6-digit code to {phone}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(300)} style={styles.form}>
          <OTPInput length={6} onComplete={setOtp} />

          <AuthButton 
            title="Verify" 
            onPress={handleVerify} 
            isLoading={isLoading}
            disabled={otp.length !== 6}
          />

          <View style={styles.resendContainer}>
            {isActive ? (
              <Text style={[styles.timerText, { color: themeColors.textSecondary }]}>
                Resend in 0:{seconds.toString().padStart(2, '0')}
              </Text>
            ) : (
              <TouchableOpacity onPress={resetTimer}>
                <Text style={[styles.resendText, { color: colors.primary }]}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity style={styles.changePhoneContainer}>
            <Text style={[styles.changePhoneText, { color: themeColors.textSecondary }]}>
              Change phone number
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAwareScrollView>
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
    marginBottom: spacing.base,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subheading,
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
  },
  changePhoneContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  changePhoneText: {
    ...typography.link,
    textDecorationLine: 'underline',
  },
});
