import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const SocialDivider: React.FC = () => {
  const { theme } = useTheme();
  const themeColors = theme === 'dark' ? colors.dark : colors.light;

  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: themeColors.border }]} />
      <Text style={[styles.text, { color: themeColors.textSecondary, backgroundColor: themeColors.background }]}>
        OR
      </Text>
      <View style={[styles.line, { backgroundColor: themeColors.border }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    ...typography.label,
    paddingHorizontal: spacing.md,
  },
});
