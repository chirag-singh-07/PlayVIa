import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Avatar } from '../components/Avatar';
import { VideoCard } from '../components/VideoCard';
import { layout } from '../constants';
import { colors, typography } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useAuth } from '../context/AuthContext';
import { channelService } from '../services/channelService';
import { formatViews, formatTimeAgo, formatDuration } from '../utils/videoUtils';

export const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const { user: profile, logout } = useAuth();
  const [myVideos, setMyVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (profile?.channel) {
          const videos = await channelService.getChannelVideos(profile.channel._id);
          setMyVideos(videos);
        }
      } catch (error) {
        console.error('Error fetching channel videos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [profile]);

  const handleLogout = async () => {
    await logout();
    // AuthProvider will automatically switch to AuthNavigator
  };

  if (loading) return (
    <ScreenWrapper>
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.dark.primary} />
      </View>
    </ScreenWrapper>
  );
  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color={colors.dark.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Avatar uri={profile?.avatar} size={80} />
          <View style={styles.userDetails}>
            <Text style={styles.username}>{profile?.name || profile?.username || 'Guest'}</Text>
            <Text style={styles.userHandle}>@{profile?.username || 'guest'}</Text>
            <Text style={styles.userStats}>
              {formatViews(profile?.channel?.subscribersCount || 0)} Subscribers • {myVideos.length} Videos
            </Text>
          </View>
        </View>

        {/* Manage Channel Button */}
        <View style={styles.manageContainer}>
          {profile?.channel ? (
            <>
              <TouchableOpacity 
                style={styles.manageBtn}
                onPress={() => navigation.navigate('ChannelDashboard')}
              >
                <Text style={styles.manageBtnText}>Manage Videos</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.manageBtn}
                onPress={() => navigation.navigate('ChannelDashboard')}
              >
                <Ionicons name="analytics-outline" size={18} color={colors.dark.text} />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.manageBtn}
              onPress={() => navigation.navigate('ChannelCreate')}
            >
              <Text style={styles.manageBtnText}>Create Your Channel</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Library Actions */}
        <View style={styles.manageContainer}>
           <TouchableOpacity 
            style={[styles.manageBtn, { backgroundColor: colors.dark.background, borderWidth: 1, borderColor: colors.dark.border }]}
            onPress={() => navigation.navigate('Library')}
          >
            <Text style={styles.manageBtnText}>Go to Library</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.manageBtn, { backgroundColor: colors.dark.background, borderWidth: 1, borderColor: colors.dark.border }]}
            onPress={handleLogout}
          >
            <Text style={[styles.manageBtnText, { color: colors.dark.primary }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Uploaded Videos Section */}
        {myVideos.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Videos</Text>
            </View>

            {myVideos.map((item) => (
              <VideoCard
                key={item._id}
                title={item.title}
                thumbnail={item.thumbnailUrl}
                channelName={profile?.channel?.name || 'Your Channel'}
                channelAvatar={profile?.avatar || ''}
                views={formatViews(item.views || 0)}
                createdAt={formatTimeAgo(item.createdAt)}
                duration={formatDuration(item.duration)}
                onPress={() => navigation.navigate('VideoPlayer', { video: item })}
              />
            ))}
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.md,
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as '700',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.lg,
  },
  userDetails: {
    marginLeft: layout.spacing.md,
  },
  username: {
    color: colors.dark.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as '700',
    marginBottom: 4,
  },
  userHandle: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    marginBottom: 4,
  },
  userStats: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
  },
  manageContainer: {
    flexDirection: 'row',
    paddingHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.xl,
  },
  manageBtn: {
    backgroundColor: colors.dark.surface,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: layout.borderRadius.full,
    marginRight: layout.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manageBtnText: {
    color: colors.dark.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium as '500',
  },
  sectionHeader: {
    paddingHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.md,
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
  },
});
