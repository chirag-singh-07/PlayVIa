import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, StatusBar, RefreshControl, Animated, ScrollView } from 'react-native';
import { Header } from '../components/Header';
import { VideoCard } from '../components/VideoCard';
import { colors } from '../theme';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { useScrollHeader } from '../hooks/useScrollHeader';
import { layout } from '../constants';
import { videoService } from '../services/videoService';
import { formatViews, formatTimeAgo, formatDuration, getCloudinaryThumbnail } from '../utils/videoUtils';

import { VideoSkeleton } from '../components/VideoSkeleton';

export const HomeScreen: React.FC<any> = ({ navigation }) => {
  const { onScroll, headerTranslateY } = useScrollHeader(60);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);

  const fetchVideos = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      const data = await videoService.getVideos();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchVideos(true);
  }, []);

  return (
    <ScreenWrapper edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark.background} />
      
      <Animated.View style={[styles.headerWrapper, { transform: [{ translateY: headerTranslateY }] }]}>
        <Header />
      </Animated.View>
      
      {loading ? (
        <ScrollView style={{ paddingTop: 60 }} showsVerticalScrollIndicator={false}>
          <VideoSkeleton />
          <VideoSkeleton />
          <VideoSkeleton />
        </ScrollView>
      ) : (
        <Animated.FlatList
          data={videos}
          keyExtractor={(item) => item._id} // MongoDB uses _id
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <VideoCard
              title={item.title}
              thumbnail={item.thumbnailUrl || getCloudinaryThumbnail(item.videoUrl) || ''}
              channelName={item.channel?.name || 'Unknown Channel'}
              channelAvatar={item.channel?.avatar || ''}
              views={formatViews(item.views || 0)}
              createdAt={formatTimeAgo(item.createdAt)}
              duration={formatDuration(item.duration)}
              onPress={() => navigation.navigate('VideoPlayer', { video: item })}
              onChannelPress={() => {
                if (item.channel?._id) {
                  navigation.navigate('ChannelProfile', { channelId: item.channel._id });
                }
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.listContent, { paddingTop: 60 }]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.dark.text}
              colors={[colors.dark.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState 
              title="No videos found" 
              message="Try refreshing the feed or check your internet connection."
              actionLabel="Refresh"
              onAction={onRefresh}
            />
          }
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.dark.background,
  },
  listContent: {
    paddingBottom: 20,
  },
  skeletonContainer: {
    marginBottom: layout.spacing.lg,
  },
  skeletonInfo: {
    flexDirection: 'row',
    padding: layout.spacing.md,
  },
  skeletonText: {
    flex: 1,
    marginLeft: layout.spacing.md,
    justifyContent: 'center',
  },
});
