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
// import { GoogleSignInButton } from "../../components/auth/GoogleSignInButton";
// import { SocialDivider } from "../../components/auth/SocialDivider";
// FIXED: replaced @react-native-google-signin/google-signin with
// expo-auth-session/providers/google
import { useFormValidation } from "../../hooks/useFormValidation";
import { ScreenWrapper } from "../../components/ScreenWrapper";

import { useAuth } from "../../context/AuthContext";
import { showAuthError } from "../../utils/errorHandler";

export const LoginScreen: React.FC<any> = ({ navigation }) => {
  const { theme } = useTheme();
  const themeColors = theme === "dark" ? colors.dark : colors.light;
  const { validateEmail } = useFormValidation();
  const { login: authLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = email.length > 0 ? validateEmail(email) : undefined;
  const isFormValid = isEmailValid && password.length >= 6;

  const handleLogin = async () => {
    if (!isFormValid) {
      if (!validateEmail(email)) {
        showAuthError({
          response: {
            status: 400,
            data: { message: "Please enter a valid email address." },
          },
        });
      } else if (password.length < 6) {
        showAuthError({
          response: {
            status: 400,
            data: { message: "Password must be at least 6 characters." },
          },
        });
      }
      return;
    }
    setIsLoading(true);
    try {
      await authLogin(email, password);
      // AuthProvider will automatically switch to AppNavigator
    } catch (error: any) {
      setIsLoading(false);
      showAuthError(error);
    }
  };

  return (
    <ScreenWrapper useSafeArea withKeyboardAvoidView>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
          <Ionicons name="logo-youtube" size={40} color={colors.primary} />
          <Text style={[styles.appName, { color: themeColors.textPrimary }]}>
            VidPlay
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400)}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            Welcome Back 👋
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Login to continue watching
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(400)} style={styles.form}>
          <AuthInput
            label="Email Address"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            isValid={isEmailValid}
            error={
              email.length > 0 && !isEmailValid
                ? "Please enter a valid email"
                : undefined
            }
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
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={[styles.forgotText, { color: colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <AuthButton
            title="Login"
            onPress={handleLogin}
            isLoading={isLoading}
            disabled={!isFormValid}
          />

          {/* <SocialDivider /> */}
          {/* <GoogleSignInButton onPress={() => promptAsync()} /> */}

          <View style={styles.footer}>
            <Text
              style={[styles.footerText, { color: themeColors.textSecondary }]}
            >
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={[styles.footerLink, { color: colors.primary }]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: spacing.screenPadding,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
    width: "100%",
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: spacing.xl,
  },
  forgotText: {
    ...typography.link,
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
