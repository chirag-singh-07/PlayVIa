import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { VideoCard } from '../components/VideoCard';
import { historyService } from '../services/historyService';
import { colors, typography } from '../theme';
import { layout } from '../constants';
import { formatViews } from '../utils/videoUtils';

export const HistoryScreen: React.FC<any> = ({ navigation }) => {
  const [history, setHistory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchHistory = async () => {
    try {
      const data = await historyService.getWatchHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching watch history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const clearHistory = async () => {
    // Implement clear all history in service if needed
    // For now just show alert
    alert('Clear history functionality coming soon');
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.dark.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Watch History</Text>
        <TouchableOpacity onPress={clearHistory}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <VideoCard
              title={item.video?.title || 'Video unavailable'}
              thumbnail={item.video?.thumbnailUrl || ''}
              channelName={item.video?.channel?.name || ''}
              channelAvatar={item.video?.channel?.avatar || ''}
              views={formatViews(item.video?.views || 0)}
              createdAt={new Date(item.watchedAt).toLocaleDateString()}
              duration={item.video?.duration || 0}
              onPress={() => navigation.navigate('VideoPlayer', { video: item.video })}
            />
          </View>
        )}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={64} color={colors.dark.textSecondary} />
            <Text style={styles.emptyText}>Your watch history will appear here</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
  },
  clearText: {
    color: colors.dark.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium as '500',
  },
  listContent: {
    paddingBottom: layout.spacing.xl,
  },
  historyItem: {
    marginBottom: layout.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: colors.dark.textSecondary,
    marginTop: layout.spacing.md,
    fontSize: typography.sizes.md,
  },
});
