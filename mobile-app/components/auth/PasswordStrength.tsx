import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeProvider';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface PasswordStrengthProps {
  score: number; // 0 to 4
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ score }) => {
  const { theme } = useTheme();
  const themeColors = theme === 'dark' ? colors.dark : colors.light;

  const getStrengthColor = () => {
    switch (score) {
      case 1: return colors.error;
      case 2: return colors.warning;
      case 3: return '#9CCC65'; // light green
      case 4: return colors.success;
      default: return themeColors.border;
    }
  };

  const getStrengthText = () => {
    switch (score) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return 'Password Strength';
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const widthPercent = score === 0 ? 0 : (score / 4) * 100;
    return {
      width: withTiming(`${widthPercent}%`, { duration: 300 }),
      backgroundColor: withTiming(getStrengthColor(), { duration: 300 }),
    };
  });

  return (
    <View style={styles.container}>
      <View style={[styles.barBackground, { backgroundColor: themeColors.surface }]}>
        <Animated.View style={[styles.barFill, animatedStyle]} />
      </View>
      <Text style={[styles.text, { color: getStrengthColor() }]}>
        {getStrengthText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  barBackground: {
    height: 4,
    width: '100%',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  text: {
    ...typography.label,
    fontSize: 12,
    textAlign: 'right',
  },
});
