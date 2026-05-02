import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { useFormValidation } from '../../hooks/useFormValidation';
import { ScreenWrapper } from '../../components/ScreenWrapper';

export const ForgotPasswordScreen: React.FC<any> = ({ navigation }) => {
  const { theme } = useTheme();
  const themeColors = theme === 'dark' ? colors.dark : colors.light;
  const { validateEmail } = useFormValidation();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isEmailValid = email.length > 0 ? validateEmail(email) : undefined;

  const handleSendLink = () => {
    if (!isEmailValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
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
          {isSuccess ? (
            <Animated.View entering={ZoomIn}>
              <Ionicons name="checkmark-circle" size={100} color={colors.success} />
            </Animated.View>
          ) : (
            <Ionicons name="lock-closed" size={100} color={themeColors.border} />
          )}
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.textCenter}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            {isSuccess ? 'Check Your Email' : 'Forgot Password?'}
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            {isSuccess 
              ? 'We have sent a password reset link to your email address.'
              : "Enter your email and we'll send you a reset link"
            }
          </Text>
        </Animated.View>

        {!isSuccess && (
          <Animated.View entering={FadeInUp.duration(600).delay(300)} style={styles.form}>
            <AuthInput
              label="Email Address"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              isValid={isEmailValid}
            />

            <AuthButton 
              title="Send Reset Link" 
              onPress={handleSendLink} 
              isLoading={isLoading}
              disabled={!isEmailValid}
            />
          </Animated.View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.footerLink, { color: colors.primary }]}>Back to Login</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: spacing.xl * 1.5,
  },
  title: {
    ...typography.heading,
    marginBottom: spacing.base,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subheading,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  form: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerLink: {
    ...typography.link,
    fontWeight: 'bold',
  },
});
