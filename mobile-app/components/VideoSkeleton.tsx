import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';
import { colors } from '../theme';
import { layout } from '../constants';

const { width } = Dimensions.get('window');

export const VideoSkeleton = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.thumbnail, animatedStyle]} />
      <View style={styles.infoContainer}>
        <Animated.View style={[styles.avatar, animatedStyle]} />
        <View style={styles.textContainer}>
          <Animated.View style={[styles.title, animatedStyle]} />
          <Animated.View style={[styles.subtitle, animatedStyle]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: layout.spacing.lg,
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.dark.surface,
  },
  infoContainer: {
    flexDirection: 'row',
    padding: layout.spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.surface,
  },
  textContainer: {
    flex: 1,
    marginLeft: layout.spacing.md,
  },
  title: {
    height: 16,
    width: '80%',
    backgroundColor: colors.dark.surface,
    borderRadius: 4,
    marginBottom: 8,
  },
  subtitle: {
    height: 12,
    width: '40%',
    backgroundColor: colors.dark.surface,
    borderRadius: 4,
  },
});
