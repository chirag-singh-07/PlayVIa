import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { VideoCard } from "../components/VideoCard";
import { VideoSkeleton } from "../components/VideoSkeleton";
import { layout } from "../constants";
import { colors, typography } from "../theme";
import { ScreenWrapper } from "../components/ScreenWrapper";
import { channelService } from "../services/channelService";
import { formatViews, formatTimeAgo, formatDuration, getCloudinaryThumbnail } from "../utils/videoUtils";

import { useAuth } from '../context/AuthContext';

export const ChannelProfileScreen: React.FC<any> = ({ navigation, route }) => {
  const { user: currentUser } = useAuth();
  const channelId = route.params?.channelId;
  const [channelData, setChannelData] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [shorts, setShorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"videos" | "shorts" | "about">(
    "videos",
  );

  useEffect(() => {
    const fetchChannelInfo = async () => {
      if (channelId) {
        try {
          setLoading(true);
          const [info, channelVideos, channelShorts] = await Promise.all([
            channelService.getChannelById(channelId),
            channelService.getChannelVideos(channelId),
            channelService.getChannelShorts(channelId)
          ]);
          setChannelData(info);
          setVideos(channelVideos);
          setShorts(channelShorts);
        } catch (error) {
          console.error('Error fetching channel info:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchChannelInfo();
  }, [channelId]);

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <View style={{ width: 150, height: 20, backgroundColor: colors.dark.surface, borderRadius: 4 }} />
        </View>
        <View style={styles.banner} />
        <View style={styles.infoContainer}>
          <View style={[styles.avatar, { width: 80, height: 80, borderRadius: 40 }]} />
          <View style={{ width: 140, height: 24, backgroundColor: colors.dark.surface, borderRadius: 4, marginBottom: 12 }} />
          <View style={{ width: 220, height: 16, backgroundColor: colors.dark.surface, borderRadius: 4, marginBottom: 20 }} />
          <View style={{ width: 200, height: 40, backgroundColor: colors.dark.surface, borderRadius: 20 }} />
        </View>
        <View style={{ padding: layout.spacing.lg }}>
          <VideoSkeleton />
          <VideoSkeleton />
        </View>
      </ScreenWrapper>
    );
  }

  if (!channelData) {
    return (
      <ScreenWrapper>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.dark.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.dark.textSecondary} />
          <Text style={styles.emptyText}>Channel not found</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "videos":
        if (videos.length === 0) {
          return (
            <View style={styles.emptyContainer}>
              <Ionicons name="videocam-outline" size={48} color={colors.dark.textSecondary} />
              <Text style={styles.emptyText}>No videos yet</Text>
            </View>
          );
        }
        return (
          <View style={styles.videosList}>
            {videos.map((item) => (
              <VideoCard
                key={item._id}
                title={item.title}
                thumbnail={item.thumbnailUrl || getCloudinaryThumbnail(item.videoUrl) || ''}
                channelName={channelData.name}
                channelAvatar={channelData.avatar}
                views={formatViews(item.views || 0)}
                createdAt={formatTimeAgo(item.createdAt)}
                duration={formatDuration(item.duration)}
                onPress={() => navigation.navigate("VideoPlayer", { video: item })}
              />
            ))}
          </View>
        );
      case "shorts":
        if (shorts.length === 0) {
          return (
            <View style={styles.emptyContainer}>
              <Ionicons name="phone-portrait-outline" size={48} color={colors.dark.textSecondary} />
              <Text style={styles.emptyText}>No shorts yet</Text>
            </View>
          );
        }
        return (
          <View style={styles.shortsGrid}>
            {shorts.map((short) => (
              <TouchableOpacity
                key={short._id}
                style={styles.shortItem}
                onPress={() => navigation.navigate("MainTabs", { screen: "Shorts" })}
              >
                {short.videoUrl || short.thumbnailUrl ? (
                  <Image
                    source={{ uri: short.videoUrl || short.thumbnailUrl }}
                    style={styles.shortImage}
                  />
                ) : (
                  <View style={[styles.shortImage, { backgroundColor: colors.dark.surface, justifyContent: 'center', alignItems: 'center' }]}>
                    <Ionicons name="play-outline" size={32} color={colors.dark.textSecondary} />
                  </View>
                )}
                <View style={styles.shortOverlay}>
                  <Ionicons name="play" size={12} color="white" />
                  <Text style={styles.shortViews}>{formatViews(short.views || 0)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
      case "about":
        return (
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutTitle}>Description</Text>
            <Text style={styles.aboutText}>{channelData.description || "No description provided."}</Text>
            <View style={styles.aboutStats}>
              <Text style={styles.aboutText}>Joined {new Date(channelData.createdAt).toLocaleDateString()}</Text>
              <Text style={styles.aboutText}>{formatViews(channelData.totalViews || 0)} total views</Text>
            </View>
          </View>
        );
    }
  };

  const isOwnChannel = channelData.owner === currentUser?._id || channelData._id === currentUser?.channel?._id;

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{channelData.name}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate("Search")}
          >
            <Ionicons name="search" size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color={colors.dark.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Image 
          source={{ uri: channelData.banner || 'https://via.placeholder.com/800x300/202020/404040?text=Banner' }} 
          style={styles.banner} 
        />

        {/* Channel Info */}
        <View style={styles.infoContainer}>
          <Avatar uri={channelData.avatar} size={80} style={styles.avatar} />
          <Text style={styles.channelName}>{channelData.name}</Text>
          <Text style={styles.channelStats}>
            {channelData.handle ? `${channelData.handle} • ` : ''}
            {channelData.subscribers || 0} Subscribers •{" "}
            {channelData.videosCount || 0} Videos
          </Text>
          {channelData.description && (
            <Text style={styles.channelDesc} numberOfLines={2}>
              {channelData.description}
            </Text>
          )}

          {isOwnChannel ? (
            <TouchableOpacity 
              style={styles.editBtn}
              onPress={() => navigation.navigate('ChannelEdit', { channel: channelData })}
            >
              <Ionicons name="pencil" size={16} color={colors.dark.text} style={{ marginRight: 6 }} />
              <Text style={styles.editBtnText}>Edit Channel</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[
                styles.subscribeBtn,
                channelData.isSubscribed && styles.subscribedBtn
              ]}
              onPress={async () => {
                const newSubState = !channelData.isSubscribed;
                // Optimistic update
                setChannelData({
                  ...channelData,
                  isSubscribed: newSubState,
                  subscribers: newSubState ? (channelData.subscribers || 0) + 1 : Math.max(0, (channelData.subscribers || 0) - 1)
                });
                
                try {
                  await channelService.subscribeToChannel(channelData._id);
                } catch (error) {
                  // Revert
                  setChannelData({
                    ...channelData,
                    isSubscribed: !newSubState,
                    subscribers: !newSubState ? (channelData.subscribers || 0) + 1 : Math.max(0, (channelData.subscribers || 0) - 1)
                  });
                  console.error('Subscribe failed:', error);
                }
              }}
            >
              <Text style={[
                styles.subscribeBtnText,
                channelData.isSubscribed && styles.subscribedBtnText
              ]}>
                {channelData.isSubscribed ? "Subscribed" : "Subscribe"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "videos" && styles.activeTab]}
            onPress={() => setActiveTab("videos")}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === "videos" && styles.activeTabText]}>
              VIDEOS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "shorts" && styles.activeTab]}
            onPress={() => setActiveTab("shorts")}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === "shorts" && styles.activeTabText]}>
              SHORTS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "about" && styles.activeTab]}
            onPress={() => setActiveTab("about")}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === "about" && styles.activeTabText]}>
              ABOUT
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>{renderTabContent()}</View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    backgroundColor: colors.dark.background,
    zIndex: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backBtn: {
    marginRight: layout.spacing.md,
  },
  headerTitle: {
    flex: 1,
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as "700",
  },
  headerActions: {
    flexDirection: "row",
  },
  iconBtn: {
    marginLeft: layout.spacing.md,
  },
  banner: {
    width: "100%",
    aspectRatio: 21 / 9,
    backgroundColor: colors.dark.surface,
  },
  infoContainer: {
    padding: layout.spacing.lg,
    alignItems: "center",
  },
  avatar: {
    marginTop: -55,
    borderWidth: 4,
    borderColor: colors.dark.background,
    marginBottom: layout.spacing.sm,
    backgroundColor: colors.dark.surface,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  channelName: {
    color: colors.dark.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as "700",
    marginBottom: 4,
    textAlign: "center",
  },
  channelStats: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    marginBottom: 12,
    textAlign: "center",
  },
  channelDesc: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    textAlign: "center",
    marginBottom: layout.spacing.lg,
    paddingHorizontal: layout.spacing.xl,
    lineHeight: 20,
  },
  subscribeBtn: {
    backgroundColor: colors.dark.primary,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 24, // Pill style
    width: '100%',
    maxWidth: 250,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: colors.dark.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  subscribedBtn: {
    backgroundColor: colors.dark.surface,
    borderWidth: 1,
    borderColor: colors.dark.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  subscribeBtnText: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as "700",
  },
  subscribedBtnText: {
    color: colors.dark.textSecondary,
  },
  editBtn: {
    flexDirection: 'row',
    backgroundColor: colors.dark.surface,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.dark.border,
    width: '100%',
    maxWidth: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as "700",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: colors.dark.primary,
  },
  tabText: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold as "700",
  },
  activeTabText: {
    color: colors.dark.text,
  },
  tabContent: {
    paddingBottom: layout.spacing.xl,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.md,
    marginTop: 12,
  },
  videosList: {
    paddingTop: 0,
  },
  shortsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  shortItem: {
    width: "33.33%",
    aspectRatio: 9 / 16,
    padding: 1,
  },
  shortImage: {
    width: "100%",
    height: "100%",
  },
  shortOverlay: {
    position: "absolute",
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shortViews: {
    color: colors.dark.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium as "500",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginLeft: 4,
  },
  aboutContainer: {
    padding: layout.spacing.lg,
  },
  aboutTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as "700",
    marginBottom: layout.spacing.md,
  },
  aboutText: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
    lineHeight: 24,
  },
  aboutStats: {
    marginTop: layout.spacing.xl,
    paddingTop: layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
});
