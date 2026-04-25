import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar } from './Avatar';
import { colors, typography } from '../theme';
import { layout } from '../constants';

interface NotificationItemProps {
  type: 'video' | 'like' | 'comment';
  message: string;
  timestamp: string;
  avatarUri: string;
  isRead: boolean;
  onPress?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  message,
  timestamp,
  avatarUri,
  isRead,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, !isRead && styles.unreadContainer]} 
      activeOpacity={0.7} 
      onPress={onPress}
    >
      {!isRead && <View style={styles.unreadDot} />}
      <Avatar uri={avatarUri} size={48} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.message} numberOfLines={3}>
          {message}
        </Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
      {/* Optional thumbnail for videos */}
      {type === 'video' && (
        <View style={styles.videoThumbnailPlaceholder} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: layout.spacing.md,
    alignItems: 'center',
    backgroundColor: colors.dark.background,
  },
  unreadContainer: {
    backgroundColor: 'rgba(255,0,0,0.05)',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.dark.primary,
    position: 'absolute',
    left: 6,
  },
  avatar: {
    marginRight: layout.spacing.md,
  },
  content: {
    flex: 1,
    marginRight: layout.spacing.md,
  },
  message: {
    color: colors.dark.text,
    fontSize: typography.sizes.sm,
    lineHeight: 18,
    marginBottom: 4,
  },
  timestamp: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
  },
  videoThumbnailPlaceholder: {
    width: 80,
    height: 45,
    backgroundColor: colors.dark.surface,
    borderRadius: layout.borderRadius.sm,
  },
});
