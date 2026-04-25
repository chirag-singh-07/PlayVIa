import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../components/Avatar';
import { colors, typography } from '../theme';
import { layout } from '../constants';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { videoService } from '../services/videoService';
import { channelService } from '../services/channelService';
import { commentService } from '../services/commentService';
import { historyService } from '../services/historyService';
import { useAuth } from '../context/AuthContext';
import { formatViews, formatTimeAgo, formatDuration } from '../utils/videoUtils';
import { Alert, Share } from 'react-native';

import { Video, ResizeMode } from 'expo-av';

export const VideoPlayerScreen: React.FC<any> = ({ route, navigation }) => {
  const { isAuthenticated, user: currentUser } = useAuth();
  const { video: initialVideo } = route.params || {};
  const [video, setVideo] = useState<any>(initialVideo || {});
  const [loading, setLoading] = useState(!initialVideo);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [showControls, setShowControls] = useState(true);
  const [isLandscape, setIsLandscape] = useState(Dimensions.get('window').width > Dimensions.get('window').height);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const hideControlsTimeout = useRef<any>(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (initialVideo?._id) {
        try {
          const detailedVideo = await videoService.getVideoById(initialVideo._id);
          setVideo(detailedVideo);
          
          if (isAuthenticated) {
            setIsLiked(detailedVideo.likes?.includes(currentUser?._id));
            // Add to watch history
            historyService.addToHistory(initialVideo._id).catch(err => console.error('Error adding to history:', err));
          }

          const videoComments = await commentService.getVideoComments(initialVideo._id);
          setComments(videoComments);
        } catch (error) {
          console.error('Error fetching video details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchVideoDetails();
  }, [initialVideo?._id]);

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setIsLandscape(width > height);
    };
    const subscription = Dimensions.addEventListener('change', updateOrientation);
    return () => subscription.remove();
  }, []);

  const toggleControls = () => {
    if (showControls) {
      Animated.timing(controlsOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setShowControls(false));
    } else {
      setShowControls(true);
      Animated.timing(controlsOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      scheduleHideControls();
    }
  };

  const scheduleHideControls = () => {
    if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    hideControlsTimeout.current = setTimeout(() => {
      Animated.timing(controlsOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setShowControls(false));
    }, 3000);
  };

  const togglePlay = () => {
    if (status.isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
    scheduleHideControls();
  };

  const toggleLike = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to like videos.');
      return;
    }
    try {
      const result = await videoService.toggleLike(video._id);
      setIsLiked(!isLiked);
      setVideo({ ...video, likesCount: result.likesCount });
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const toggleSubscribe = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to subscribe.');
      return;
    }
    try {
      if (video.channel?._id) {
        await channelService.subscribeToChannel(video.channel._id);
        setIsSubscribed(!isSubscribed);
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this video on PlayVia: ${video.title}\n${video.videoUrl}`,
        url: video.videoUrl,
        title: video.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <ScreenWrapper edges={['top', 'bottom']} style={isLandscape ? styles.landscapeContainer : {}}>
      {/* Video Player Area */}
      <TouchableOpacity 
        activeOpacity={1} 
        style={[styles.playerContainer, isLandscape && styles.playerContainerLandscape]} 
        onPress={toggleControls}
      >
        {/* FIXED: handled React 19 ref issue with expo-av Video */}
        {(() => {
          const VideoPlayer = Video as any;
          return (
            <VideoPlayer
              ref={videoRef}
              source={{ uri: video.videoUrl }}
              style={styles.video}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={true}
              onPlaybackStatusUpdate={(status: any) => setStatus(() => status)}
              useNativeControls={false}
            />
          );
        })()}
        
        {showControls && (
          <Animated.View style={[styles.playerOverlay, { opacity: controlsOpacity }]}>
            <View style={styles.topControls}>
              {!isLandscape && (
                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <Ionicons name="chevron-down" size={32} color={colors.dark.white} />
                </TouchableOpacity>
              )}
              <View style={styles.rightTopControls}>
                <Ionicons name="tv-outline" size={24} color={colors.dark.white} style={styles.controlIcon as any} />
                <Ionicons name="chatbox-outline" size={24} color={colors.dark.white} style={styles.controlIcon as any} />
                <Ionicons name="settings-outline" size={24} color={colors.dark.white} style={styles.controlIcon as any} />
              </View>
            </View>
            
            <View style={styles.centerControls}>
              <TouchableOpacity onPress={() => videoRef.current?.setPositionAsync(Math.max(0, status.positionMillis - 10000))}>
                <Ionicons name="play-back" size={36} color={colors.dark.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
                <Ionicons name={status.isPlaying ? "pause" : "play"} size={48} color={colors.dark.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => videoRef.current?.setPositionAsync(status.positionMillis + 10000)}>
                <Ionicons name="play-forward" size={36} color={colors.dark.white} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.bottomControls}>
              <Text style={styles.timeText}>
                {formatDuration(status.positionMillis / 1000)} / {formatDuration(video.duration || status.durationMillis / 1000)}
              </Text>
              <TouchableOpacity onPress={() => setIsLandscape(!isLandscape)}>
                <Ionicons name="expand" size={20} color={colors.dark.white} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>

      {/* Info & Scroll Area (hidden in landscape) */}
      {!isLandscape && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Video Info */}
          <View style={styles.infoSection}>
            <Text style={styles.title}>{video.title}</Text>
            <Text style={styles.stats}>{formatViews(video.views || 0)} views • {formatTimeAgo(video.createdAt)}</Text>
          </View>

          {/* Channel Info & Subscribe */}
          <View style={styles.channelSection}>
            <View style={styles.channelLeft}>
              <Avatar uri={video.channel?.avatar} size={40} />
              <View style={styles.channelText}>
                <Text style={styles.channelName}>{video.channel?.name || 'Unknown Channel'}</Text>
                <Text style={styles.subscribers}>{formatViews(video.channel?.subscribersCount || 0)} subscribers</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.subscribeBtn, isSubscribed && { backgroundColor: colors.dark.surface }]} 
              onPress={toggleSubscribe}
            >
              <Text style={[styles.subscribeText, isSubscribed && { color: colors.dark.textSecondary }]}>
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons (Horizontal Scroll) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsScroll}>
            <View style={styles.actionGroup}>
              <TouchableOpacity style={styles.actionBtnLeft} onPress={toggleLike}>
                <Ionicons 
                  name={isLiked ? "thumbs-up" : "thumbs-up-outline"} 
                  size={20} 
                  color={isLiked ? colors.dark.primary : colors.dark.text} 
                />
                <Text style={styles.actionBtnText}>{formatViews(video.likesCount || 0)}</Text>
              </TouchableOpacity>
              <View style={styles.actionDivider} />
              <TouchableOpacity style={styles.actionBtnRight}>
                <Ionicons name="thumbs-down-outline" size={20} color={colors.dark.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.actionBtnStandalone} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color={colors.dark.text} />
              <Text style={styles.actionBtnText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtnStandalone}>
              <Ionicons name="download-outline" size={20} color={colors.dark.text} />
              <Text style={styles.actionBtnText}>Download</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Comments Teaser */}
          <View style={styles.commentsSection}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>Comments</Text>
              <Text style={styles.commentsCount}>{formatViews(comments.length)}</Text>
            </View>
            {comments.length > 0 ? (
              <View style={styles.commentPreview}>
                <Avatar uri={comments[0].user?.avatar} size={24} />
                <Text style={styles.commentText} numberOfLines={2}>
                  {comments[0].text}
                </Text>
              </View>
            ) : (
              <Text style={styles.noCommentsText}>No comments yet</Text>
            )}
          </View>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  landscapeContainer: {
    backgroundColor: '#000',
    paddingTop: 0,
    paddingBottom: 0,
  },
  playerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    position: 'relative',
  },
  playerContainerLandscape: {
    height: '100%',
    width: '100%',
    aspectRatio: undefined,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    padding: layout.spacing.sm,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.sm,
  },
  rightTopControls: {
    flexDirection: 'row',
  },
  controlIcon: {
    marginLeft: layout.spacing.lg,
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    marginHorizontal: layout.spacing.xl,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.sm,
  },
  timeText: {
    color: colors.dark.white,
    fontSize: typography.sizes.sm,
  },
  infoSection: {
    padding: layout.spacing.md,
  },
  title: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
    marginBottom: layout.spacing.xs,
  },
  stats: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
  },
  channelSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    paddingBottom: layout.spacing.md,
  },
  channelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelText: {
    marginLeft: layout.spacing.sm,
  },
  channelName: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as '700',
  },
  subscribers: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
  },
  subscribeBtn: {
    backgroundColor: colors.dark.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: layout.borderRadius.full,
  },
  subscribeText: {
    color: colors.dark.black,
    fontWeight: typography.weights.bold as '700',
    fontSize: typography.sizes.sm,
  },
  actionsScroll: {
    paddingHorizontal: layout.spacing.md,
    paddingBottom: layout.spacing.md,
  },
  actionGroup: {
    flexDirection: 'row',
    backgroundColor: colors.dark.surface,
    borderRadius: layout.borderRadius.full,
    alignItems: 'center',
    marginRight: layout.spacing.sm,
  },
  actionBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.dark.border,
  },
  actionBtnRight: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionBtnStandalone: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: layout.borderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: layout.spacing.sm,
  },
  actionBtnText: {
    color: colors.dark.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium as '500',
    marginLeft: 6,
  },
  commentsSection: {
    marginHorizontal: layout.spacing.md,
    backgroundColor: colors.dark.surface,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.xl,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: layout.spacing.sm,
  },
  commentsTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as '700',
  },
  commentsCount: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    marginLeft: layout.spacing.xs,
  },
  commentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    color: colors.dark.text,
    fontSize: typography.sizes.sm,
    marginLeft: layout.spacing.sm,
    flex: 1,
  },
  noCommentsText: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginTop: layout.spacing.sm,
  },
});
