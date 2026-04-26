import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { layout } from '../constants';
import { colors, typography } from '../theme';
import { Avatar } from '../components/Avatar';
import { videoService } from '../services/videoService';
import { formatViews } from '../utils/videoUtils';
import { Video, ResizeMode } from 'expo-av';

import { ShortVideoItem } from '../components/ShortVideoItem';
import { CommentsModal } from '../components/CommentsModal';
import { useIsFocused } from '@react-navigation/native';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

export const ShortsScreen: React.FC = () => {
  const isFocused = useIsFocused();
  const [shorts, setShorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const data = await videoService.getShorts();
        setShorts(data.videos || []);
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

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    return (
      <ShortVideoItem 
        item={item} 
        isActive={index === activeVideoIndex && isFocused} 
        onCommentPress={openComments}
      />
    );
  };

  if (loading) return (
    <View style={[styles.container, { justifyContent: 'center' }]}>
      <Text style={{color: 'white', textAlign: 'center'}}>Loading Shorts...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={shorts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / WINDOW_HEIGHT);
          setActiveVideoIndex(index);
        }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={2}
        windowSize={3}
        initialNumToRender={1}
        contentContainerStyle={{ paddingBottom: 70 }}
      />
      
      {/* Top Header Overlay */}
      <View style={styles.header}>
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
  shortContainer: {
    height: WINDOW_HEIGHT,
    width: Dimensions.get('window').width,
    position: 'relative',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
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
  actionsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 150,
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
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 80,
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
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subscribeBtn: {
    backgroundColor: colors.dark.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  subscribeText: {
    color: colors.dark.white,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold as '700',
  },
  title: {
    color: colors.dark.white,
    fontSize: typography.sizes.md,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
