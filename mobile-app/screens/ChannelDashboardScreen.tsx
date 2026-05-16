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
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { Avatar } from "../components/Avatar";
import { colors, typography } from "../theme";
import { layout } from "../constants";
import { ScreenWrapper } from "../components/ScreenWrapper";
import { useAuth } from "../context/AuthContext";
import { channelService } from "../services/channelService";
import { earningsService } from "../services/earningsService";
import { formatViews } from "../utils/videoUtils";
import RazorpayCheckout from "react-native-razorpay";
import { boostService } from "../services/boostService";
import { Modal } from "react-native";
import Constants from "expo-constants";

const { width } = Dimensions.get("window");

// Helper components moved inside or ensured they have access to styles
const QuickAction = ({ icon, label, color, onPress }: any) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={[styles.actionIcon, { backgroundColor: color + "20" }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const GlassStatCard = ({ label, value, icon, trend }: any) => (
  <View style={styles.glassCard}>
    <View style={styles.glassHeader}>
      <Ionicons name={icon} size={18} color={colors.dark.textSecondary} />
      <Text style={styles.trendText}>{trend}</Text>
    </View>
    <Text style={styles.glassValue}>{value}</Text>
    <Text style={styles.glassLabel}>{label}</Text>
  </View>
);

const TipCard = ({ title, desc, image }: any) => (
  <TouchableOpacity style={styles.tipCard} activeOpacity={0.8}>
    <Image source={{ uri: image }} style={styles.tipImage} />
    <View style={styles.tipContent}>
      <Text style={styles.tipTitle}>{title}</Text>
      <Text style={styles.tipDesc} numberOfLines={2}>
        {desc}
      </Text>
    </View>
  </TouchableOpacity>
);

const EmptyState = ({ message, icon = "document-text-outline" }: any) => (
  <View style={styles.emptyContainer}>
    <Ionicons name={icon} size={40} color={colors.dark.border} />
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

export const ChannelDashboardScreen: React.FC<any> = ({ navigation }) => {
  const { user, refreshProfile } = useAuth();
  const [videos, setVideos] = React.useState<any[]>([]);
  const [comments, setComments] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState<any>(null);
  const [earnings, setEarnings] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [showBoostModal, setShowBoostModal] = React.useState(false);
  const [selectedVideo, setSelectedVideo] = React.useState<any>(null);
  const [isBoosting, setIsBoosting] = React.useState(false);
  const [boostSettings, setBoostSettings] = React.useState<any>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<{days: number, price: number} | null>({days: 7, price: 0});
  const [paymentStatus, setPaymentStatus] = React.useState<'idle' | 'success' | 'failed' | 'cancelled'>('idle');
  const [paymentErrorMessage, setPaymentErrorMessage] = React.useState('');
  const [lastOrderId, setLastOrderId] = React.useState('');

  const RAZORPAY_KEY = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || "";

  const fetchDashboardData = React.useCallback(async () => {
    try {
      if (user?.channel) {
        await refreshProfile();
        const [channelVideos, channelEarnings, channelStats, channelComments, settings] =
          await Promise.all([
            channelService.getAllChannelContent(user.channel._id),
            earningsService.getChannelEarnings(user.channel._id),
            channelService.getChannelStats(),
            channelService.getCreatorComments(),
            boostService.getSettings(),
          ]);
        setVideos(channelVideos);
        setEarnings(channelEarnings);
        setStats(channelStats);
        setComments(channelComments);
        setBoostSettings(settings);

        // Set default selected plan price
        const perDay = settings?.perDayCost || 100;
        const discount = settings?.discounts?.days7 || 20;
        const price = Math.round(perDay * 7 * (1 - discount / 100));
        setSelectedPlan({ days: 7, price });
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

  const handleUpdateBranding = async (type: "avatar" | "banner") => {
    console.log(`📸 Starting ${type} update process...`);
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission required to access media library");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: type === "banner" ? [21, 9] : [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && user?.channel) {
        setIsUpdating(true);
        const asset = result.assets[0];
        console.log(`📦 File selected: ${asset.uri}`);

        const formData = new FormData();
        const imageUri =
          Platform.OS === "android"
            ? asset.uri
            : asset.uri.replace("file://", "");

        formData.append(type, {
          uri: imageUri,
          name: `${type}.jpg`,
          type: asset.mimeType || "image/jpeg",
        } as any);

        console.log(`📤 Uploading ${type} to backend...`);
        const response = await channelService.updateChannel(
          user.channel._id,
          formData,
        );
        console.log(
          `✅ ${type} upload successful:`,
          JSON.stringify(response, null, 2),
        );

        console.log("🔄 Refreshing profile...");
        await refreshProfile();
        console.log(
          "👤 Profile refreshed. Current user state:",
          JSON.stringify(
            user,
            (key, value) => (key === "password" ? undefined : value),
            2,
          ),
        );

        Alert.alert(
          "Success",
          `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`,
        );
      } else {
        console.log("🚫 Image picker canceled or user channel missing");
      }
    } catch (error: any) {
      console.error(`❌ Error updating ${type}:`, error);
      Alert.alert(
        "Upload Failed",
        `Could not update ${type}. Check console for details.`,
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBoostVideo = async (duration: number, amount: number) => {
    if (!selectedVideo || !user) return;

    console.log(
      `🚀 Starting boost process for video: ${selectedVideo.title} (${selectedVideo._id})`,
    );
    console.log(`⏱️ Duration: ${duration} days, Amount: ₹${amount}`);

    setIsBoosting(true);
    try {
      // 1. Create order on backend
      console.log("📡 Requesting Razorpay order from backend...");
      const orderData = await boostService.createOrder(
        selectedVideo._id,
        duration,
      );
      setLastOrderId(orderData.orderId);
      console.log("📦 Order received:", JSON.stringify(orderData, null, 2));

      // 2. Open Razorpay Checkout
      const options = {
        description: `Boost Video: ${selectedVideo.title}`,
        image: user.channel?.avatar || "",
        currency: orderData.currency,
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        name: "PlayVia Boost",
        order_id: orderData.orderId,
        prefill: {
          email: user.email,
          contact: "",
          name: user.username,
        },
        theme: { color: "#3949AB" },
      };

      console.log("💳 Opening Razorpay Checkout...");
      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          // 3. Verify payment on backend
          console.log(
            "✅ Razorpay payment success:",
            JSON.stringify(data, null, 2),
          );
          console.log("📡 Verifying payment on backend...");

          try {
            const verifyData = {
              razorpay_order_id: data.razorpay_order_id,
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_signature: data.razorpay_signature,
              videoId: selectedVideo._id,
              duration,
              amount: amount,
            };

            await boostService.verifyPayment(verifyData);
            console.log("🏆 Boost activated successfully!");

            setPaymentStatus('success');
            setTimeout(() => {
              setPaymentStatus('idle');
              setShowBoostModal(false);
              fetchDashboardData();
            }, 3000);
          } catch (error: any) {
            console.error("❌ Verification failed:", error);
            setPaymentStatus('failed');
            setPaymentErrorMessage(error.message || "Could not verify payment. Please contact support.");
            setTimeout(() => setPaymentStatus('idle'), 4000);
          }
        })
        .catch((error: any) => {
          console.log("💳 Razorpay catch block:", JSON.stringify(error));
          
          // Check if it was a user cancellation
          const isCancelled = error.description?.toLowerCase().includes('cancel') || 
                              error.error?.description?.toLowerCase().includes('cancel') ||
                              error.code === 2;

          if (isCancelled) {
            setPaymentStatus('cancelled');
            setPaymentErrorMessage("Payment was dismissed.");
          } else {
            setPaymentStatus('failed');
            setPaymentErrorMessage(error.description || "The transaction could not be completed.");
          }
          
          setTimeout(() => setPaymentStatus('idle'), 3000);
        });
    } catch (error: any) {
      console.error("❌ Order creation failed:", error);
      setPaymentStatus('failed');
      setPaymentErrorMessage("Failed to initialize order. Please try again.");
      setTimeout(() => setPaymentStatus('idle'), 3000);
    } finally {
      setIsBoosting(false);
    }
  };

  if (loading)
    return (
      <ScreenWrapper>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.dark.primary} />
        </View>
      </ScreenWrapper>
    );

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* Next-Gen Command Center Header */}
        <View style={styles.floatingHeader}>
          <View style={styles.headerIdentity}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MainTabs", { screen: "Profile" })
              }
              style={styles.headerAvatarWrapper}
            >
              <Avatar
                uri={
                  user?.avatar ? `${user.avatar}?t=${Date.now()}` : undefined
                }
                size={36}
                style={styles.headerAvatar}
              />
              <View style={styles.onlineDot} />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <View style={styles.brandRow}>
                <Text style={styles.headerBrandText}>Studio</Text>
                <View style={styles.headerBadge}>
                  <Text style={styles.badgeText}>BETA</Text>
                </View>
              </View>
              <Text style={styles.headerSubText}>{user?.channel?.name}</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.glassActionBtn}>
              <Ionicons name="search-outline" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.glassActionBtn}
              onPress={() => navigation.navigate("Notifications")}
            >
              <Ionicons name="notifications-outline" size={20} color="white" />
              <View style={styles.activeNotifDot} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleUpdateBranding("banner")}
            style={styles.bannerContainer}
          >
            <Image
              source={{
                uri: user?.channel?.banner
                  ? `${user.channel.banner}?t=${Date.now()}`
                  : "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000",
              }}
              style={styles.heroBanner}
            />
            <LinearGradient
              colors={["transparent", "rgba(15,15,15,0.9)"]}
              style={styles.bannerGradient}
            />
            <View style={styles.bannerEditIcon}>
              <Ionicons name="camera" size={20} color="white" />
            </View>
          </TouchableOpacity>

          <View style={styles.profileOverlay}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleUpdateBranding("avatar")}
              style={styles.avatarWrapper}
            >
              <Avatar
                uri={
                  user?.channel?.avatar
                    ? `${user.channel.avatar}?t=${Date.now()}`
                    : undefined
                }
                name={user?.channel?.name}
                size={90}
                style={styles.mainAvatar}
              />
              <View style={styles.avatarEditBadge}>
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </TouchableOpacity>
            <View style={styles.profileText}>
              <Text style={styles.channelName}>{user?.channel?.name}</Text>
              <Text style={styles.subCount}>
                {formatViews(stats?.subscribers || 0)} subscribers
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.mainContent}>
          {/* Quick Actions */}
          <View style={styles.quickActionsGrid}>
            <QuickAction
              icon="add-circle"
              label="Upload"
              color="#FF0000"
              onPress={() =>
                navigation.navigate("MainTabs", { screen: "Upload" })
              }
            />
            <QuickAction
              icon="stats-chart"
              label="Analytics"
              color="#00C853"
              onPress={() => {}}
            />
            <QuickAction
              icon="wallet"
              label="Payout"
              color="#2979FF"
              onPress={() => navigation.navigate("Withdrawal")}
            />
            <QuickAction
              icon="settings"
              label="Settings"
              color="#757575"
              onPress={() =>
                navigation.navigate("ChannelEdit", { channel: user?.channel })
              }
            />
          </View>

          {/* Earnings Overview */}
          <View style={styles.earningsOverview}>
            <LinearGradient
              colors={["#1A237E", "#3949AB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.earningsGradient}
            >
              <View style={styles.earningsInfo}>
                <View>
                  <Text style={styles.earningsLabel}>Current Earnings</Text>
                  <Text style={styles.earningsValue}>
                    ₹{earnings?.earnings || 0}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.payoutBtn}
                  onPress={() => navigation.navigate("Withdrawal")}
                >
                  <Text style={styles.payoutBtnText}>Payouts</Text>
                  <Ionicons name="chevron-forward" size={14} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(((earnings?.earnings || 0) / 5000) * 100, 100)}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressSubtext}>
                  ₹{earnings?.earnings || 0} of ₹5,000 threshold
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <GlassStatCard
              label="Total Views"
              value={formatViews(stats?.totalViews || 0)}
              icon="eye-outline"
              trend="+12%"
            />
            <GlassStatCard
              label="Subscribers"
              value={formatViews(stats?.subscribers || 0)}
              icon="people-outline"
              trend="+8%"
            />
          </View>

          {/* Latest Video */}
          <View style={styles.latestVideoSection}>
            <Text style={styles.sectionHeading}>Latest Performance</Text>
            {videos.length > 0 ? (
              <TouchableOpacity
                style={styles.latestCard}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate("VideoDetails", { video: videos[0] })
                }
              >
                <Image
                  source={{
                    uri:
                      videos[0].thumbnailUrl ||
                      "https://via.placeholder.com/400x225",
                  }}
                  style={styles.latestThumb}
                />
                <View style={styles.latestInfo}>
                  <Text style={styles.latestTitle} numberOfLines={2}>
                    {videos[0].title}
                  </Text>
                  <View style={styles.latestStatsRow}>
                    <View style={styles.inlineStat}>
                      <Ionicons
                        name="eye"
                        size={14}
                        color={colors.dark.textSecondary}
                      />
                      <Text style={styles.inlineStatText}>
                        {formatViews(videos[0].views || 0)}
                      </Text>
                    </View>
                    <View style={styles.inlineStat}>
                      <Ionicons
                        name="heart"
                        size={14}
                        color={colors.dark.textSecondary}
                      />
                      <Text style={styles.inlineStatText}>
                        {formatViews(videos[0].likesCount || 0)}
                      </Text>
                    </View>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.dark.textSecondary}
                />
              </TouchableOpacity>
            ) : (
              <EmptyState
                message="No videos uploaded yet"
                icon="videocam-off-outline"
              />
            )}
          </View>

          {/* Recent Content */}
          <View style={styles.contentSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Recent Content</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("YourVideos")}
              >
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {videos.length > 0 ? (
              videos.slice(0, 4).map((item) => (
                <TouchableOpacity
                  key={item._id}
                  style={styles.contentRow}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate("VideoDetails", { video: item })
                  }
                >
                  <View style={styles.contentThumbWrapper}>
                    <Image
                      source={{ uri: item.thumbnailUrl }}
                      style={styles.contentThumbSm}
                    />
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>12:04</Text>
                    </View>
                  </View>
                  <View style={styles.contentInfoSm}>
                    <Text style={styles.contentTitleSm} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.contentMetaSm}>
                      {formatViews(item.views || 0)} views •{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.contentActions}>
                    <TouchableOpacity
                      style={[
                        styles.boostBadge,
                        item.isBoosted && styles.boostedActive,
                      ]}
                      onPress={() => {
                        setSelectedVideo(item);
                        setShowBoostModal(true);
                      }}
                    >
                      <Ionicons
                        name="rocket"
                        size={12}
                        color={item.isBoosted ? "#fff" : "#FFD600"}
                      />
                      <Text
                        style={[
                          styles.boostText,
                          item.isBoosted && styles.boostedTextActive,
                        ]}
                      >
                        {item.isBoosted ? "Boosted" : "Boost"}
                      </Text>
                    </TouchableOpacity>
                    {item.isBoosted && item.boostedUntil && (
                      <View style={styles.boostTimer}>
                        <Text style={styles.boostTimerText}>
                          Until {new Date(item.boostedUntil).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                    <Ionicons
                      name="analytics-outline"
                      size={20}
                      color={colors.dark.textSecondary}
                    />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <EmptyState message="Upload your first video to see stats here" />
            )}
          </View>

          {/* Real Comments Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Recent Comments</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>VIEW ALL</Text>
              </TouchableOpacity>
            </View>
            {comments.length > 0 ? (
              comments.slice(0, 3).map((comment) => (
                <View key={comment._id} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <Avatar
                      uri={comment.user?.avatar}
                      name={comment.user?.name}
                      size={24}
                    />
                    <Text style={styles.commentAuthor}>
                      {comment.user?.name || "User"}
                    </Text>
                    <Text style={styles.commentTime}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.commentText} numberOfLines={2}>
                    {comment.text}
                  </Text>
                  <Text style={styles.commentVideoTitle}>
                    on {comment.video?.title}
                  </Text>
                </View>
              ))
            ) : (
              <EmptyState
                message="No comments yet"
                icon="chatbubbles-outline"
              />
            )}
          </View>

          {/* Creator Tips */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>Ideas for you</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tipsScroll}
            >
              <TipCard
                title="Boost your views"
                desc="Learn how to make better thumbnails that get clicked."
                image="https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=400"
              />
              <TipCard
                title="Monetization Guide"
                desc="New ways to earn from your short-form content."
                image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400"
              />
            </ScrollView>
          </View>

          <View style={styles.studioFooter}>
            <Ionicons
              name="logo-youtube"
              size={24}
              color={colors.dark.textSecondary}
              style={{ opacity: 0.5 }}
            />
            <Text style={styles.footerText}>Made for Creators with Love</Text>
          </View>
        </View>
      </ScrollView>
      {/* Boost Modal */}
      <Modal
        visible={showBoostModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBoostModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Boost Content</Text>
                <Text style={styles.modalSubtitle}>
                  Reach more viewers faster
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setShowBoostModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.dark.text} />
              </TouchableOpacity>
            </View>

            {selectedVideo && (
              <View style={styles.selectedVideoPreview}>
                <Image
                  source={{ uri: selectedVideo.thumbnailUrl }}
                  style={styles.previewThumb}
                />
                <Text style={styles.previewTitle} numberOfLines={1}>
                  {selectedVideo.title}
                </Text>
              </View>
            )}

            <View style={styles.boostOptions}>
              {[3, 7, 30].map((days) => {
                const perDay = boostSettings?.perDayCost || 100;
                const discount =
                  days === 3
                    ? boostSettings?.discounts?.days3 || 10
                    : days === 7
                      ? boostSettings?.discounts?.days7 || 20
                      : boostSettings?.discounts?.days30 || 30;
                const originalPrice = perDay * days;
                const finalPrice = Math.round(
                  originalPrice * (1 - discount / 100),
                );
                const savings = originalPrice - finalPrice;
                return (
                  <TouchableOpacity
                    key={days}
                    style={[
                      styles.boostOption,
                      selectedPlan?.days === days && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedPlan({ days, price: finalPrice })}
                  >
                    <View>
                      <Text style={styles.optionTitle}>{days} Days Boost</Text>
                      <Text style={styles.optionDesc}>
                        {discount}% Discount included
                      </Text>
                    </View>
                    <View style={styles.optionPriceContainer}>
                      <Text style={styles.optionPrice}>₹{finalPrice}</Text>
                      <View
                        style={[
                          styles.optionBadge,
                          days === 7 && { backgroundColor: "#FFD600" },
                          days === 30 && { backgroundColor: "#00E676" },
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionBadgeText,
                            days === 7 && { color: "#000" },
                          ]}
                        >
                          {days === 7
                            ? "BEST VALUE"
                            : days === 30
                              ? "MAX REACH"
                              : `SAVE ₹${savings}`}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity 
              style={[
                styles.payButton, 
                isBoosting && { backgroundColor: '#00E676' },
                (!selectedPlan || isBoosting) && styles.disabledPayButton,
                isBoosting && { opacity: 1 } // Keep it bright green while loading
              ]}
              onPress={() => selectedPlan && handleBoostVideo(selectedPlan.days, selectedPlan.price)}
              disabled={!selectedPlan || isBoosting}
            >
              {isBoosting ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Ionicons name="card-outline" size={20} color="#000" />
                  <Text style={styles.payButtonText}>
                    PAY ₹{selectedPlan?.price || 0} & BOOST NOW
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.boostNote}>
              * Boosted videos appear at the top of Home and Shorts feeds.
              Payments are processed securely via RoxPay (Razorpay).
            </Text>

            {isBoosting && (
              <View style={styles.modalLoading}>
                <ActivityIndicator color={colors.dark.primary} />
                <Text style={styles.modalLoadingText}>
                  Initializing Payment...
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {paymentStatus !== 'idle' && (
        <View style={styles.statusOverlay}>
          <View style={[
            styles.statusCard, 
            paymentStatus === 'failed' && { borderColor: '#FF5252' },
            paymentStatus === 'cancelled' && { borderColor: '#FFA000' }
          ]}>
            <View style={[
              styles.statusIconCircle, 
              { backgroundColor: paymentStatus === 'success' ? '#00E676' : (paymentStatus === 'cancelled' ? '#FFA000' : '#FF5252') }
            ]}>
              <Ionicons 
                name={paymentStatus === 'success' ? "checkmark" : (paymentStatus === 'cancelled' ? "close-circle-outline" : "close")} 
                size={40} 
                color="white" 
              />
            </View>
            <Text style={styles.statusTitle}>
              {paymentStatus === 'success' ? 'Payment Successful!' : (paymentStatus === 'cancelled' ? 'Payment Cancelled' : 'Payment Failed')}
            </Text>
            <Text style={styles.statusSubtitle}>
              {paymentStatus === 'success' 
                ? `Order ID: ${lastOrderId}\nYour video is now being boosted.` 
                : paymentErrorMessage}
            </Text>
          </View>
        </View>
      )}

      {isUpdating && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Updating branding...</Text>
        </View>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark.background,
  },
  floatingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(15, 15, 15, 0.95)", // Sleek dark glass
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 1000,
  },
  headerIdentity: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerAvatarWrapper: {
    position: "relative",
  },
  headerAvatar: {
    borderWidth: 1.5,
    borderColor: colors.dark.primary,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00E676",
    borderWidth: 2,
    borderColor: "#0f0f0f",
  },
  headerInfo: {
    marginLeft: 12,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerBrandText: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  headerBadge: {
    backgroundColor: colors.dark.primary,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  badgeText: {
    color: "white",
    fontSize: 8,
    fontWeight: "900",
  },
  headerSubText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 11,
    fontWeight: "600",
    marginTop: -2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  glassActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  activeNotifDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.dark.primary,
    borderWidth: 1.5,
    borderColor: "#0f0f0f",
  },
  closeBtn: {
    marginLeft: 4,
    padding: 4,
  },
  heroSection: { height: 220, position: "relative" },
  bannerContainer: {
    width: "100%",
    height: 160,
    backgroundColor: colors.dark.surface,
  },
  heroBanner: { width: "100%", height: "100%" },
  bannerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bannerEditIcon: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  profileOverlay: {
    position: "absolute",
    bottom: 0,
    left: 20,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  avatarWrapper: {
    position: "relative",
    padding: 4,
    backgroundColor: colors.dark.background,
    borderRadius: 50,
  },
  mainAvatar: { borderWidth: 3, borderColor: colors.dark.background },
  avatarEditBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: colors.dark.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.dark.background,
  },
  profileText: { marginLeft: 15, marginBottom: 10 },
  channelName: { color: colors.dark.text, fontSize: 22, fontWeight: "900" },
  subCount: { color: colors.dark.textSecondary, fontSize: 14, marginTop: 2 },
  mainContent: { padding: 20 },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    backgroundColor: colors.dark.surface,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: colors.dark.border,
  },
  actionItem: { alignItems: "center", width: (width - 100) / 4 },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionLabel: { color: colors.dark.text, fontSize: 11, fontWeight: "600" },
  sectionHeading: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 15,
  },
  glassCard: {
    flex: 1,
    backgroundColor: colors.dark.surface,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  glassHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  trendText: { color: "#00C853", fontSize: 12, fontWeight: "bold" },
  glassValue: { color: colors.dark.text, fontSize: 24, fontWeight: "900" },
  glassLabel: { color: colors.dark.textSecondary, fontSize: 12, marginTop: 4 },
  latestVideoSection: { marginBottom: 30 },
  latestCard: {
    flexDirection: "row",
    backgroundColor: colors.dark.surface,
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  latestThumb: {
    width: 100,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#333",
  },
  latestInfo: { flex: 1, marginLeft: 15 },
  latestTitle: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  latestStatsRow: { flexDirection: "row", gap: 12 },
  inlineStat: { flexDirection: "row", alignItems: "center", gap: 4 },
  inlineStatText: { color: colors.dark.textSecondary, fontSize: 12 },
  contentSection: { marginBottom: 30 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  seeAllText: { color: colors.dark.primary, fontWeight: "bold", fontSize: 14 },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 8,
    borderRadius: 15,
  },
  contentThumbWrapper: { position: "relative" },
  contentThumbSm: {
    width: 80,
    height: 45,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  durationBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  durationText: { color: "white", fontSize: 10, fontWeight: "bold" },
  contentInfoSm: { flex: 1, marginLeft: 12 },
  contentTitleSm: { color: colors.dark.text, fontSize: 14, fontWeight: "600" },
  contentMetaSm: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  sectionContainer: { marginBottom: 30 },
  commentCard: {
    backgroundColor: colors.dark.surface,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.dark.border,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  commentAuthor: { color: colors.dark.text, fontSize: 13, fontWeight: "700" },
  commentTime: { color: colors.dark.textSecondary, fontSize: 11 },
  commentText: {
    color: colors.dark.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  commentVideoTitle: {
    color: colors.dark.textSecondary,
    fontSize: 11,
    fontStyle: "italic",
  },
  tipsScroll: { marginTop: 10 },
  earningsOverview: {
    marginBottom: 25,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  earningsGradient: {
    padding: 20,
  },
  earningsInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  earningsLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "600",
  },
  earningsValue: {
    color: "white",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 2,
  },
  payoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  payoutBtnText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  progressContainer: {
    marginTop: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#00E676",
    borderRadius: 3,
  },
  progressSubtext: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    marginTop: 6,
    fontWeight: "600",
  },
  tipCard: {
    width: 200,
    backgroundColor: colors.dark.surface,
    borderRadius: 20,
    marginRight: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  tipImage: { width: "100%", height: 100 },
  tipContent: { padding: 12 },
  tipTitle: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
  },
  tipDesc: { color: colors.dark.textSecondary, fontSize: 12, lineHeight: 16 },
  studioFooter: { alignItems: "center", paddingVertical: 40, gap: 10 },
  footerText: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.5,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 20,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  emptyText: { color: colors.dark.textSecondary, fontSize: 13, marginTop: 10 },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    color: "white",
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
  },
  contentActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  boostBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 214, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 214, 0, 0.3)",
  },
  boostedActive: {
    backgroundColor: "#FFD600",
    borderColor: "#FFD600",
  },
  boostText: {
    color: "#FFD600",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  boostedTextActive: {
    color: "#000",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#121212",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  modalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "900",
  },
  modalSubtitle: {
    color: colors.dark.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  // closeBtn: {
  //   padding: 5,
  //   backgroundColor: "rgba(255,255,255,0.05)",
  //   borderRadius: 12,
  // },
  selectedVideoPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 10,
    borderRadius: 15,
    marginBottom: 20,
    gap: 12,
  },
  previewThumb: {
    width: 60,
    height: 35,
    borderRadius: 6,
  },
  previewTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  boostOptions: {
    gap: 12,
    marginBottom: 20,
  },
  boostOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedOption: {
    borderColor: colors.dark.primary,
    backgroundColor: "rgba(57, 73, 171, 0.1)",
  },
  optionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
  optionDesc: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  optionPriceContainer: {
    alignItems: "flex-end",
  },
  optionPrice: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
  },
  optionBadge: {
    backgroundColor: colors.dark.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  optionBadgeText: {
    color: "white",
    fontSize: 9,
    fontWeight: "900",
  },
  boostNote: {
    color: colors.dark.textSecondary,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 20,
  },
  modalLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalLoadingText: {
    color: "white",
    marginTop: 15,
    fontWeight: "700",
  },
  boostTimer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  boostTimerText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 9,
    fontWeight: "600",
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFD600",
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
  },
  payButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledPayButton: {
    backgroundColor: "#444",
    opacity: 0.5,
  },
  statusOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  statusCard: {
    width: width * 0.8,
    backgroundColor: '#1E1E1E',
    borderRadius: 25,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00E676',
  },
  statusIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  statusTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  statusSubtitle: {
    color: colors.dark.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
