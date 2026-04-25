import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, typography } from '../theme';
import { layout } from '../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  disabled = false,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryContainer;
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'ghost':
        return styles.ghostContainer;
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.smContainer;
      case 'md':
        return styles.mdContainer;
      case 'lg':
        return styles.lgContainer;
      default:
        return styles.mdContainer;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.baseContainer,
        getContainerStyle(),
        getSizeStyle(),
        disabled && styles.disabledContainer,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.baseText, getTextStyle(), disabled && styles.disabledText, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: layout.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  baseText: {
    fontWeight: typography.weights.medium as '500',
  },
  // Sizes
  smContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mdContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  lgContainer: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  // Variants
  primaryContainer: {
    backgroundColor: colors.dark.white, // YouTube style subscribe button is usually white on dark mode
  },
  primaryText: {
    color: colors.dark.black,
    fontSize: typography.sizes.md,
  },
  secondaryContainer: {
    backgroundColor: colors.dark.surface,
  },
  secondaryText: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  outlineText: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
  },
  // Disabled
  disabledContainer: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});
