import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar } from '../components/Avatar';
import { VideoCard } from '../components/VideoCard';
import { MOCK_DATA, layout } from '../constants';
import { colors, typography } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';

export const ProfileScreen: React.FC<any> = ({ navigation }) => {
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
          <Avatar uri="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" size={80} />
          <View style={styles.userDetails}>
            <Text style={styles.username}>John Doe</Text>
            <Text style={styles.userHandle}>@johndoe</Text>
            <Text style={styles.userStats}>1.2K Subscribers • 45 Videos</Text>
          </View>
        </View>

        {/* Manage Channel Button */}
        <View style={styles.manageContainer}>
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
        </View>

        {/* Library Actions */}
        <View style={styles.manageContainer}>
           <TouchableOpacity 
            style={[styles.manageBtn, { backgroundColor: colors.dark.background, borderWidth: 1, borderColor: colors.dark.border, marginTop: -10 }]}
            onPress={() => navigation.navigate('Library')}
          >
            <Text style={styles.manageBtnText}>Go to Library</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.manageBtn, { backgroundColor: colors.dark.background, borderWidth: 1, borderColor: colors.dark.border, marginTop: -10 }]}
            onPress={() => navigation.navigate('ChannelCreate')}
          >
            <Text style={styles.manageBtnText}>Create Channel</Text>
          </TouchableOpacity>
        </View>

        {/* Uploaded Videos Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Uploaded Videos</Text>
        </View>

        {MOCK_DATA.videos.map((item) => (
          <VideoCard
            key={item.id}
            title={item.title}
            thumbnail={item.thumbnail}
            channelName={item.channelName}
            channelAvatar={item.channelAvatar}
            views={item.views}
            createdAt={item.createdAt}
            duration={item.duration}
            onPress={() => navigation.navigate('VideoPlayer', { video: item })}
          />
        ))}
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
