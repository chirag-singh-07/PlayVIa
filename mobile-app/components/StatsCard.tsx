import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import { layout } from '../constants';

interface StatsCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color={colors.dark.text} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dark.surface,
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: layout.spacing.xs,
  },
  iconContainer: {
    marginBottom: layout.spacing.sm,
  },
  value: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
    marginBottom: 2,
  },
  title: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
    textAlign: 'center',
  },
});
