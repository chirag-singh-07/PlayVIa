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
import { layout } from "../constants";
import { colors, typography } from "../theme";
import { ScreenWrapper } from "../components/ScreenWrapper";
import { channelService } from "../services/channelService";
import { formatViews, formatTimeAgo, formatDuration } from "../utils/videoUtils";

export const ChannelProfileScreen: React.FC<any> = ({ navigation, route }) => {
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

  if (loading) return <View style={styles.container}><Text style={{color: 'white', textAlign: 'center', marginTop: 100}}>Loading...</Text></View>;
  if (!channelData) return <View style={styles.container}><Text style={{color: 'white', textAlign: 'center', marginTop: 100}}>Channel not found</Text></View>;

  const renderTabContent = () => {
    switch (activeTab) {
      case "videos":
        return videos.map((item) => (
          <VideoCard
            key={item._id}
            title={item.title}
            thumbnail={item.thumbnailUrl}
            channelName={channelData.name}
            channelAvatar={channelData.avatar}
            views={formatViews(item.views || 0)}
            createdAt={formatTimeAgo(item.createdAt)}
            duration={formatDuration(item.duration)}
            onPress={() => navigation.navigate("VideoPlayer", { video: item })}
          />
        ));
      case "shorts":
        return (
          <View style={styles.shortsGrid}>
            {shorts.map((short) => (
              <TouchableOpacity
                key={short._id}
                style={styles.shortItem}
                onPress={() => navigation.navigate("Shorts")}
              >
                <Image
                  source={{ uri: short.videoUrl || short.thumbnailUrl }}
                  style={styles.shortImage}
                />
                <View style={styles.shortOverlay}>
                  <Text style={styles.shortViews}>{formatViews(short.views || 0)} views</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
      case "about":
        return (
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutTitle}>Description</Text>
            <Text style={styles.aboutText}>{channelData.description}</Text>
            <View style={styles.aboutStats}>
              <Text style={styles.aboutText}>Joined {new Date(channelData.createdAt).toLocaleDateString()}</Text>
              <Text style={styles.aboutText}>{formatViews(channelData.totalViews || 0)} total views</Text>
            </View>
          </View>
        );
    }
  };

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
        <Image source={{ uri: channelData.banner }} style={styles.banner} />

        {/* Channel Info */}
        <View style={styles.infoContainer}>
          <Avatar uri={channelData.avatar} size={70} style={styles.avatar} />
          <Text style={styles.channelName}>{channelData.name}</Text>
          <Text style={styles.channelStats}>
            {channelData.handle} • {channelData.subscribers} subscribers •{" "}
            {channelData.videosCount} videos
          </Text>
          <Text style={styles.channelDesc} numberOfLines={2}>
            {channelData.description}
          </Text>

          <Button
            title="Subscribe"
            onPress={() => {}}
            style={styles.subscribeBtn}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "videos" && styles.activeTab]}
            onPress={() => setActiveTab("videos")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "videos" && styles.activeTabText,
              ]}
            >
              VIDEOS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "shorts" && styles.activeTab]}
            onPress={() => setActiveTab("shorts")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "shorts" && styles.activeTabText,
              ]}
            >
              SHORTS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "about" && styles.activeTab]}
            onPress={() => setActiveTab("about")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "about" && styles.activeTabText,
              ]}
            >
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    backgroundColor: colors.dark.background,
    zIndex: 10,
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
    padding: layout.spacing.md,
    alignItems: "center",
  },
  avatar: {
    marginTop: -35,
    borderWidth: 4,
    borderColor: colors.dark.background,
    marginBottom: layout.spacing.sm,
  },
  channelName: {
    color: colors.dark.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as "700",
    marginBottom: 4,
  },
  channelStats: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    marginBottom: 8,
  },
  channelDesc: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    textAlign: "center",
    marginBottom: layout.spacing.lg,
  },
  subscribeBtn: {
    width: "100%",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  tab: {
    flex: 1,
    paddingVertical: layout.spacing.md,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.dark.text,
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
    paddingTop: layout.spacing.md,
    paddingBottom: layout.spacing.xl,
  },
  shortsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: layout.spacing.xs,
  },
  shortItem: {
    width: "33.33%",
    aspectRatio: 9 / 16,
    padding: 2,
  },
  shortImage: {
    width: "100%",
    height: "100%",
    borderRadius: layout.borderRadius.sm,
  },
  shortOverlay: {
    position: "absolute",
    bottom: 8,
    left: 8,
  },
  shortViews: {
    color: colors.dark.white,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium as "500",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  aboutContainer: {
    paddingHorizontal: layout.spacing.md,
  },
  aboutTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as "700",
    marginBottom: layout.spacing.sm,
  },
  aboutText: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
    lineHeight: 22,
  },
  aboutStats: {
    marginTop: layout.spacing.xl,
    paddingTop: layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
});
