import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography } from '../theme';
import { layout } from '../constants';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { videoService } from '../services/videoService';
import { boostService } from '../services/boostService';
import RazorpayCheckout from 'react-native-razorpay';
import { Modal } from 'react-native';

const VideoDetailsScreen: React.FC<any> = ({ route, navigation }) => {
  const { video } = route.params;
  const [title, setTitle] = React.useState(video.title);
  const [description, setDescription] = React.useState(video.description);
  const [thumbnail, setThumbnail] = React.useState(video.thumbnailUrl);
  const [newThumbnailAsset, setNewThumbnailAsset] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showBoostModal, setShowBoostModal] = React.useState(false);
  const [isBoosting, setIsBoosting] = React.useState(false);
  const [boostSettings, setBoostSettings] = React.useState<any>(null);

  const RAZORPAY_KEY = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || "";

  const handlePickThumbnail = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setThumbnail(result.assets[0].uri);
      setNewThumbnailAsset(result.assets[0]);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      
      if (newThumbnailAsset) {
        const uri = Platform.OS === 'android' ? newThumbnailAsset.uri : newThumbnailAsset.uri.replace('file://', '');
        formData.append('thumbnail', {
          uri,
          name: 'thumbnail.jpg',
          type: 'image/jpeg',
        } as any);
      }

      await videoService.updateVideo(video._id, formData);
      Alert.alert('Success', 'Video updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating video:', error);
      Alert.alert('Error', 'Failed to update video');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Video',
      'Are you sure you want to permanently delete this video? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await videoService.deleteVideo(video._id);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting video:', error);
              Alert.alert('Error', 'Failed to delete video');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const handleBoostVideo = async (duration: number, amount: number) => {
    if (!video || !RAZORPAY_KEY) return;
    
    setIsBoosting(true);
    try {
      const orderData = await boostService.createOrder(video._id, duration);
      
      const options = {
        description: `Boost Video: ${video.title}`,
        image: video.thumbnailUrl || "",
        currency: orderData.currency,
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        name: "PlayVia Boost",
        order_id: orderData.orderId,
        theme: { color: "#3949AB" },
      };

      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          await boostService.verifyPayment({
            razorpay_order_id: data.razorpay_order_id,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature,
            videoId: video._id,
            duration,
            amount: amount,
          });
          Alert.alert("Success", "Your video is now boosted!");
          setShowBoostModal(false);
        })
        .catch((error: any) => {
          Alert.alert(`Error: ${error.code}`, error.description);
        });
    } catch (error: any) {
      Alert.alert("Error", "Failed to initialize payment.");
    } finally {
      setIsBoosting(false);
    }
  };

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await boostService.getSettings();
        setBoostSettings(settings);
      } catch (err) {
        console.error('Error fetching boost settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Video Details</Text>
        </View>
        <TouchableOpacity 
          style={[styles.saveBtn, loading && styles.disabledBtn]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.dark.primary} />
          ) : (
            <Text style={styles.saveBtnText}>SAVE</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Thumbnail Edit */}
        <TouchableOpacity style={styles.thumbnailSection} onPress={handlePickThumbnail} activeOpacity={0.9}>
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
          <View style={styles.thumbnailOverlay}>
            <Ionicons name="camera" size={32} color="white" />
            <Text style={styles.thumbnailOverlayText}>Change Thumbnail</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter video title"
              placeholderTextColor={colors.dark.textSecondary}
              maxLength={100}
            />
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter video description"
              placeholderTextColor={colors.dark.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Performance Stats</Text>
            <View style={styles.statsRow}>
              <StatItem icon="eye-outline" label="Views" value={video.views || 0} />
              <StatItem icon="heart-outline" label="Likes" value={video.likesCount || 0} />
              <StatItem icon="chatbubble-outline" label="Comments" value="--" />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.deleteBtn, isDeleting && styles.disabledBtn]} 
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Ionicons name="trash-outline" size={20} color="#FF5252" />
            <Text style={styles.deleteBtnText}>DELETE VIDEO</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boostBtn} 
            onPress={() => setShowBoostModal(true)}
          >
            <Ionicons name="rocket" size={20} color="#FFD600" />
            <Text style={styles.boostBtnText}>BOOST VIDEO PERFORMANCE</Text>
          </TouchableOpacity>
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
                <Text style={styles.modalSubtitle}>Reach more viewers faster</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeBtn}
                onPress={() => setShowBoostModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.dark.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.boostOptions}>
              {[3, 7, 30].map((days) => {
                const perDay = boostSettings?.perDayCost || 100;
                const discount =
                  days === 3
                    ? boostSettings?.discounts?.days3 || 10
                    : days === 7
                      ? boostSettings?.discounts?.days7 || 20
                      : boostSettings?.discounts?.days30 || 30;
                const finalPrice = Math.round(
                  perDay * days * (1 - discount / 100),
                );

                return (
                  <TouchableOpacity
                    key={days}
                    style={[
                      styles.boostOption,
                      days === 7 && styles.selectedOption,
                    ]}
                    onPress={() => handleBoostVideo(days, finalPrice)}
                  >
                    <View>
                      <Text style={styles.optionTitle}>{days} Days Boost</Text>
                      <Text style={styles.optionDesc}>
                        {discount}% Discount included
                      </Text>
                    </View>
                    <View style={styles.optionPriceContainer}>
                      <Text style={styles.optionPrice}>₹{finalPrice}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.boostNote}>
              * Boosted videos appear at the top of Home and Shorts feeds.
            </Text>

            {isBoosting && (
              <View style={styles.modalLoading}>
                <ActivityIndicator color={colors.dark.primary} />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

const StatItem = ({ icon, label, value }: any) => (
  <View style={styles.statItem}>
    <Ionicons name={icon} size={20} color={colors.dark.textSecondary} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: layout.spacing.md,
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
  },
  saveBtn: {
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.xs,
  },
  saveBtnText: {
    color: colors.dark.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  container: {
    flex: 1,
  },
  thumbnailSection: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.dark.surface,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailOverlayText: {
    color: 'white',
    marginTop: 8,
    fontWeight: '600',
  },
  content: {
    padding: layout.spacing.md,
  },
  inputGroup: {
    marginBottom: layout.spacing.lg,
  },
  label: {
    color: colors.dark.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    color: colors.dark.text,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
    paddingVertical: 8,
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  charCount: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  statsContainer: {
    backgroundColor: colors.dark.surface,
    borderRadius: layout.borderRadius.md,
    padding: layout.spacing.md,
    marginBottom: layout.spacing.xl,
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: layout.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: '#FF5252',
    marginTop: layout.spacing.lg,
    marginBottom: layout.spacing.xl,
  },
  deleteBtnText: {
    color: '#FF5252',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  boostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.md,
    backgroundColor: 'rgba(255, 214, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#FFD600',
    marginTop: layout.spacing.sm,
  },
  boostBtnText: {
    color: '#FFD600',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    color: colors.dark.textSecondary,
    fontSize: 13,
  },
  boostOptions: {
    gap: 12,
    marginBottom: 20,
  },
  boostOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 18,
    borderRadius: 15,
  },
  selectedOption: {
    borderColor: colors.dark.primary,
    borderWidth: 1,
  },
  optionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionDesc: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  optionPrice: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  boostNote: {
    color: colors.dark.textSecondary,
    fontSize: 11,
    textAlign: 'center',
  },
  modalLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  closeBtn: {
    padding: 5,
  },
});
export default VideoDetailsScreen;
