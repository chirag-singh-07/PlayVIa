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
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton';
import { SocialDivider } from '../../components/auth/SocialDivider';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { ScreenWrapper } from '../../components/ScreenWrapper';

export const LoginScreen: React.FC<any> = ({ navigation }) => {
  const { theme } = useTheme();
  const themeColors = theme === 'dark' ? colors.dark : colors.light;
  const { validateEmail } = useFormValidation();
  const { promptAsync } = useGoogleAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = email.length > 0 ? validateEmail(email) : undefined;
  const isFormValid = isEmailValid && password.length >= 6;

  const handleLogin = () => {
    if (!isFormValid) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // navigation.replace('Main'); // Would navigate to main app here
    }, 1500);
  };

  return (
    <ScreenWrapper useSafeArea>
      <KeyboardAwareScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.header}>
          <Ionicons name="logo-youtube" size={40} color={colors.primary} />
          <Text style={[styles.appName, { color: themeColors.textPrimary }]}>VidPlay</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(200)}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>Welcome Back 👋</Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Login to continue watching
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(300)} style={styles.form}>
          <AuthInput
            label="Email Address"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            isValid={isEmailValid}
            error={email.length > 0 && !isEmailValid ? "Please enter a valid email" : undefined}
          />

          <AuthInput
            label="Password"
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <TouchableOpacity 
            style={styles.forgotBtn}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <AuthButton 
            title="Login" 
            onPress={handleLogin} 
            isLoading={isLoading}
            disabled={!isFormValid}
          />

          <SocialDivider />

          <GoogleSignInButton onPress={() => promptAsync()} />

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>Register</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAwareScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: spacing.screenPadding,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  appName: {
    ...typography.heading,
    marginLeft: spacing.sm,
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
  },
  forgotText: {
    ...typography.link,
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
