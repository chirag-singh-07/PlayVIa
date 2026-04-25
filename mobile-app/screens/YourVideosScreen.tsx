import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_DATA, layout } from '../constants';
import { colors, typography } from '../theme';
import { ScreenWrapper } from '../components/ScreenWrapper';

export const YourVideosScreen: React.FC<any> = ({ navigation }) => {
  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Videos</Text>
      </View>

      <FlatList
        data={MOCK_DATA.videos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.videoItem}>
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{item.duration}</Text>
              </View>
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.stats}>{item.views} views • {item.createdAt}</Text>
              <View style={styles.visibilityRow}>
                <Ionicons name="earth" size={14} color={colors.dark.textSecondary} />
                <Text style={styles.visibilityText}>Public</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.moreBtn}>
              <Ionicons name="ellipsis-vertical" size={20} color={colors.dark.text} />
            </TouchableOpacity>
          </View>
        )}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  backBtn: {
    marginRight: layout.spacing.md,
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
  },
  listContent: {
    paddingTop: layout.spacing.md,
  },
  videoItem: {
    flexDirection: 'row',
    paddingHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.lg,
  },
  thumbnailContainer: {
    width: 160,
    aspectRatio: 16 / 9,
    backgroundColor: colors.dark.surface,
    borderRadius: layout.borderRadius.sm,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  durationText: {
    color: colors.dark.white,
    fontSize: typography.sizes.xs,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: layout.spacing.md,
  },
  title: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
    marginBottom: 4,
  },
  stats: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    marginBottom: 4,
  },
  visibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visibilityText: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
    marginLeft: 4,
  },
  moreBtn: {
    paddingLeft: layout.spacing.sm,
  },
});
