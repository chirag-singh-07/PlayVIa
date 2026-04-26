import React, { useState } from 'react';
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

export const ChannelCreateScreen: React.FC<any> = ({ navigation }) => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.username || '');
  const [description, setDescription] = useState('');
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

  const handleCreateChannel = async () => {
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
        formData.append('banner', banner as any);
      }
      if (avatar) {
        formData.append('avatar', avatar as any);
      }

      await channelService.createChannel(formData);
      
      Alert.alert('Success', 'Your channel has been created successfully!', [
        { text: 'Awesome', onPress: () => navigation.replace('MainTabs', { screen: 'Upload' }) }
      ]);
    } catch (error: any) {
      console.error('Channel creation error:', error);
      Alert.alert('Failed', error.response?.data?.message || 'Could not create channel. Please try again.');
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
        <Text style={styles.headerTitle}>Create Channel</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Channel Identity</Text>
        
        {/* Banner Upload */}
        <TouchableOpacity 
          style={styles.bannerUpload} 
          activeOpacity={0.8} 
          onPress={() => pickImage('banner')}
        >
          {banner ? (
            <Image source={{ uri: banner.uri }} style={styles.uploadedBanner} />
          ) : (
            <>
              <Ionicons name="image-outline" size={32} color={colors.dark.textSecondary} />
              <Text style={styles.uploadText}>Upload Banner</Text>
            </>
          )}
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
            ) : (
              <Ionicons name="camera-outline" size={28} color={colors.dark.textSecondary} />
            )}
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

          <Text style={styles.disclaimer}>
            By tapping Create Channel you agree to VidPlay's Terms of Service and Community Guidelines.
          </Text>

          <Button
            title="Create Channel"
            onPress={handleCreateChannel}
            isLoading={isLoading}
            style={styles.createBtn}
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
  formContainer: {
    paddingHorizontal: layout.spacing.md,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  disclaimer: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
    textAlign: 'center',
    marginTop: layout.spacing.md,
    marginBottom: layout.spacing.lg,
    lineHeight: 18,
  },
  createBtn: {
    width: '100%',
  },
});
