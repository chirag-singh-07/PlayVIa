import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { AuthInput } from '../../components/auth/AuthInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { PasswordStrength } from '../../components/auth/PasswordStrength';
import { useFormValidation } from '../../hooks/useFormValidation';
import { ScreenWrapper } from '../../components/ScreenWrapper';

import { authService } from '../../services/authService';
import { Alert } from 'react-native';

export const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const { theme } = useTheme();
  const themeColors = theme === 'dark' ? colors.dark : colors.light;
  const { validateEmail, validatePhone, validateUsername, calculatePasswordScore } = useFormValidation();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordScore = calculatePasswordScore(formData.password);
  
  const isValid = 
    formData.name.length >= 2 &&
    validateUsername(formData.username) &&
    validateEmail(formData.email) &&
    validatePhone(formData.phone) &&
    passwordScore >= 3 &&
    formData.password === formData.confirmPassword &&
    agreed;

  const handleRegister = async () => {
    if (!isValid) return;
    setIsLoading(true);
    try {
      await authService.register(formData);
      setIsLoading(false);
      navigation.navigate('OTPVerification', { email: formData.email });
    } catch (error: any) {
      setIsLoading(false);
      const errorMsg = error.response?.data?.message || 'Failed to register. Please try again.';
      Alert.alert('Registration Failed', errorMsg);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        <Animated.View entering={FadeInUp.duration(600).delay(100)}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>Create Account 🎬</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Join millions of viewers
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.form}>
          <AuthInput
            label="Full Name"
            icon="person-outline"
            value={formData.name}
            onChangeText={(v) => updateField('name', v)}
          />

          <AuthInput
            label="Username"
            icon="at-outline"
            value={formData.username}
            onChangeText={(v) => updateField('username', v)}
            autoCapitalize="none"
          />

          <AuthInput
            label="Email Address"
            icon="mail-outline"
            value={formData.email}
            onChangeText={(v) => updateField('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AuthInput
            label="Phone Number"
            icon="call-outline"
            value={formData.phone}
            onChangeText={(v) => updateField('phone', v)}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <AuthInput
            label="Password"
            icon="lock-closed-outline"
            value={formData.password}
            onChangeText={(v) => updateField('password', v)}
            isPassword
          />

          {formData.password.length > 0 && (
            <PasswordStrength score={passwordScore} />
          )}

          <AuthInput
            label="Confirm Password"
            icon="lock-closed-outline"
            value={formData.confirmPassword}
            onChangeText={(v) => updateField('confirmPassword', v)}
            isPassword
            error={formData.confirmPassword && formData.password !== formData.confirmPassword ? "Passwords do not match" : undefined}
          />

          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreed(!agreed)}>
            <Ionicons 
              name={agreed ? "checkbox" : "square-outline"} 
              size={24} 
              color={agreed ? colors.primary : themeColors.textSecondary} 
            />
            <Text style={[styles.checkboxText, { color: themeColors.textSecondary }]}>
              I agree to Terms of Service and Privacy Policy
            </Text>
          </TouchableOpacity>

          <AuthButton 
            title="Create Account" 
            onPress={handleRegister} 
            isLoading={isLoading}
            disabled={!isValid}
          />

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>Login</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl * 2,
  },
  title: {
    ...typography.heading,
    marginBottom: spacing.base,
  },
  subtitle: {
    ...typography.subheading,
    marginBottom: spacing.xl,
  },
  form: {
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  checkboxText: {
    ...typography.label,
    marginLeft: spacing.sm,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.label,
  },
  footerLink: {
    ...typography.link,
  },
});
