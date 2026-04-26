import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { colors, typography } from '../theme';
import { layout } from '../constants';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { channelService } from '../services/channelService';
import { useAuth } from '../context/AuthContext';

export const ChannelEditScreen: React.FC<any> = ({ navigation, route }) => {
  const { channel } = route.params;
  const { user } = useAuth();
  
  const [name, setName] = useState(channel?.name || '');
  const [description, setDescription] = useState(channel?.description || '');
  const [banner, setBanner] = useState<any>(null);
  const [avatar, setAvatar] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async (type: 'banner' | 'avatar') => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your media library to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: type === 'banner' ? [16, 9] : [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        if (type === 'banner') {
          setBanner({ uri: asset.uri, name: 'banner.jpg', type: 'image/jpeg' });
        } else {
          setAvatar({ uri: asset.uri, name: 'avatar.jpg', type: 'image/jpeg' });
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'An error occurred while picking the image.');
    }
  };

  const handleUpdateChannel = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please provide a channel name.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      
      if (banner) {
        formData.append('banner', {
          uri: banner.uri,
          name: 'banner.jpg',
          type: 'image/jpeg',
        } as any);
      }
      if (avatar) {
        formData.append('avatar', {
          uri: avatar.uri,
          name: 'avatar.jpg',
          type: 'image/jpeg',
        } as any);
      }

      await channelService.updateChannel(channel._id, formData);
      
      Alert.alert('Success', 'Your channel has been updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error('Channel update error:', error);
      Alert.alert('Failed', error.response?.data?.message || 'Could not update channel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper withKeyboardAvoidView>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Channel</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Update Your Identity</Text>
        
        {/* Banner Upload */}
        <TouchableOpacity 
          style={styles.bannerUpload} 
          activeOpacity={0.8} 
          onPress={() => pickImage('banner')}
        >
          {banner ? (
            <Image source={{ uri: banner.uri }} style={styles.uploadedBanner} />
          ) : channel.banner ? (
            <Image source={{ uri: channel.banner }} style={styles.uploadedBanner} />
          ) : (
            <>
              <Ionicons name="image-outline" size={32} color={colors.dark.textSecondary} />
              <Text style={styles.uploadText}>Change Banner</Text>
            </>
          )}
          <View style={styles.editIconOverlay}>
            <Ionicons name="camera" size={20} color="white" />
          </View>
        </TouchableOpacity>

        {/* Profile Avatar Upload */}
        <View style={styles.avatarWrapper}>
          <TouchableOpacity 
            style={styles.avatarUpload} 
            activeOpacity={0.8} 
            onPress={() => pickImage('avatar')}
          >
            {avatar ? (
              <Image source={{ uri: avatar.uri }} style={styles.uploadedAvatar} />
            ) : channel.avatar ? (
              <Image source={{ uri: channel.avatar }} style={styles.uploadedAvatar} />
            ) : (
              <Ionicons name="camera-outline" size={28} color={colors.dark.textSecondary} />
            )}
            <View style={styles.avatarEditOverlay}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <InputField
            label="Channel Name"
            placeholder="e.g. My Awesome Channel"
            value={name}
            onChangeText={setName}
            maxLength={50}
          />
          
          <InputField
            label="Description"
            placeholder="Tell viewers about your channel"
            multiline
            numberOfLines={4}
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
          />

          <Button
            title="Save Changes"
            onPress={handleUpdateChannel}
            isLoading={isLoading}
            style={styles.saveBtn}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  backBtn: {
    marginRight: layout.spacing.md,
    padding: 4,
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
  },
  content: {
    paddingBottom: layout.spacing.xl,
  },
  subtitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    margin: layout.spacing.md,
  },
  bannerUpload: {
    width: '100%',
    height: 140,
    backgroundColor: colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadedBanner: {
    width: '100%',
    height: '100%',
  },
  editIconOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  uploadText: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    marginTop: 4,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginTop: -40,
    marginBottom: layout.spacing.xl,
  },
  avatarUpload: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.dark.surface,
    borderWidth: 4,
    borderColor: colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadedAvatar: {
    width: '100%',
    height: '100%',
  },
  avatarEditOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '30%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    paddingHorizontal: layout.spacing.md,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveBtn: {
    width: '100%',
    marginTop: layout.spacing.lg,
  },
});
