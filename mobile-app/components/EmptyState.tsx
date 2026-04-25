import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { typography } from '../theme';
import { layout } from '../constants';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'folder-open-outline',
  title,
  message,
  actionLabel,
  onAction,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container} accessibilityRole="none" accessibilityLabel={`Empty state: ${title}`}>
      <Ionicons name={icon} size={64} color={colors.textSecondary} style={styles.icon} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {message && <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} style={styles.button} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.spacing.xl,
    minHeight: 300,
  },
  icon: {
    marginBottom: layout.spacing.md,
    opacity: 0.8,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
    marginBottom: layout.spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.sizes.md,
    textAlign: 'center',
    marginBottom: layout.spacing.lg,
    lineHeight: 22,
  },
  button: {
    minWidth: 150,
  },
});
