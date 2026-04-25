import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from 'expo-av';
// FIXED: replaced expo-sharing with 
// React Native Share API
// FIXED: replaced expo-media-library with 
// "Coming Soon" Alert logic
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '@/constants/theme';
import EmbeddedPlayer from '@/components/EmbeddedPlayer';
import {
  isYouTubeUrl,
  getVideoInfo,
  checkDownloadability,
  downloadFile,
  getVideoThumbnail,
} from '@/utils/videoUtils';
import { getLocalizedStrings } from '@/utils/localization';

const strings = getLocalizedStrings();

const Home = () => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoPlayerRef = useRef<Video>(null);

  useEffect(() => {
    const fetchThumb = async () => {
      if (!videoUrl) {
        setThumbnailUrl(null);
        return;
      }
      // Simple debounce to avoid fetching on every keystroke immediately
      const timer = setTimeout(async () => {
        const thumb = await getVideoThumbnail(videoUrl);
        setThumbnailUrl(thumb);
      }, 500);
      return () => clearTimeout(timer);
    };
    fetchThumb();
  }, [videoUrl]);

  const handlePlayVideo = async () => {
    if (!videoUrl) {
      Alert.alert(strings.error, strings.emptyUrlError);
      return;
    }
    setVideoUri(videoUrl);
  };

  const handleDownloadVideo = async () => {
    // FIXED: replaced expo-media-library with "Coming Soon" Alert
    Alert.alert(
      'Coming Soon',
      'Download feature will be available soon!',
      [{ text: 'OK' }]
    );
  };

  const shareDownloadedFile = async (uri: string) => {
    // FIXED: replaced expo-sharing with React Native Share API
    try {
      await Share.share({
        message: `Check out this video: ${uri}`,
        title: 'Share Video',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearInput = () => {
    setVideoUrl('');
    setVideoUri(null);
    setThumbnailUrl(null);
  };

  const handleFetchDetails = async () => {
    if (!videoUrl) {
      Alert.alert(strings.error, strings.emptyUrlError);
      return;
    }
    try {
      const info = await getVideoInfo(videoUrl);
      Alert.alert(strings.videoDetails, JSON.stringify(info, null, 2));
    } catch (error: any) {
      Alert.alert(strings.error, `${strings.failedToFetchDetails}: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PlayVia</Text>
        </View>

        {videoUri ? <EmbeddedPlayer videoUri={videoUri} /> : null}

        {/* Thumbnail Preview when URL is entered but not playing yet, or separate logic */}
        {thumbnailUrl && !videoUri && (
          <View style={styles.thumbnailPreview}>
            <Image source={{ uri: thumbnailUrl }} style={styles.previewImage} resizeMode="cover" />
            <View style={styles.previewOverlay}>
              <Text style={styles.previewText}>Preview</Text>
            </View>
          </View>
        )}

        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>{strings.enterVideoUrl}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={strings.pasteVideoUrlPlaceholder}
              placeholderTextColor={COLORS.gray}
              value={videoUrl}
              onChangeText={setVideoUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {videoUrl.length > 0 && (
              <TouchableOpacity onPress={handleClearInput}>
                <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.gray} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.playButton} onPress={handlePlayVideo}>
            <MaterialCommunityIcons name="play" size={24} color={COLORS.white} />
            <Text style={styles.playButtonText}>{strings.play}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadVideo}>
            <MaterialCommunityIcons name="download" size={24} color={COLORS.white} />
            <Text style={styles.downloadButtonText}>{strings.download}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.detailsButton} onPress={handleFetchDetails}>
          <Text style={styles.detailsButtonText}>{strings.videoDetails}</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SIZES.padding,
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  headerTitle: {
    ...FONTS.h1,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  thumbnailPreview: {
    height: 200,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.black,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  previewText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputCard: {
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  inputLabel: {
    ...FONTS.body4,
    color: COLORS.text,
    marginBottom: SIZES.base,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    height: 55,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  input: {
    flex: 1,
    ...FONTS.body3,
    height: '100%',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    gap: SIZES.padding,
  },
  playButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  playButtonText: {
    ...FONTS.h3,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  downloadButtonText: {
    ...FONTS.h3,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  detailsButton: {
    alignSelf: 'center',
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  detailsButtonText: {
    ...FONTS.body4,
    textDecorationLine: 'underline',
  },
  adsContainer: {
    marginHorizontal: SIZES.padding,
    height: 100,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  adsText: {
    ...FONTS.body3,
  },
});

export default Home;
