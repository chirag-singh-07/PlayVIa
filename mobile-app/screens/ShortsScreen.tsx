import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { layout } from '../constants';
import { colors, typography } from '../theme';
import { videoService } from '../services/videoService';
import { ShortVideoItem } from '../components/ShortVideoItem';
import { CommentsModal } from '../components/CommentsModal';
import { useIsFocused } from '@react-navigation/native';

// ─── Ad Imports ───────────────────────────────────────────────────────────────
import { useShortsAd, type FeedItem } from '../hooks/ads/useShortsAd';
import { ShortsFeedAdCard } from '../components/ads/ShortsFeedAdCard';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

export const ShortsScreen: React.FC = () => {
  const isFocused = useIsFocused();
  const [originalShorts, setOriginalShorts] = useState<any[]>([]);
  const [rawShorts, setRawShorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');

  // ─── Ad Hook ─────────────────────────────────────────────────────────────
  // feedWithAds: rawShorts with ad-slot objects inserted every 5 items
  // onShortViewed: call on scroll snap — fires interstitial every 6 real views
  const { feedWithAds, onShortViewed } = useShortsAd(rawShorts);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const data = await videoService.getShorts();
        setOriginalShorts(data.videos || []);
        setRawShorts(data.videos || []);
      } catch (error) {
        console.error('Error fetching shorts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShorts();
  }, []);

  const openComments = (videoId: string) => {
    setSelectedVideoId(videoId);
    setIsCommentsVisible(true);
  };

  // ─── Render Item ──────────────────────────────────────────────────────────
  // Differentiates between real video items and ad placeholder items
  const renderItem = useCallback(
    ({ item, index }: { item: FeedItem; index: number }) => {
      // Render the ad card for ad-slot items
      if (item.type === 'ad') {
        return <ShortsFeedAdCard adIndex={(item as any).adIndex} />;
      }

      // Render a normal short video
      return (
        <ShortVideoItem
          item={item}
          isActive={index === activeVideoIndex && isFocused}
          onCommentPress={openComments}
        />
      );
    },
    [activeVideoIndex, isFocused]
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Loading Shorts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        // ✅ Use feedWithAds instead of rawShorts — includes ad slot items
        data={feedWithAds}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.y / WINDOW_HEIGHT
          );
          setActiveVideoIndex(index);

          // ✅ Trigger interstitial ad check after every scroll snap
          // The hook tracks real-video views and fires ad every 6th
          onShortViewed(index, feedWithAds);
        }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={2}
        windowSize={3}
        initialNumToRender={1}
        contentContainerStyle={{ paddingBottom: 70 }}
        // getItemLayout for performance — all items are WINDOW_HEIGHT tall
        getItemLayout={(_data, index) => ({
          length: WINDOW_HEIGHT,
          offset: WINDOW_HEIGHT * index,
          index,
        })}
        onEndReached={() => {
          if (originalShorts.length > 0) {
            setRawShorts(prev => [
              ...prev,
              ...originalShorts.map(short => ({
                ...short,
                _id: `${short._id}_loop_${Date.now()}_${Math.random().toString(36).substring(7)}`
              }))
            ]);
          }
        }}
        onEndReachedThreshold={0.5}
      />

      {/* Top Header Overlay */}
      <View style={styles.header} pointerEvents="box-none">
        <Text style={styles.headerTitle}>Shorts</Text>
        <TouchableOpacity>
          <Ionicons name="camera" size={28} color={colors.dark.white} />
        </TouchableOpacity>
      </View>

      <CommentsModal
        visible={isCommentsVisible}
        onClose={() => setIsCommentsVisible(false)}
        videoId={selectedVideoId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.black,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: layout.spacing.md,
    zIndex: 10,
  },
  headerTitle: {
    color: colors.dark.white,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as '700',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
