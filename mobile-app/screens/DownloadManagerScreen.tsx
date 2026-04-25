import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from '../components/ProgressBar';
import { MOCK_DATA, layout } from '../constants';
import { colors, typography } from '../theme';
import { ScreenWrapper } from '../components/ScreenWrapper';

export const DownloadManagerScreen: React.FC<any> = ({ navigation }) => {
  const downloads = [
    { ...MOCK_DATA.videos[0], progress: 100, status: 'Downloaded' },
    { ...MOCK_DATA.videos[1], progress: 45, status: 'Downloading...' },
  ];

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Downloads</Text>
      </View>

      <FlatList
        data={downloads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.downloadItem}>
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{item.duration}</Text>
              </View>
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.channelName}</Text>
              
              <View style={styles.progressContainer}>
                {item.progress < 100 ? (
                  <>
                    <ProgressBar progress={item.progress} />
                    <Text style={styles.statusText}>{item.status} ({item.progress}%)</Text>
                  </>
                ) : (
                  <View style={styles.completedStatus}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.dark.textSecondary} />
                    <Text style={[styles.statusText, { marginLeft: 4, marginTop: 0 }]}>{item.status}</Text>
                  </View>
                )}
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
  downloadItem: {
    flexDirection: 'row',
    paddingHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.lg,
  },
  thumbnailContainer: {
    width: 140,
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
    justifyContent: 'center',
  },
  title: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
    marginBottom: 4,
  },
  subtitle: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
  },
  progressContainer: {
    marginTop: 8,
  },
  statusText: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
    marginTop: 4,
  },
  completedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  moreBtn: {
    paddingLeft: layout.spacing.sm,
  },
});
