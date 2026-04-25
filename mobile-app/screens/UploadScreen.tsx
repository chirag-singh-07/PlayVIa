import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { colors, typography } from '../theme';
import { layout } from '../constants';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { videoService } from '../services/videoService';

export const UploadScreen: React.FC<any> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<any>(null);
  const [thumbnailFile, setThumbnailFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    if (!title || !videoFile) {
      Alert.alert('Error', 'Please provide at least a title and a video file.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      
      // Assuming videoFile and thumbnailFile are objects from an image picker
      // { uri, name, type }
      formData.append('video', {
        uri: videoFile.uri,
        name: videoFile.name || 'video.mp4',
        type: videoFile.type || 'video/mp4',
      } as any);

      if (thumbnailFile) {
        formData.append('thumbnail', {
          uri: thumbnailFile.uri,
          name: thumbnailFile.name || 'thumbnail.jpg',
          type: thumbnailFile.type || 'image/jpeg',
        } as any);
      }

      await videoService.uploadVideo(formData);
      setIsLoading(false);
      Alert.alert('Success', 'Video uploaded successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error: any) {
      setIsLoading(false);
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error.response?.data?.message || 'Failed to upload video.');
    }
  };

  return (
    <ScreenWrapper withKeyboardAvoidView>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upload Video</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Video Picker Placeholder */}
        <TouchableOpacity style={styles.uploadPlaceholder} onPress={() => { /* Implement picker */ }}>
          <Ionicons name="cloud-upload-outline" size={64} color={colors.dark.textSecondary} />
          <Text style={styles.uploadText}>{videoFile ? 'Video selected' : 'Tap to select a video'}</Text>
        </TouchableOpacity>

        <InputField
          label="Title"
          placeholder="Create a title"
          value={title}
          onChangeText={setTitle}
        />

        <InputField
          label="Description"
          placeholder="Add description"
          multiline
          numberOfLines={4}
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
        />

        <Button
          title="Upload Video"
          onPress={handleUpload}
          isLoading={isLoading}
          style={styles.uploadBtn}
        />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as '700',
  },
  content: {
    padding: layout.spacing.md,
  },
  uploadPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.dark.surface,
    borderRadius: layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: layout.spacing.xl,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderStyle: 'dashed',
  },
  uploadText: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.md,
    marginTop: layout.spacing.sm,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadBtn: {
    marginTop: layout.spacing.lg,
  },
});
