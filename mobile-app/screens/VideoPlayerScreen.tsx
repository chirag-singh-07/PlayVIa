import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../components/Avatar';
import { colors, typography } from '../theme';
import { layout } from '../constants';
import { ScreenWrapper } from '../components/ScreenWrapper';

export const VideoPlayerScreen: React.FC<any> = ({ route, navigation }) => {
  // Mock data passed from Home
  const video = route.params?.video || {
    id: '1',
    title: 'Building a YouTube Clone with React Native & Expo',
    views: '125K',
    createdAt: '2 days ago',
    channelName: 'Frontend Mastery',
    channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
    likes: '12K',
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLandscape, setIsLandscape] = useState(Dimensions.get('window').width > Dimensions.get('window').height);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

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
    setIsPlaying(!isPlaying);
    scheduleHideControls();
  };

  return (
    <ScreenWrapper edges={['top', 'bottom']} style={isLandscape ? styles.landscapeContainer : {}}>
      {/* Video Player Area */}
      <TouchableOpacity 
        activeOpacity={1} 
        style={[styles.playerContainer, isLandscape && styles.playerContainerLandscape]} 
        onPress={toggleControls}
      >
        <Image source={{ uri: video.thumbnail }} style={styles.videoMock} resizeMode="cover" />
        
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
              <TouchableOpacity>
                <Ionicons name="play-back" size={36} color={colors.dark.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlay} style={styles.playButton}>
                <Ionicons name={isPlaying ? "pause" : "play"} size={48} color={colors.dark.white} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="play-forward" size={36} color={colors.dark.white} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.bottomControls}>
              <Text style={styles.timeText}>0:00 / 12:34</Text>
              <TouchableOpacity>
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
            <Text style={styles.stats}>{video.views} views • {video.createdAt}</Text>
          </View>

          {/* Channel Info & Subscribe */}
          <View style={styles.channelSection}>
            <View style={styles.channelLeft}>
              <Avatar uri={video.channelAvatar} size={40} />
              <View style={styles.channelText}>
                <Text style={styles.channelName}>{video.channelName}</Text>
                <Text style={styles.subscribers}>1.2M subscribers</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.subscribeBtn}>
              <Text style={styles.subscribeText}>Subscribe</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons (Horizontal Scroll) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsScroll}>
            <View style={styles.actionGroup}>
              <TouchableOpacity style={styles.actionBtnLeft}>
                <Ionicons name="thumbs-up-outline" size={20} color={colors.dark.text} />
                <Text style={styles.actionBtnText}>{video.likes}</Text>
              </TouchableOpacity>
              <View style={styles.actionDivider} />
              <TouchableOpacity style={styles.actionBtnRight}>
                <Ionicons name="thumbs-down-outline" size={20} color={colors.dark.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.actionBtnStandalone}>
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
              <Text style={styles.commentsCount}>1.4K</Text>
            </View>
            <View style={styles.commentPreview}>
              <Avatar uri="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" size={24} />
              <Text style={styles.commentText} numberOfLines={2}>
                This is such a great UI design! Love the attention to detail.
              </Text>
            </View>
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
  videoMock: {
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
});
