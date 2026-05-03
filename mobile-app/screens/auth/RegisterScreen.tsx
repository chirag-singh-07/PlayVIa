import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeProvider";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import { AuthInput } from "../../components/auth/AuthInput";
import { AuthButton } from "../../components/auth/AuthButton";
import { PasswordStrength } from "../../components/auth/PasswordStrength";
import { useFormValidation } from "../../hooks/useFormValidation";
import { ScreenWrapper } from "../../components/ScreenWrapper";
// import { GoogleSignInButton } from "../../components/auth/GoogleSignInButton";
// import { SocialDivider } from "../../components/auth/SocialDivider";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { useAuth } from "../../context/AuthContext";

import { authService } from "../../services/authService";
import { showAuthError } from "../../utils/errorHandler";
import { Alert } from "react-native";

export const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;
  const {
    validateEmail,
    validatePhone,
    validateUsername,
    calculatePasswordScore,
  } = useFormValidation();
  const { googleLogin: authGoogleLogin } = useAuth();

  const handleGoogleSuccess = async (accessToken: string) => {
    setIsLoading(true);
    try {
      await authGoogleLogin(accessToken);
    } catch (error: any) {
      setIsLoading(false);
      showAuthError(error);
    }
  };

  const { promptAsync } = useGoogleAuth(handleGoogleSuccess);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordScore = calculatePasswordScore(formData.password);

  const isValid =
    formData.name.length >= 2 &&
    validateUsername(formData.username) &&
    validateEmail(formData.email) &&
    validatePhone(formData.phone) &&
    passwordScore >= 2 && // Reduced requirement for better UX
    formData.password === formData.confirmPassword &&
    agreed;

  const handleRegister = async () => {
    if (!isValid) {
      if (formData.name.length < 2) {
        Alert.alert(
          "👤 Name Too Short",
          "Please enter your full name (at least 2 characters).",
        );
      } else if (!validateUsername(formData.username)) {
        Alert.alert(
          "👤 Invalid Username",
          "Username must be 3–20 characters and can only contain letters, numbers, and underscores (_).",
        );
      } else if (!validateEmail(formData.email)) {
        Alert.alert(
          "📧 Invalid Email",
          "Please enter a valid email address (e.g. you@gmail.com).",
        );
      } else if (!validatePhone(formData.phone)) {
        Alert.alert(
          "📱 Invalid Phone",
          "Please enter a valid 10-digit phone number.",
        );
      } else if (passwordScore < 2) {
        Alert.alert(
          "🔐 Weak Password",
          "Your password is too weak.\n\nTip: Use at least 8 characters with a mix of letters and numbers.",
        );
      } else if (formData.password !== formData.confirmPassword) {
        Alert.alert(
          "🔐 Passwords Don't Match",
          "The passwords you entered don't match. Please re-enter them.",
        );
      } else if (!agreed) {
        Alert.alert(
          "📋 Terms Required",
          "Please agree to the Terms of Service and Privacy Policy to continue.",
        );
      }
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.register(formData);
      setIsLoading(false);
      navigation.navigate("OTPVerification", {
        email: formData.email,
        devOtp: response.devOtp,
      });
    } catch (error: any) {
      setIsLoading(false);
      showAuthError(error);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ScreenWrapper useSafeArea withKeyboardAvoidView>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={themeColors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInUp.duration(600).delay(100)}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            Create Account 🎬
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Join millions of viewers
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(600).delay(200)}
          style={styles.form}
        >
          <AuthInput
            label="Full Name"
            icon="person-outline"
            value={formData.name}
            onChangeText={(v) => updateField("name", v)}
            error={
              formData.name.length > 0 && formData.name.length < 2
                ? "Name too short"
                : undefined
            }
          />

          <AuthInput
            label="Username"
            icon="at-outline"
            value={formData.username}
            onChangeText={(v) => updateField("username", v)}
            autoCapitalize="none"
            error={
              formData.username.length > 0 &&
              !validateUsername(formData.username)
                ? "3-20 chars (alphanumeric/_)"
                : undefined
            }
          />

          <AuthInput
            label="Email Address"
            icon="mail-outline"
            value={formData.email}
            onChangeText={(v) => updateField("email", v)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={
              formData.email.length > 0 && !validateEmail(formData.email)
                ? "Invalid email address"
                : undefined
            }
          />

          <AuthInput
            label="Phone Number"
            icon="call-outline"
            value={formData.phone}
            onChangeText={(v) => updateField("phone", v)}
            keyboardType="phone-pad"
            maxLength={10}
            error={
              formData.phone.length > 0 && !validatePhone(formData.phone)
                ? "Enter 10 digit number"
                : undefined
            }
          />

          <AuthInput
            label="Password"
            icon="lock-closed-outline"
            value={formData.password}
            onChangeText={(v) => updateField("password", v)}
            isPassword
          />

          {formData.password.length > 0 && (
            <PasswordStrength score={passwordScore} />
          )}

          <AuthInput
            label="Confirm Password"
            icon="lock-closed-outline"
            value={formData.confirmPassword}
            onChangeText={(v) => updateField("confirmPassword", v)}
            isPassword
            error={
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword
                ? "Passwords do not match"
                : undefined
            }
          />

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreed(!agreed)}
          >
            <Ionicons
              name={agreed ? "checkbox" : "square-outline"}
              size={24}
              color={agreed ? colors.primary : themeColors.textSecondary}
            />
            <Text
              style={[
                styles.checkboxText,
                { color: themeColors.textSecondary },
              ]}
            >
              I agree to Terms of Service and Privacy Policy
            </Text>
          </TouchableOpacity>

          <AuthButton
            title="Create Account"
            onPress={handleRegister}
            isLoading={isLoading}
            disabled={!isValid}
          />

          {/* <SocialDivider /> */}
          {/* <GoogleSignInButton onPress={() => promptAsync()} /> */}

          <View style={styles.footer}>
            <Text
              style={[styles.footerText, { color: themeColors.textSecondary }]}
            >
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
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
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  checkboxText: {
    ...typography.label,
    marginLeft: spacing.sm,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.label,
  },
  footerLink: {
    ...typography.link,
  },
});
