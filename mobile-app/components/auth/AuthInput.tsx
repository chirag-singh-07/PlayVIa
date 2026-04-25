import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface AuthInputProps extends TextInputProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  error?: string;
  isValid?: boolean;
  isPassword?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({ 
  label, 
  icon, 
  error, 
  isValid, 
  isPassword,
  ...props 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const themeColors = isDark ? colors.dark : colors.light;
  
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const containerStyle = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(
        error ? colors.error : 
        isValid ? colors.success : 
        isFocused ? colors.primary : themeColors.border,
        { duration: 200 }
      ),
      borderWidth: 1,
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    return {
      top: withTiming(isFocused || props.value ? -10 : 16, { duration: 200 }),
      fontSize: withTiming(isFocused || props.value ? 12 : 16, { duration: 200 }),
      color: withTiming(
        error ? colors.error : 
        isFocused ? colors.primary : themeColors.textSecondary,
        { duration: 200 }
      ),
      backgroundColor: themeColors.background,
    };
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.inputContainer, containerStyle, { backgroundColor: themeColors.surface }]}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={isFocused ? colors.primary : themeColors.textSecondary} 
          style={styles.icon} 
        />
        
        <Animated.Text style={[styles.floatingLabel, labelStyle]}>
          {label}
        </Animated.Text>
        
        <TextInput
          style={[styles.input, { color: themeColors.textPrimary }]}
          placeholderTextColor="transparent"
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.rightIcon}>
            <Ionicons 
              name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color={themeColors.textSecondary} 
            />
          </TouchableOpacity>
        )}

        {isValid && !isPassword && (
          <View style={styles.rightIcon}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          </View>
        )}
      </Animated.View>
      
      {error && (
        <Animated.Text style={styles.errorText}>
          {error}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: spacing.inputHeight,
    borderRadius: spacing.borderRadiusInputs,
    paddingHorizontal: spacing.md,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    ...typography.input,
  },
  floatingLabel: {
    position: 'absolute',
    left: 44, // past icon and padding
    paddingHorizontal: 4,
    ...typography.label,
  },
  rightIcon: {
    padding: spacing.base,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
