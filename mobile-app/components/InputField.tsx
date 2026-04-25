import React from 'react';
import { TextInput, View, StyleSheet, TextInputProps, Text } from 'react-native';
import { colors, typography } from '../theme';
import { layout } from '../constants';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, error, style, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.dark.textSecondary}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: layout.spacing.md,
    width: '100%',
  },
  label: {
    color: colors.dark.text,
    fontSize: typography.sizes.sm,
    marginBottom: layout.spacing.xs,
    fontWeight: typography.weights.medium as '500',
  },
  inputContainer: {
    backgroundColor: colors.dark.surface,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: colors.dark.primary,
  },
  input: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.md,
  },
  errorText: {
    color: colors.dark.primary,
    fontSize: typography.sizes.xs,
    marginTop: 4,
  },
});
