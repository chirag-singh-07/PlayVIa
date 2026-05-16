import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatsCard } from "../components/StatsCard";
import { DashboardCard } from "../components/DashboardCard";
import { Button } from "../components/Button";
import * as ImagePicker from "expo-image-picker";
import { Avatar } from "../components/Avatar";
import { VideoCard } from "../components/VideoCard";
import { colors, typography } from "../theme";
import { layout, MOCK_DATA } from "../constants";
import { ScreenWrapper } from "../components/ScreenWrapper";

import { useAuth } from "../context/AuthContext";
import { channelService } from "../services/channelService";
import { earningsService } from "../services/earningsService";

import { formatViews } from "../utils/videoUtils";

export const ChannelDashboardScreen: React.FC<any> = ({ navigation }) => {
  const { user, refreshProfile } = useAuth();
  const [videos, setVideos] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState<any>(null);
  const [earnings, setEarnings] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      if (user?.channel) {
        // Refresh profile first to get latest stats
        await refreshProfile();
        
        const [channelVideos, channelEarnings, channelStats] = await Promise.all([
          channelService.getAllChannelContent(user.channel._id),
          earningsService.getChannelEarnings(user.channel._id),
          channelService.getChannelStats(),
        ]);
        setVideos(channelVideos);
        setEarnings(channelEarnings);
        setStats(channelStats);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.channel?._id]);

  React.useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleUpdateBranding = async (type: 'avatar' | 'banner') => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission required to access media library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: type === 'banner' ? [21, 9] : [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && user?.channel) {
        setIsUpdating(true);
        const asset = result.assets[0];
        const formData = new FormData();
        
        // Android often needs the URI to remain as is, but some versions need it handled carefully
        const imageUri = Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', '');

        formData.append(type, {
          uri: imageUri,
          name: `${type}.jpg`,
          type: asset.mimeType || 'image/jpeg',
        } as any);

        console.log(`Starting ${type} upload:`, imageUri);

        await channelService.updateChannel(user.channel._id, formData);
        await refreshProfile();
        Alert.alert('Success', `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`);
      }
    } catch (error: any) {
      console.error(`Error updating ${type}:`, error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      Alert.alert('Upload Failed', `Could not update ${type}: ${errorMsg}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <ScreenWrapper>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.dark.primary} />
        </View>
      </ScreenWrapper>
    );

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Creator Studio</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Analytics Summary */}
        <DashboardCard style={styles.section}>
          <Text style={styles.sectionTitle}>Channel Analytics</Text>
          <Text style={styles.sectionSubtitle}>Current subscribers</Text>
          <Text style={styles.largeValue}>
            {formatViews(stats?.subscribers || 0)}
          </Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Views</Text>
              <Text style={styles.summaryValue}>
                {formatViews(stats?.totalViews || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Likes</Text>
              <Text style={styles.summaryValue}>
                {formatViews(stats?.totalLikes || 0)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Comments</Text>
              <Text style={styles.summaryValue}>
                {formatViews(stats?.totalComments || 0)}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.analyticsLink}>
            <Text style={styles.analyticsLinkText}>SEE CHANNEL ANALYTICS</Text>
          </TouchableOpacity>
        </DashboardCard>

        {/* Branding & Identity */}
        <DashboardCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Branding</Text>
            {isUpdating && <ActivityIndicator size="small" color={colors.dark.primary} />}
          </View>
          
          <View style={styles.brandingContainer}>
            <TouchableOpacity 
              style={styles.bannerPreview} 
              onPress={() => handleUpdateBranding('banner')}
              disabled={isUpdating}
            >
              <Image 
                source={{ uri: user?.channel?.banner || 'https://via.placeholder.com/800x200' }} 
                style={styles.dashboardBanner} 
              />
              <View style={styles.bannerEditOverlay}>
                <Ionicons name="camera" size={24} color="white" />
                <Text style={styles.overlayText}>Change Banner</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.avatarRow}>
              <TouchableOpacity 
                style={styles.avatarPicker} 
                onPress={() => handleUpdateBranding('avatar')}
                disabled={isUpdating}
              >
                <Avatar uri={user?.channel?.avatar} name={user?.channel?.name} size={64} />
                <View style={styles.avatarEditBadge}>
                  <Ionicons name="camera" size={14} color="white" />
                </View>
              </TouchableOpacity>
              <View style={styles.brandingText}>
                <Text style={styles.brandingName}>{user?.channel?.name}</Text>
                <Text style={styles.brandingSub}>Update your channel's public identity</Text>
              </View>
            </View>
          </View>
        </DashboardCard>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.studioActionBtn}
            onPress={() => navigation.navigate("Upload")}
          >
            <View
              style={[
                styles.actionIconCircle,
                { backgroundColor: colors.dark.primary },
              ]}
            >
              <Ionicons name="add" size={24} color={colors.dark.white} />
            </View>
            <Text style={styles.actionBtnLabel}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.studioActionBtn}
            onPress={() => navigation.navigate("Shorts")}
          >
            <View
              style={[styles.actionIconCircle, { backgroundColor: "#FF5722" }]}
            >
              <Ionicons name="flash" size={20} color={colors.dark.white} />
            </View>
            <Text style={styles.actionBtnLabel}>Shorts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.studioActionBtn}
            onPress={() =>
              navigation.navigate("ChannelEdit", {
                channel: user?.channel,
              })
            }
          >
            <View
              style={[
                styles.actionIconCircle,
                { backgroundColor: colors.dark.surface },
              ]}
            >
              <Ionicons name="settings-outline" size={20} color={colors.dark.text} />
            </View>
            <Text style={styles.actionBtnLabel}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Latest Video Performance */}
        {videos.length > 0 && (
          <DashboardCard style={styles.section}>
            <Text style={styles.sectionTitle}>Latest Video Performance</Text>
            <View style={styles.latestVideoHeader}>
              <Image
                source={{
                  uri:
                    videos[0].thumbnailUrl ||
                    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop",
                }}
                style={styles.latestThumb}
              />
              <Text style={styles.latestTitle} numberOfLines={2}>
                {videos[0].title}
              </Text>
            </View>
            <View style={styles.statsList}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Views</Text>
                <Text style={styles.statValue}>
                  {formatViews(videos[0].views || 0)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Avg. view duration</Text>
                <Text style={styles.statValue}>1:42 (45%)</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>
                  Impressions click-through rate
                </Text>
                <Text style={styles.statValue}>8.4%</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.analyticsLink}>
              <Text style={styles.analyticsLinkText}>
                GO TO VIDEO ANALYTICS
              </Text>
            </TouchableOpacity>
          </DashboardCard>
        )}

        {/* Monetization Section */}
        <DashboardCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Monetization</Text>
            <Ionicons
              name={earnings?.eligible ? "checkmark-circle" : "lock-closed"}
              size={20}
              color={earnings?.eligible ? "#4CAF50" : colors.dark.textSecondary}
            />
          </View>
          {earnings?.eligible ? (
            <View>
              <Text style={styles.largeValue}>₹{earnings.earnings}</Text>
              <Text style={styles.sectionSubtitle}>
                Total Estimated Earnings
              </Text>
              <Button
                title="Withdraw Funds"
                onPress={() => navigation.navigate("Withdrawal")}
                style={{ marginTop: 10 }}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.sectionSubtitle}>
                Not yet eligible for monetization.
              </Text>
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${Math.min(100, (user?.channel?.subscribersCount || 0) / 20)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {user?.channel?.subscribersCount || 0} / 2000 subscribers
                required
              </Text>
            </View>
          )}
        </DashboardCard>

        {/* Published Content */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Published Content</Text>
          <TouchableOpacity onPress={() => navigation.navigate("YourVideos")}>
            <Text style={styles.seeAllText}>SEE ALL</Text>
          </TouchableOpacity>
        </View>

        {videos.slice(0, 3).map((item) => (
          <View key={item._id} style={styles.contentItem}>
            <Image
              source={{
                uri: item.thumbnailUrl || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=400&auto=format&fit=crop",
              }}
              style={styles.contentThumb}
            />
            <View style={styles.contentInfo}>
              <Text style={styles.contentTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.contentStats}>
                {formatViews(item.views || 0)} views •{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity style={styles.contentAction}>
              <Ionicons
                name="ellipsis-vertical"
                size={20}
                color={colors.dark.textSecondary}
              />
            </TouchableOpacity>
          </View>
        ))}
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
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.lg,
  },
  backBtn: {
    marginRight: layout.spacing.md,
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as "700",
  },
  content: {
    padding: layout.spacing.md,
    paddingBottom: layout.spacing.xl,
  },
  section: {
    marginBottom: layout.spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: layout.spacing.md,
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as "700",
  },
  sectionSubtitle: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    marginBottom: 8,
  },
  seeAllText: {
    color: colors.dark.primary,
    fontSize: typography.sizes.sm,
    fontWeight: "600",
  },
  largeValue: {
    color: colors.dark.text,
    fontSize: 36,
    fontWeight: typography.weights.bold as "700",
    marginTop: 4,
  },
  summaryStats: {
    flexDirection: "row",
    marginTop: 20,
    gap: 20,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    color: colors.dark.textSecondary,
    fontSize: 11,
    textTransform: "uppercase",
  },
  summaryValue: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
  },
  summaryChange: {
    fontSize: 11,
    marginTop: 2,
  },
  analyticsLink: {
    paddingVertical: 10,
    alignItems: "center",
  },
  analyticsLinkText: {
    color: colors.dark.primary,
    fontSize: typography.sizes.sm,
    fontWeight: "700",
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: layout.spacing.md,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: layout.spacing.lg,
    backgroundColor: colors.dark.surface,
    paddingVertical: 16,
    borderRadius: 12,
  },
  studioActionBtn: {
    alignItems: "center",
    gap: 8,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnLabel: {
    color: colors.dark.text,
    fontSize: 12,
    fontWeight: "500",
  },
  latestVideoHeader: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  latestThumb: {
    width: 120,
    height: 68,
    borderRadius: 4,
    backgroundColor: colors.dark.border,
  },
  latestTitle: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  statsList: {
    gap: 12,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statLabel: {
    color: colors.dark.textSecondary,
    fontSize: 13,
  },
  statValue: {
    color: colors.dark.text,
    fontSize: 13,
    fontWeight: "500",
  },
  contentItem: {
    flexDirection: "row",
    backgroundColor: colors.dark.surface,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  contentThumb: {
    width: 100,
    height: 56,
    borderRadius: 4,
    backgroundColor: colors.dark.border,
  },
  contentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contentTitle: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  contentStats: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  contentAction: {
    padding: 8,
  },
  progressContainer: {
    height: 8,
    backgroundColor: colors.dark.border,
    borderRadius: 4,
    marginVertical: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.dark.primary,
  },
  progressText: {
    color: colors.dark.textSecondary,
    fontSize: 11,
  },
  brandingContainer: {
    marginTop: 8,
  },
  bannerPreview: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  dashboardBanner: {
    width: '100%',
    height: '100%',
  },
  bannerEditOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  overlayText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPicker: {
    position: 'relative',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.dark.primary,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.dark.surface,
  },
  brandingText: {
    marginLeft: 16,
    flex: 1,
  },
  brandingName: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  brandingSub: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});
