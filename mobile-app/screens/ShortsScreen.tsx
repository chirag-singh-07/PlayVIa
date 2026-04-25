import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_DATA, layout } from '../constants';
import { colors, typography } from '../theme';
import { Avatar } from '../components/Avatar';

// For a real app, use FlatList with pagingEnabled or a specialized library like react-native-reanimated-carousel
// Here we just show a static UI for the first short

export const ShortsScreen: React.FC = () => {
  const short = MOCK_DATA.shorts[0];

  return (
    <View style={styles.container}>
      {/* Video Player Placeholder */}
      <Image source={{ uri: short.videoUrl }} style={styles.videoBackground} resizeMode="cover" />
      
      {/* Dark Gradient Overlay for readability (simulated) */}
      <View style={styles.overlay} />

      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shorts</Text>
        <TouchableOpacity>
          <Ionicons name="camera-outline" size={28} color={colors.dark.white} />
        </TouchableOpacity>
      </View>

      {/* Right Side Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.actionItem}>
          <Ionicons name="thumbs-up-outline" size={32} color={colors.dark.white} />
          <Text style={styles.actionText}>{short.likes}</Text>
        </View>
        <View style={styles.actionItem}>
          <Ionicons name="thumbs-down-outline" size={32} color={colors.dark.white} />
          <Text style={styles.actionText}>Dislike</Text>
        </View>
        <View style={styles.actionItem}>
          <Ionicons name="chatbubble-outline" size={32} color={colors.dark.white} />
          <Text style={styles.actionText}>{short.comments}</Text>
        </View>
        <View style={styles.actionItem}>
          <Ionicons name="arrow-redo-outline" size={32} color={colors.dark.white} />
          <Text style={styles.actionText}>Share</Text>
        </View>
      </View>

      {/* Bottom Info */}
      <View style={styles.bottomInfo}>
        <View style={styles.channelRow}>
          <Avatar uri={short.channelAvatar} size={36} />
          <Text style={styles.channelName}>{short.channelName}</Text>
          <TouchableOpacity style={styles.subscribeBtn}>
            <Text style={styles.subscribeText}>Subscribe</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title} numberOfLines={2}>{short.title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.black,
  },
  videoBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: layout.spacing.md,
  },
  headerTitle: {
    color: colors.dark.white,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as '700',
  },
  actionsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 120,
    alignItems: 'center',
  },
  actionItem: {
    alignItems: 'center',
    marginBottom: layout.spacing.lg,
  },
  actionText: {
    color: colors.dark.white,
    fontSize: typography.sizes.sm,
    marginTop: 4,
    fontWeight: typography.weights.medium as '500',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 80, // give space for actions
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  channelName: {
    color: colors.dark.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium as '500',
    marginLeft: layout.spacing.sm,
    marginRight: layout.spacing.md,
  },
  subscribeBtn: {
    backgroundColor: colors.dark.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: layout.borderRadius.full,
  },
  subscribeText: {
    color: colors.dark.black,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold as '700',
  },
  title: {
    color: colors.dark.white,
    fontSize: typography.sizes.md,
    lineHeight: 20,
  },
});
