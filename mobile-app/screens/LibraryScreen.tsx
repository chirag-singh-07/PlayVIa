import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoCard } from '../components/VideoCard';
import { MOCK_DATA, layout } from '../constants';
import { colors, typography } from '../theme';
import { ScreenWrapper } from '../components/ScreenWrapper';

import { historyService } from '../services/historyService';
import { ActivityIndicator } from 'react-native';
import { formatViews } from '../utils/videoUtils';

export const LibraryScreen: React.FC<any> = ({ navigation }) => {
  const [history, setHistory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await historyService.getWatchHistory();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching watch history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const MenuItem = ({ icon, title, subtitle, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color={colors.dark.text} style={styles.menuIcon} />
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );

  if (loading) return (
    <ScreenWrapper>
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.dark.primary} />
       </View>
    </ScreenWrapper>
  );

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Library</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={24} color={colors.dark.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Recent Watch History Preview */}
        <View style={styles.sectionHeader}>
          <Ionicons name="time-outline" size={20} color={colors.dark.text} />
          <Text style={styles.sectionTitle}>History</Text>
          <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('History')}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroll}>
          {history.length > 0 ? history.map((item) => (
            <View key={item._id} style={{ width: 160, marginRight: layout.spacing.md }}>
               <VideoCard
                title={item.video?.title || 'Video unavailable'}
                thumbnail={item.video?.thumbnailUrl || ''}
                channelName={item.video?.channel?.name || ''}
                channelAvatar={item.video?.channel?.avatar || ''}
                views={formatViews(item.video?.views || 0)}
                createdAt="" // History timestamp could go here
                duration={item.video?.duration || 0}
                onPress={() => navigation.navigate('VideoPlayer', { video: item.video })}
              />
            </View>
          )) : (
            <Text style={{ color: colors.dark.textSecondary, marginLeft: layout.spacing.md }}>No history found</Text>
          )}
        </ScrollView>

        <View style={styles.divider} />

        {/* Library Options */}
        <MenuItem 
          icon="play-circle-outline" 
          title="Your Videos" 
          onPress={() => navigation.navigate('YourVideos')} 
        />
        <MenuItem 
          icon="download-outline" 
          title="Downloads" 
          subtitle="20 videos" 
          onPress={() => navigation.navigate('DownloadManager')} 
        />
        <MenuItem 
          icon="bookmark-outline" 
          title="Saved Videos" 
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as '700',
  },
  headerActions: {
    flexDirection: 'row',
  },
  content: {
    paddingVertical: layout.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.md,
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
    marginLeft: layout.spacing.sm,
    flex: 1,
  },
  viewAllBtn: {},
  viewAllText: {
    color: colors.dark.primary, // Using primary color (e.g. red/blue) for link
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium as '500',
  },
  historyScroll: {
    paddingLeft: layout.spacing.md,
    marginBottom: layout.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: layout.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.lg,
  },
  menuIcon: {
    marginRight: layout.spacing.lg,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
  },
  menuSubtitle: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    marginTop: 2,
  },
});
