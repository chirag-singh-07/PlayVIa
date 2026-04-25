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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
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
    if (!videoUrl) {
      Alert.alert(strings.error, strings.emptyUrlError);
      return;
    }

    if (isYouTubeUrl(videoUrl)) {
      Alert.alert(strings.error, strings.youtubeDownloadNotAllowed);
      return;
    }

    Alert.alert(
      strings.legalDisclaimerTitle,
      strings.legalDisclaimerMessage,
      [
        { text: strings.cancel, style: 'cancel' },
        {
          text: strings.agreeAndDownload,
          onPress: async () => {
            try {
              const downloadAllowed = await checkDownloadability(videoUrl);

              if (!downloadAllowed) {
                Alert.alert(strings.error, strings.downloadNotAllowed);
                return;
              }

              if (Platform.OS === 'android' && Platform.Version <= 29) {
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status !== 'granted') {
                  Alert.alert(
                    strings.permissionRequired,
                    strings.mediaLibraryPermissionDenied
                  );
                  return;
                }
              }

              const downloadedUri = await downloadFile(videoUrl);

              if (downloadedUri) {
                Alert.alert(strings.downloadSuccessTitle, strings.downloadSuccessMessage);

                const asset = await MediaLibrary.createAssetAsync(downloadedUri);
                const album = await MediaLibrary.getAlbumAsync(strings.rudnexDownloadsAlbum);
                if (album === null) {
                  await MediaLibrary.createAlbumAsync(strings.rudnexDownloadsAlbum, asset, false);
                } else {
                  await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                }

                Alert.alert(
                  strings.fileSaved,
                  strings.fileSavedMessage,
                  [
                    { text: strings.ok, style: 'cancel' },
                    {
                      text: strings.share,
                      onPress: () => shareDownloadedFile(downloadedUri),
                    },
                  ]
                );
              } else {
                Alert.alert(strings.error, strings.downloadFailed);
              }
            } catch (error: any) {
              console.error('Download error:', error);
              Alert.alert(strings.error, `${strings.downloadFailed}: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const shareDownloadedFile = async (uri: string) => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert(strings.error, strings.sharingNotAvailable);
        return;
      }
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error sharing file:', error);
      Alert.alert(strings.error, strings.sharingFailed);
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
