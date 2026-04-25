import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  color?: string;
  unfilledColor?: string;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 4,
  color = colors.dark.primary,
  unfilledColor = colors.dark.border,
  style,
}) => {
  const boundedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={[styles.container, { height, backgroundColor: unfilledColor }, style]}>
      <View
        style={[
          styles.fill,
          { width: `${boundedProgress}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 2,
  },
  fill: {
    height: '100%',
  },
});
