import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "./Avatar";
import { colors, typography } from "../theme";
import { layout } from "../constants";
import { Ionicons } from "@expo/vector-icons";

interface NotificationItemProps {
  type: string;
  message: string;
  timestamp: string;
  avatarUri: string;
  isRead: boolean;
  icon?: string;
  iconColor?: string;
  onPress?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  message,
  timestamp,
  avatarUri,
  isRead,
  icon,
  iconColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, !isRead && styles.unreadContainer]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {!isRead && <View style={styles.unreadDot} />}
      <View style={styles.avatarWrapper}>
        <Avatar uri={avatarUri} size={48} style={styles.avatar} />
        {icon && (
          <View
            style={[
              styles.iconBadge,
              { backgroundColor: iconColor || colors.dark.primary },
            ]}
          >
            <Ionicons name={icon as any} size={10} color="white" />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text
          style={[styles.message, !isRead && styles.unreadMessage]}
          numberOfLines={3}
        >
          {message}
        </Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
      {type === "video" && (
        <View style={styles.videoThumbnailPlaceholder}>
          <Ionicons
            name="play-circle"
            size={16}
            color={colors.dark.textSecondary}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: layout.spacing.md,
    alignItems: "center",
    backgroundColor: colors.dark.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border + '20',
  },
  unreadContainer: {
    backgroundColor: "rgba(255,0,0,0.03)",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.dark.primary,
    position: "absolute",
    left: 4,
  },
  avatarWrapper: {
    position: "relative",
    marginRight: layout.spacing.md,
  },
  avatar: {
    marginRight: 0,
  },
  iconBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.dark.background,
  },
  content: {
    flex: 1,
    marginRight: layout.spacing.md,
  },
  message: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    lineHeight: 18,
    marginBottom: 4,
  },
  unreadMessage: {
    color: colors.dark.text,
    fontWeight: "700",
  },
  timestamp: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
    opacity: 0.7,
  },
  videoThumbnailPlaceholder: {
    width: 80,
    height: 45,
    backgroundColor: colors.dark.surface,
    borderRadius: layout.borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
});
