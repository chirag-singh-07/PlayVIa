import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Animated, ActivityIndicator } from 'react-native';
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
import { useOptimisticUpdate } from '../hooks/useOptimisticUpdate';
import { optimisticVideoService, optimisticSubscriptionService } from '../services/optimisticService';
import { usePreRollAds } from '../hooks/ads/usePreRollAds';
import { PreRollAdView } from '../components/ads/PreRollAdView';

import { Video, ResizeMode } from 'expo-av';
import { CommentsModal } from '../components/CommentsModal';

export const VideoPlayerScreen: React.FC<any> = ({ route, navigation }) => {
  const { isAuthenticated, user: currentUser } = useAuth();
  const { video: initialVideo } = route.params || {};
  const [video, setVideo] = useState<any>(initialVideo || {});
  const [loading, setLoading] = useState(!initialVideo);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [isLikeSyncing, setIsLikeSyncing] = useState(false);
  const [isSubscribeSyncing, setIsSubscribeSyncing] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);
  
  // Pre-roll ads
  const { showAds, skipCurrentAd, isShowingAds, currentAdState } = usePreRollAds(2);
  
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [showControls, setShowControls] = useState(true);
  const [isLandscape, setIsLandscape] = useState(Dimensions.get('window').width > Dimensions.get('window').height);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const hideControlsTimeout = useRef<any>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [quality, setQuality] = useState('Auto');
  const [activeUrl, setActiveUrl] = useState(video.videoUrl);
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);

  const qualities = ['Auto', '1080p', '720p', '480p', '360p', '240p', '144p'];

  useEffect(() => {
    setActiveUrl(video.videoUrl);
  }, [video.videoUrl]);

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

          const data = await commentService.getVideoComments(initialVideo._id);
          setComments(data.comments || []);
        } catch (error) {
          console.error('Error fetching video details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchVideoDetails();
  }, [initialVideo?._id]);

  // Show pre-roll ads when video is ready
  useEffect(() => {
    if (!loading && video._id && !shouldPlayVideo) {
      console.log('[PreRoll] Starting pre-roll ads...');
      showAds(() => {
        console.log('[PreRoll] Ads complete, video ready to play');
        setShouldPlayVideo(true);
      });
    }
  }, [loading, video._id, shouldPlayVideo]);

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to comment.');
      return;
    }
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const newComment = await commentService.addComment(video._id, commentText);
      // Backend returns single comment, we need to populate user for local state
      const populatedComment = {
        ...newComment,
        user: {
          _id: currentUser?._id,
          username: currentUser?.username,
          avatar: currentUser?.avatar
        }
      };
      setComments([populatedComment, ...comments]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleQualityChange = (q: string) => {
    setQuality(q);
    setShowQualityModal(false);
    
    if (q === 'Auto') {
      setActiveUrl(video.videoUrl);
      return;
    }

    // Cloudinary dynamic quality/scaling
    // Example: .../upload/v123/video.mp4 -> .../upload/q_auto,w_1280/v123/video.mp4
    if (video.videoUrl?.includes('cloudinary.com')) {
      const parts = video.videoUrl.split('/upload/');
      let transformation = '';
      switch(q) {
        case '1080p': transformation = 'q_auto,w_1920'; break;
        case '720p': transformation = 'q_auto,w_1280'; break;
        case '480p': transformation = 'q_auto,w_854'; break;
        case '360p': transformation = 'q_auto,w_640'; break;
        case '240p': transformation = 'q_auto,w_426'; break;
        case '144p': transformation = 'q_auto,w_256'; break;
      }
      setActiveUrl(`${parts[0]}/upload/${transformation}/${parts[1]}`);
    }
  };

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

    // Immediate optimistic update
    const wasLiked = isLiked;
    const previousLikesCount = video.likesCount || 0;
    
    setIsLiked(!wasLiked);
    setVideo({ ...video, likesCount: !wasLiked ? previousLikesCount + 1 : Math.max(0, previousLikesCount - 1) });
    setIsLikeSyncing(true);

    try {
      // Sync with server in background
      await videoService.toggleLike(video._id);
    } catch (error) {
      console.error('Error syncing like:', error);
      // Rollback on error
      setIsLiked(wasLiked);
      setVideo({ ...video, likesCount: previousLikesCount });
      Alert.alert('Error', 'Failed to sync like. Please try again.');
    } finally {
      setIsLikeSyncing(false);
    }
  };

  const toggleSubscribe = async () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to subscribe.');
      return;
    }

    // Immediate optimistic update
    const wasSubscribed = isSubscribed;
    const previousSubscriberCount = video.channel?.subscribersCount || 0;

    setIsSubscribed(!wasSubscribed);
    if (video.channel) {
      setVideo({
        ...video,
        channel: {
          ...video.channel,
          subscribersCount: !wasSubscribed ? previousSubscriberCount + 1 : Math.max(0, previousSubscriberCount - 1),
        },
      });
    }
    setIsSubscribeSyncing(true);

    try {
      if (video.channel?._id) {
        // Sync with server in background
        await channelService.subscribeToChannel(video.channel._id);
      }
    } catch (error) {
      console.error('Error syncing subscription:', error);
      // Rollback on error
      setIsSubscribed(wasSubscribed);
      if (video.channel) {
        setVideo({
          ...video,
          channel: {
            ...video.channel,
            subscribersCount: previousSubscriberCount,
          },
        });
      }
      Alert.alert('Error', 'Failed to sync subscription. Please try again.');
    } finally {
      setIsSubscribeSyncing(false);
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
    <>
      {/* Pre-Roll Ads Overlay */}
      {isShowingAds && currentAdState && (
        <PreRollAdView
          visible={isShowingAds}
          adIndex={currentAdState.adIndex}
          totalAds={2}
          timeRemaining={Math.ceil(currentAdState.timeRemaining)}
          canSkip={currentAdState.canSkip}
          onSkip={skipCurrentAd}
          currentAdId={currentAdState.currentAdId}
        />
      )}

      <ScreenWrapper edges={['top', 'bottom']} style={isLandscape ? styles.landscapeContainer : {}}>
        {/* Video Player Area */}
        <TouchableOpacity 
          activeOpacity={1} 
          style={[styles.playerContainer, isLandscape && styles.playerContainerLandscape]} 
          onPress={toggleControls}
        >
          {/* Show loading while ads play */}
          {!shouldPlayVideo && !isShowingAds && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={colors.dark.primary} />
              <Text style={styles.loadingText}>Preparing video...</Text>
            </View>
          )}

          {/* Video Player - Only render when ads are done */}
          {shouldPlayVideo && (
            (() => {
              const VideoPlayer = Video as any;
              return (
                activeUrl && activeUrl.trim() !== '' ? (
                  <VideoPlayer
                    ref={videoRef}
                    source={{ uri: activeUrl }}
                    style={styles.video}
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={true}
                    onPlaybackStatusUpdate={(newStatus: any) => {
                    setStatus(newStatus);
                    // Auto-update duration on server if it's missing (0)
                    if (newStatus.isLoaded && newStatus.durationMillis && (!video.duration || video.duration === 0)) {
                      const actualDuration = Math.round(newStatus.durationMillis / 1000);
                      if (actualDuration > 0) {
                        setVideo((prev: any) => ({ ...prev, duration: actualDuration }));
                        videoService.updateVideoDuration(video._id, actualDuration).catch(() => {});
                      }
                    }
                  }}
                  useNativeControls={false}
                />
                ) : null
              );
            })()
          )}
        {/* Real YouTube-style Progress Bar at the very bottom of video */}
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarForeground, 
              { width: `${((status?.positionMillis || 0) / (status?.durationMillis || 1)) * 100}%` }
            ]} 
          />
        </View>
        
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
                <TouchableOpacity onPress={() => setShowQualityModal(true)}>
                  <Ionicons name="settings-outline" size={24} color={colors.dark.white} style={styles.controlIcon as any} />
                </TouchableOpacity>
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
                {formatDuration((status?.positionMillis || 0) / 1000)} / {formatDuration(video.duration || (status?.durationMillis || 0) / 1000)}
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
            <TouchableOpacity 
              style={styles.channelLeft}
              onPress={() => {
                if (video.channel?._id) {
                  navigation.navigate('ChannelProfile', { channelId: video.channel._id });
                }
              }}
            >
              <Avatar uri={video.channel?.avatar} size={40} />
              <View style={styles.channelText}>
                <Text style={styles.channelName}>{video.channel?.name || 'Unknown Channel'}</Text>
                <Text style={styles.subscribers}>{formatViews(video.channel?.subscribersCount || 0)} subscribers</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.subscribeBtn, isSubscribed && { backgroundColor: colors.dark.surface }]} 
              onPress={toggleSubscribe}
              disabled={isSubscribeSyncing}
            >
              {isSubscribeSyncing ? (
                <ActivityIndicator size="small" color={isSubscribed ? colors.dark.textSecondary : colors.dark.black} />
              ) : (
                <Text style={[styles.subscribeText, isSubscribed && { color: colors.dark.textSecondary }]}>
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Action Buttons (Horizontal Scroll) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsScroll}>
            <View style={styles.actionGroup}>
              <TouchableOpacity style={styles.actionBtnLeft} onPress={toggleLike} disabled={isLikeSyncing}>
                {isLikeSyncing ? (
                  <ActivityIndicator size="small" color={colors.dark.primary} />
                ) : (
                  <Ionicons 
                    name={isLiked ? "thumbs-up" : "thumbs-up-outline"} 
                    size={20} 
                    color={isLiked ? colors.dark.primary : colors.dark.text} 
                  />
                )}
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

          {/* Comments Section */}
          <TouchableOpacity 
            style={styles.commentsSection} 
            onPress={() => setIsCommentsModalVisible(true)}
          >
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>Comments</Text>
              <Text style={styles.commentsCount}>{comments.length}</Text>
            </View>

            <View style={styles.commentInputRow}>
              <Avatar uri={currentUser?.avatar} size={32} />
              <View style={styles.inputWrapper}>
                <Text style={styles.commentInputPlaceholder}>Add a comment...</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}

      <CommentsModal 
        visible={isCommentsModalVisible}
        onClose={() => setIsCommentsModalVisible(false)}
        videoId={video._id}
      />

      {/* Quality Selection Modal (Simplified for Expo) */}
      {showQualityModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Quality for current video</Text>
            {qualities.map((q) => (
              <TouchableOpacity 
                key={q} 
                style={styles.modalItem} 
                onPress={() => handleQualityChange(q)}
              >
                <Text style={[styles.modalItemText, quality === q && { color: colors.dark.primary }]}>
                  {q}
                </Text>
                {quality === q && <Ionicons name="checkmark" size={20} color={colors.dark.primary} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowQualityModal(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScreenWrapper>
    </>
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingText: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
    marginTop: layout.spacing.md,
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
  progressBarBackground: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  progressBarForeground: {
    height: '100%',
    backgroundColor: colors.dark.primary,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: colors.dark.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: layout.spacing.lg,
  },
  modalTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as '700',
    marginBottom: layout.spacing.md,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  modalItemText: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
  },
  modalClose: {
    marginTop: layout.spacing.md,
    alignItems: 'center',
    padding: layout.spacing.md,
  },
  modalCloseText: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.md,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: layout.spacing.md,
  },
  inputWrapper: {
    flex: 1,
    marginLeft: layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
    paddingVertical: 4,
  },
  commentInput: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
  },
  commentsList: {
    marginTop: layout.spacing.md,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: layout.spacing.lg,
  },
  commentContent: {
    flex: 1,
    marginLeft: layout.spacing.sm,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUser: {
    color: colors.dark.text,
    fontSize: 13,
    fontWeight: typography.weights.bold as '700',
    marginRight: 8,
  },
  commentDate: {
    color: colors.dark.textSecondary,
    fontSize: 11,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  commentActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  commentActionText: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    marginLeft: 4,
  },
  loginToComment: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginVertical: layout.spacing.md,
    fontStyle: 'italic',
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: layout.spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.dark.background,
    borderRadius: layout.borderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: layout.spacing.sm,
  },
  commentInputPlaceholder: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
  },
});
