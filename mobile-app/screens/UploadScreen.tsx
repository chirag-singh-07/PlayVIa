import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { colors, typography } from '../theme';
import { layout } from '../constants';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { videoService } from '../services/videoService';
import { channelService } from '../services/channelService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export const UploadScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [videoType, setVideoType] = useState<'video' | 'short'>('video');
  const [videoFile, setVideoFile] = useState<any>(null);
  const [thumbnailFile, setThumbnailFile] = useState<any>(null);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [myChannel, setMyChannel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchInitialData();
    }, [])
  );

  const fetchInitialData = async () => {
    try {
      const [cats, channel] = await Promise.all([
        videoService.getCategories(),
        channelService.getMyChannel()
      ]);
      setCategories(cats);
      setMyChannel(channel);
      if (cats.length > 0) setCategory(cats[0].name);
    } catch (error) {
      console.error('Error fetching upload initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pickVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your media library to upload videos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setVideoFile({
          uri: asset.uri,
          name: asset.fileName || `video_${Date.now()}.mp4`,
          type: 'video/mp4',
          duration: asset.duration ? Math.round(asset.duration / 1000) : 0,
        });
        
        if (asset.duration && asset.duration <= 60000 && asset.width < asset.height) {
          setVideoType('short');
        }
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'An error occurred while picking the video.');
    }
  };

  const pickThumbnail = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your media library to upload thumbnails.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setThumbnailFile({
          uri: asset.uri,
          name: asset.fileName || `thumb_${Date.now()}.jpg`,
          type: 'image/jpeg',
        });
      }
    } catch (error) {
      console.error('Error picking thumbnail:', error);
      Alert.alert('Error', 'An error occurred while picking the thumbnail.');
    }
  };

  const handleUpload = async () => {
    if (!title || !videoFile) {
      Alert.alert('Error', 'Please provide at least a title and a video file.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('tags', tags);
      formData.append('videoType', videoType);
      
      formData.append('video', {
        uri: videoFile.uri,
        name: videoFile.name,
        type: videoFile.type,
      } as any);
      
      if (videoFile.duration) {
        formData.append('duration', videoFile.duration.toString());
      }

      if (thumbnailFile) {
        formData.append('thumbnail', {
          uri: thumbnailFile.uri,
          name: thumbnailFile.name,
          type: thumbnailFile.type,
        } as any);
      }

      await videoService.uploadVideo(formData);
      setIsUploading(false);
      Alert.alert('Success', 'Video uploaded successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error: any) {
      setIsUploading(false);
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error.response?.data?.message || 'Failed to upload video.');
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.dark.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  if (!myChannel) {
    return (
      <ScreenWrapper>
        <View style={styles.noChannelContainer}>
          <View style={styles.noChannelIcon}>
            <Ionicons name="videocam-off-outline" size={80} color={colors.dark.textSecondary} />
          </View>
          <Text style={styles.noChannelTitle}>No Channel Found</Text>
          <Text style={styles.noChannelSub}>You need to create a channel before you can start uploading videos and reaching your audience.</Text>
          <Button 
            title="Create Your Channel" 
            onPress={() => navigation.navigate('CreateChannel')}
            style={styles.createChannelBtn}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper withKeyboardAvoidView>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="close-outline" size={28} color={colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity 
          onPress={handleUpload} 
          disabled={isUploading || !videoFile || !title}
          style={[styles.publishBtn, (isUploading || !videoFile || !title) && styles.disabledBtn]}
        >
          <Text style={styles.publishText}>{isUploading ? '...' : 'UPLOAD'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Video Preview / Picker */}
        <TouchableOpacity 
          style={[styles.uploadPlaceholder, videoFile && styles.hasFile]} 
          onPress={pickVideo}
        >
          {videoFile ? (
            <View style={styles.fileSelectedContainer}>
              <Ionicons name="videocam" size={40} color={colors.dark.primary} />
              <Text style={styles.fileName} numberOfLines={1}>{videoFile.name}</Text>
              <Text style={styles.changeText}>Tap to change video</Text>
            </View>
          ) : (
            <View style={styles.pickerContent}>
              <View style={styles.iconCircle}>
                <Ionicons name="cloud-upload" size={48} color={colors.dark.primary} />
              </View>
              <Text style={styles.uploadTitle}>Select video to upload</Text>
              <Text style={styles.uploadSub}>Your videos will be private until you publish them.</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.formSection}>
          <InputField
            label="Title (required)"
            placeholder="Create a catchy title"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.charCount}>{title.length}/100</Text>

          <InputField
            label="Description"
            placeholder="Tell viewers about your video"
            multiline
            numberOfLines={4}
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
          />

          <View style={styles.sectionDivider} />

          <Text style={styles.sectionTitle}>Thumbnail</Text>
          <Text style={styles.sectionSub}>Select or upload a picture that shows what's in your video.</Text>
          
          <TouchableOpacity style={styles.thumbnailPicker} onPress={pickThumbnail}>
            {thumbnailFile ? (
              <Image source={{ uri: thumbnailFile.uri }} style={styles.thumbnailImage} />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Ionicons name="image-outline" size={32} color={colors.dark.textSecondary} />
                <Text style={styles.thumbnailText}>Upload Thumbnail</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.sectionDivider} />

          <Text style={styles.sectionTitle}>Video Settings</Text>
          
          <View style={styles.typeSelector}>
            <TouchableOpacity 
              style={[styles.typeBtn, videoType === 'video' && styles.typeBtnActive]}
              onPress={() => setVideoType('video')}
            >
              <Ionicons name="videocam-outline" size={20} color={videoType === 'video' ? '#fff' : colors.dark.textSecondary} />
              <Text style={[styles.typeBtnText, videoType === 'video' && styles.typeBtnTextActive]}>Video</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.typeBtn, videoType === 'short' && styles.typeBtnActive]}
              onPress={() => setVideoType('short')}
            >
              <Ionicons name="flash-outline" size={20} color={videoType === 'short' ? '#fff' : colors.dark.textSecondary} />
              <Text style={[styles.typeBtnText, videoType === 'short' && styles.typeBtnTextActive]}>Short</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat._id} 
                onPress={() => setCategory(cat.name)}
                style={[styles.categoryBtn, category === cat.name && styles.categoryBtnActive]}
              >
                <Text style={[styles.categoryBtnText, category === cat.name && styles.categoryBtnTextActive]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <InputField
            label="Tags (comma separated)"
            placeholder="e.g. funny, tutorial, react"
            value={tags}
            onChangeText={setTags}
            style={{ marginTop: layout.spacing.md }}
          />
        </View>

        {isUploading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.dark.primary} />
            <Text style={styles.loadingText}>Uploading your video...</Text>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChannelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  noChannelIcon: {
    marginBottom: 20,
  },
  noChannelTitle: {
    color: colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noChannelSub: {
    color: colors.dark.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  createChannelBtn: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
    backgroundColor: colors.dark.background,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
  },
  publishBtn: {
    backgroundColor: colors.dark.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledBtn: {
    backgroundColor: colors.dark.surface,
    opacity: 0.5,
  },
  publishText: {
    color: '#fff',
    fontWeight: typography.weights.bold as '700',
    fontSize: typography.sizes.sm,
  },
  content: {
    paddingBottom: 40,
  },
  uploadPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  hasFile: {
    backgroundColor: '#000',
  },
  pickerContent: {
    alignItems: 'center',
    padding: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
    marginBottom: 8,
  },
  uploadSub: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fileSelectedContainer: {
    alignItems: 'center',
  },
  fileName: {
    color: colors.dark.text,
    marginTop: 12,
    fontWeight: '500',
  },
  changeText: {
    color: colors.dark.primary,
    fontSize: typography.sizes.xs,
    marginTop: 4,
  },
  formSection: {
    padding: layout.spacing.md,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    color: colors.dark.textSecondary,
    fontSize: 10,
    alignSelf: 'flex-end',
    marginTop: -10,
    marginBottom: layout.spacing.md,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: layout.spacing.lg,
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as '700',
    marginBottom: 4,
  },
  sectionSub: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
    marginBottom: layout.spacing.md,
  },
  thumbnailPicker: {
    width: 160,
    aspectRatio: 16 / 9,
    backgroundColor: colors.dark.surface,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.dark.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    alignItems: 'center',
  },
  thumbnailText: {
    color: colors.dark.textSecondary,
    fontSize: 10,
    marginTop: 4,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: layout.spacing.lg,
    marginTop: 8,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.surface,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  typeBtnActive: {
    backgroundColor: colors.dark.primary,
    borderColor: colors.dark.primary,
  },
  typeBtnText: {
    color: colors.dark.textSecondary,
    fontWeight: '500',
  },
  typeBtnTextActive: {
    color: '#fff',
  },
  label: {
    color: colors.dark.text,
    fontSize: typography.sizes.sm,
    marginBottom: 8,
    fontWeight: '500',
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  categoryBtn: {
    backgroundColor: colors.dark.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.dark.border,
  },
  categoryBtnActive: {
    backgroundColor: colors.dark.primary,
    borderColor: colors.dark.primary,
  },
  categoryBtnText: {
    color: colors.dark.text,
    fontSize: 12,
  },
  categoryBtnTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: typography.sizes.md,
  },
});
