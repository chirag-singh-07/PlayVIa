import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, StatusBar, RefreshControl, Animated } from 'react-native';
import { Header } from '../components/Header';
import { VideoCard } from '../components/VideoCard';
import { MOCK_DATA } from '../constants';
import { colors } from '../theme';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { useScrollHeader } from '../hooks/useScrollHeader';
import { layout } from '../constants';

export const HomeScreen: React.FC<any> = ({ navigation }) => {
  const { onScroll, headerTranslateY } = useScrollHeader(60);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    // Simulate fetching
    setTimeout(() => {
      setVideos(MOCK_DATA.videos);
      setLoading(false);
    }, 1500);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setVideos(MOCK_DATA.videos); // Or new data
      setRefreshing(false);
    }, 1000);
  }, []);

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <SkeletonLoader height={200} borderRadius={0} />
      <View style={styles.skeletonInfo}>
        <SkeletonLoader width={40} height={40} borderRadius={20} />
        <View style={styles.skeletonText}>
          <SkeletonLoader width="90%" height={16} style={{ marginBottom: 8 }} />
          <SkeletonLoader width="60%" height={14} />
        </View>
      </View>
    </View>
  );

  return (
    <ScreenWrapper edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark.background} />
      
      <Animated.View style={[styles.headerWrapper, { transform: [{ translateY: headerTranslateY }] }]}>
        <Header />
      </Animated.View>
      
      {loading ? (
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(item) => item.toString()}
          renderItem={renderSkeleton}
          contentContainerStyle={{ paddingTop: 60 }} // Header offset
        />
      ) : (
        <Animated.FlatList
          data={videos}
          keyExtractor={(item) => item.id}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <VideoCard
              title={item.title}
              thumbnail={item.thumbnail}
              channelName={item.channelName}
              channelAvatar={item.channelAvatar}
              views={item.views}
              createdAt={item.createdAt}
              duration={item.duration}
              onPress={() => navigation.navigate('VideoPlayer', { video: item })}
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
