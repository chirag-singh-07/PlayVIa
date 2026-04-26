import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import { layout } from '../constants';
import { videoService } from '../services/videoService';
import { channelService } from '../services/channelService';
import { formatCount } from '../utils/formatCount';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');

interface Props {
  item: any;
  isActive: boolean;
  onCommentPress: (videoId: string) => void;
}

// Helper for Avatar Fallback
const getAvatarInitials = (name: string): string => {
  if (!name) return '??';
  return name
    .trim()
    .split(/\s+/)
    .map(word => word[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('');
};

const getAvatarColor = (name: string): string => {
  if (!name) return colors.dark.surface;
  const avatarColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#A29BFE', '#FAB1A0'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

export const ShortVideoItem: React.FC<Props> = ({ item, isActive, onCommentPress }) => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { user: currentUser } = useAuth();
  
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  
  // Real-time UI states
  const [isLiked, setIsLiked] = useState(item.isLiked || false);
  const [likesCount, setLikesCount] = useState(item.likesCount || 0);
  const [isSubscribed, setIsSubscribed] = useState(item.channel?.isSubscribed || false);
  const [subscriberCount, setSubscriberCount] = useState(item.channel?.subscribers || 0);



  // Animations
  const likeScale = useRef(new Animated.Value(1)).current;
  const playPauseOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isActive || !isFocused) {
      videoRef.current?.pauseAsync();
      setIsPlaying(false);
    } else {
      videoRef.current?.playAsync();
      setIsPlaying(true);
    }
  }, [isActive, isFocused]);

  const togglePlayPause = async () => {
    if (!videoRef.current) return;
    
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    
    if (nextState) {
      await videoRef.current.playAsync();
    } else {
      await videoRef.current.pauseAsync();
    }

    // Show play/pause indicator
    playPauseOpacity.setValue(1);
    Animated.timing(playPauseOpacity, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const handleLike = useCallback(async () => {
    // Prevent multiple likes on same video
    if (isLiked) return;

    // Optimistic Update
    setIsLiked(true);
    setLikesCount(prev => prev + 1);

    // Animation
    Animated.sequence([
      Animated.timing(likeScale, { toValue: 1.4, duration: 150, useNativeDriver: true }),
      Animated.spring(likeScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();

    try {
      await videoService.toggleLike(item._id);
    } catch (error) {
      // Revert if failed
      setIsLiked(false);
      setLikesCount(prev => Math.max(0, prev - 1));
      console.error('Like failed:', error);
    }
  }, [isLiked, item._id]);

  const handleSubscribe = async () => {
    if (!item.channel?._id) return;

    // Optimistic Update
    const nextSubState = !isSubscribed;
    setIsSubscribed(nextSubState);
    setSubscriberCount(prev => nextSubState ? prev + 1 : Math.max(0, prev - 1));

    try {
      await channelService.subscribeToChannel(item.channel._id);
    } catch (error) {
      // Revert
      setIsSubscribed(!nextSubState);
      setSubscriberCount(prev => !nextSubState ? prev + 1 : Math.max(0, prev - 1));
      console.error('Subscribe failed:', error);
    }
  };

  const navigateToChannel = () => {
    if (item.channel?._id) {
      navigation.navigate('ChannelProfile', { channelId: item.channel._id });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={togglePlayPause} 
        style={styles.touchArea}
      >
        {item.videoUrl && item.videoUrl.trim() !== '' ? (
          <Video
            ref={videoRef}
            source={{ uri: item.videoUrl }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay={isActive && isFocused && isPlaying}
            isLooping
            isMuted={isMuted}
            useNativeControls={false}
          />
        ) : (
          <View style={[styles.video, { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }]}>
            <MaterialCommunityIcons name="video-off-outline" size={48} color={colors.dark.textSecondary} />
          </View>
        )}
        
        {/* Play/Pause Indicator Overlay */}
        <Animated.View style={[styles.indicator, { opacity: playPauseOpacity }]}>
          <MaterialCommunityIcons 
            name={isPlaying ? "play" : "pause"} 
            size={80} 
            color="rgba(255,255,255,0.4)" 
          />
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.overlay} pointerEvents="none" />

      {/* Right Side Actions - YouTube/TikTok Style */}
      <View style={styles.actionsContainer}>
        <View style={styles.actionItem}>
          <TouchableOpacity onPress={handleLike} disabled={isLiked}>
            <Animated.View style={[
              styles.iconCircle,
              isLiked && styles.iconCircleLiked,
              { transform: [{ scale: likeScale }] }
            ]}>
              <MaterialCommunityIcons 
                name={isLiked ? "heart" : "heart-outline"} 
                size={30} 
                color={isLiked ? colors.dark.error : colors.dark.white} 
              />
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.actionText}>{formatCount(likesCount)}</Text>
        </View>

        <View style={styles.actionItem}>
          <TouchableOpacity onPress={() => onCommentPress(item._id)}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="comment-text-multiple" size={28} color={colors.dark.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.actionText}>{formatCount(item.commentsCount || 0)}</Text>
        </View>

        <View style={styles.actionItem}>
          <TouchableOpacity>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="share-variant" size={28} color={colors.dark.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.actionText}>Share</Text>
        </View>

        <View style={styles.actionItem}>
          <TouchableOpacity onPress={() => setIsMuted(!isMuted)}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons 
                name={isMuted ? "volume-off" : "volume-high"} 
                size={26} 
                color={colors.dark.white} 
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Info - Positioned above Tab Bar (70px) */}
      <View style={styles.bottomInfo}>
        <View style={styles.channelRow}>
          <TouchableOpacity onPress={navigateToChannel} style={styles.channelLink}>
            <View style={styles.avatarContainer}>
              {!showPlaceholder && item.channel?.avatar ? (
                <Image 
                  source={{ uri: item.channel.avatar }} 
                  style={styles.avatar} 
                  onError={() => setShowPlaceholder(true)}
                />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: getAvatarColor(item.channel?.name) }]}>
                  <Text style={styles.initialsText}>{getAvatarInitials(item.channel?.name)}</Text>
                </View>
              )}
            </View>
            <Text style={styles.channelName}>{item.channel?.name || 'Unknown'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.subscribeBtn, 
              isSubscribed && styles.subscribedBtn
            ]} 
            onPress={handleSubscribe}
          >
            <Text style={styles.subscribeText}>
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    backgroundColor: 'black',
  },
  touchArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  indicator: {
    zIndex: 10,
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  actionsContainer: {
    position: 'absolute',
    right: 12,
    bottom: 120, // High enough to clear tab bar and creator info
    alignItems: 'center',
    zIndex: 10,
  },
  actionItem: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleLiked: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  actionText: {
    color: colors.dark.white,
    fontSize: 13,
    marginTop: 6,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 85, // Positioned above the 70px tab bar + some spacing
    left: 12,
    right: 70,
    zIndex: 10,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'flex-start',
  },
  channelLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
    backgroundColor: colors.dark.surface,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  channelName: {
    color: colors.dark.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subscribeBtn: {
    backgroundColor: colors.dark.error,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  subscribedBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  subscribeText: {
    color: colors.dark.white,
    fontSize: 13,
    fontWeight: 'bold',
  },

  title: {
    color: colors.dark.white,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
