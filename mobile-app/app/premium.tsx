import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '@/constants/theme';
import EmbeddedPlayer from '@/components/EmbeddedPlayer';
import { getVideoThumbnail } from '@/utils/videoUtils';

const CATEGORIES = [
  'All'
];

const Premium = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const scrollViewRef = useRef<ScrollView>(null);

  // Extended sample videos with categories
  // Placeholder for user provided videos
  const allVideos: any[] = [
    {
      id: 1,
      title: 'Featured Video',
      url: 'https://vimeo.com/1141560998?share=copy&fl=sv&fe=ci',
      description: 'Premium high-quality cinematic experience.',
      category: 'Hollywood (English)',
      thumbnail: null
    },
  ];

  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});

  const filteredVideos = selectedCategory === 'All'
    ? allVideos
    : allVideos.filter(v => v.category === selectedCategory);

  useEffect(() => {
    const fetchThumbnails = async () => {
      const newThumbnails = { ...thumbnails };
      for (const video of allVideos) {
        if (!video.thumbnail && !newThumbnails[video.id]) {
          const thumb = await getVideoThumbnail(video.url);
          if (thumb) {
            newThumbnails[video.id] = thumb;
          }
        }
      }
      setThumbnails(newThumbnails);
    };
    fetchThumbnails();
  }, []);

  const handlePlayVideo = (url: string) => {
    setSelectedVideo(url);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleDownload = (url: string, title: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      Alert.alert('Download Not Available', 'YouTube videos cannot be downloaded due to terms of service.');
    } else {
      Alert.alert('Download', `Downloading: ${title}\n\nNote: This is a demo. In production, this would trigger the download functionality from the Home page.`);
    }
  };

  const handleCopyUrl = (url: string) => {
    Alert.alert('URL Copied', 'You can paste this URL in the Home page to play or download.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CINEMIA</Text>
        <Text style={styles.headerSubtitle}>Premium Collection</Text>
      </View>

      {/* Category Chips */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipSelected
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextSelected
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {selectedVideo && (
          <View style={styles.playerSection}>
            <EmbeddedPlayer videoUri={selectedVideo} />
            <TouchableOpacity
              style={styles.closePlayerButton}
              onPress={() => setSelectedVideo(null)}
            >
              <Text style={styles.closePlayerText}>Close Player</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.videosContainer}>
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <View key={video.id} style={styles.videoCard}>
                <TouchableOpacity
                  style={styles.thumbnailContainer}
                  onPress={() => handlePlayVideo(video.url)}
                >
                  {(video.thumbnail || thumbnails[video.id]) ? (
                    <Image
                      source={{ uri: video.thumbnail || thumbnails[video.id] }}
                      style={styles.thumbnail}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
                      <MaterialCommunityIcons name="movie-open" size={40} color={COLORS.gray} />
                    </View>
                  )}
                  <View style={styles.playOverlay}>
                    <MaterialCommunityIcons name="play-circle" size={40} color="rgba(255,255,255,0.8)" />
                  </View>
                </TouchableOpacity>

                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>{video.title}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.categoryTag}>{video.category}</Text>
                  </View>
                  <Text style={styles.videoDescription}>{video.description}</Text>
                </View>

                <View style={styles.videoActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handlePlayVideo(video.url)}
                  >
                    <MaterialCommunityIcons name="play" size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>Play</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.downloadButton]}
                    onPress={() => handleDownload(video.url, video.title)}
                  >
                    <MaterialCommunityIcons name="download" size={20} color={COLORS.white} />
                    <Text style={styles.actionButtonText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="movie-roll" size={50} color={COLORS.lightGray} />
              <Text style={styles.emptyStateText}>No videos found in this category yet.</Text>
            </View>
          )}
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            💡 Tip: Select a category above to filter videos.
          </Text>
        </View>
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
    backgroundColor: COLORS.background,
    paddingBottom: SIZES.base,
  },
  headerTitle: {
    ...FONTS.h1,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    ...FONTS.body3,
    color: COLORS.lightText,
    marginTop: SIZES.base / 2,
  },
  categoryContainer: {
    paddingVertical: SIZES.base,
    backgroundColor: COLORS.background,
  },
  categoryScrollContent: {
    paddingHorizontal: SIZES.padding,
    gap: SIZES.base,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    ...FONTS.body4,
    color: COLORS.text,
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: COLORS.white,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  playerSection: {
    marginVertical: SIZES.padding,
  },
  closePlayerButton: {
    backgroundColor: COLORS.lightGray,
    marginHorizontal: SIZES.padding,
    marginTop: SIZES.base,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  closePlayerText: {
    ...FONTS.body3,
    color: COLORS.text,
  },
  videosContainer: {
    paddingHorizontal: SIZES.padding,
    marginTop: SIZES.padding,
  },
  videoCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    height: 180,
    width: '100%',
    backgroundColor: COLORS.black,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  videoInfo: {
    marginBottom: SIZES.padding,
  },
  videoTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base / 2,
  },
  categoryTag: {
    ...FONTS.body5,
    color: COLORS.primary,
    fontWeight: 'bold',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoDescription: {
    ...FONTS.body4,
    color: COLORS.lightText,
    marginBottom: SIZES.base,
  },
  videoActions: {
    flexDirection: 'row',
    gap: SIZES.base,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.base / 2,
  },
  downloadButton: {
    backgroundColor: COLORS.accent,
  },
  copyButton: {
    flex: 0,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: SIZES.base,
  },
  actionButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  noteContainer: {
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.small,
  },
  noteText: {
    ...FONTS.body4,
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: SIZES.body4 * 1.5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding * 2,
  },
  emptyStateText: {
    ...FONTS.body3,
    color: COLORS.gray,
    marginTop: SIZES.base,
    textAlign: 'center',
  },
});

export default Premium;
