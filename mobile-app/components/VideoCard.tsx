import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { colors, typography } from '../theme';
import { layout } from '../constants';

interface VideoCardProps {
  title: string;
  thumbnail: string;
  channelName: string;
  channelAvatar: string;
  views: string;
  createdAt: string;
  duration: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  title,
  thumbnail,
  channelName,
  channelAvatar,
  views,
  createdAt,
  duration,
  onPress,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }, styles.container, style]}>
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Video: ${title} by ${channelName}`}
      >
        {/* Thumbnail */}
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} resizeMode="cover" />
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        </View>

        {/* Info Row */}
        <View style={styles.infoContainer}>
          <Avatar uri={channelAvatar} size={40} style={styles.avatar} />
          
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {channelName} • {views} views • {createdAt}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.moreButton}
            accessibilityRole="button"
            accessibilityLabel="More options"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="ellipsis-vertical" size={16} color={colors.dark.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: layout.spacing.lg,
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.dark.surface,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: layout.borderRadius.sm,
  },
  durationText: {
    color: colors.dark.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium as '500',
  },
  infoContainer: {
    flexDirection: 'row',
    paddingHorizontal: layout.spacing.md,
    paddingTop: layout.spacing.md,
  },
  avatar: {
    marginRight: layout.spacing.md,
  },
  textContainer: {
    flex: 1,
    paddingRight: layout.spacing.sm,
  },
  title: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium as '500',
    marginBottom: 4,
    lineHeight: 20,
  },
  subtitle: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
  },
  moreButton: {
    padding: 4,
  },
});
