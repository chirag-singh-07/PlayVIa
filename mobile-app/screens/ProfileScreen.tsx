import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, RefreshControl, Alert } from 'react-native';
import { Avatar } from '../components/Avatar';
import { layout } from '../constants';
import { colors, typography } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { channelService } from '../services/channelService';
import { videoService } from '../services/videoService';
import { formatViews } from '../utils/videoUtils';

export const ProfileScreen: React.FC<any> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [myChannel, setMyChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfileData = async () => {
    try {
      const channel = await channelService.getMyChannel();
      setMyChannel(channel);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileData();
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => await logout() }
    ]);
  };

  if (loading && !refreshing) return (
    <ScreenWrapper>
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.dark.primary} />
      </View>
    </ScreenWrapper>
  );

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>You</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color={colors.dark.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.dark.primary} />}
      >
        {/* User Identity Section */}
        <View style={styles.userSection}>
          <Avatar 
            uri={myChannel?.avatar || user?.avatar} 
            name={myChannel?.name || user?.name || user?.username} 
            size={70} 
          />
          <View style={styles.userText}>
            <Text style={styles.nameText}>{myChannel?.name || user?.name || user?.username}</Text>
            <Text style={styles.handleText}>@{user?.username} • View channel</Text>
          </View>
          <TouchableOpacity 
            style={styles.switchAccountBtn}
            onPress={() => navigation.navigate('ChannelProfile', { channelId: myChannel?._id })}
            disabled={!myChannel}
          >
            <Ionicons name="chevron-forward" size={20} color={colors.dark.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions (Switch, Google Account) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActions}>
          <TouchableOpacity style={styles.actionPill}>
            <Ionicons name="people-outline" size={18} color={colors.dark.text} />
            <Text style={styles.actionPillText}>Switch account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionPill}>
            <Ionicons name="logo-google" size={18} color={colors.dark.text} />
            <Text style={styles.actionPillText}>Google Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionPill}>
            <Ionicons name="person-add-outline" size={18} color={colors.dark.text} />
            <Text style={styles.actionPillText}>Turn on Incognito</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.divider} />

        {/* Menu Options Section */}
        <View style={styles.menuSection}>
          <MenuOption 
            icon="play-circle-outline" 
            title="Your videos" 
            onPress={() => navigation.navigate('YourVideos')} 
          />
          <MenuOption 
            icon="download-outline" 
            title="Downloads" 
            subtitle="View your saved videos" 
            onPress={() => navigation.navigate('DownloadManager')} 
          />
          <MenuOption 
            icon="time-outline" 
            title="Watch History" 
            onPress={() => navigation.navigate('Library')} 
          />
          
          <View style={styles.sectionDivider} />
          
          <MenuOption 
            icon="cash-outline" 
            title="Earnings & Payouts" 
            onPress={() => navigation.navigate('Withdrawal')} 
          />
          <MenuOption 
            icon="shield-checkmark-outline" 
            title="Your data in PlayVia" 
            onPress={() => {}} 
          />
          
          <View style={styles.sectionDivider} />

          {/* Special Channel Action */}
          {!myChannel ? (
            <MenuOption 
              icon="add-circle-outline" 
              title="Create a channel" 
              titleStyle={{ color: colors.dark.primary }}
              onPress={() => navigation.navigate('CreateChannel')} 
            />
          ) : (
            <MenuOption 
              icon="analytics-outline" 
              title="Creator Studio" 
              onPress={() => navigation.navigate('ChannelDashboard')} 
            />
          )}

          <MenuOption 
            icon="help-circle-outline" 
            title="Help and feedback" 
            onPress={() => {}} 
          />
          
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={colors.dark.primary} />
            <Text style={styles.logoutText}>Sign out</Text>
          </TouchableOpacity>
        </View>

        {/* Branding Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>VidPlay v1.0.0</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const MenuOption = ({ icon, title, subtitle, onPress, titleStyle }: any) => (
  <TouchableOpacity style={styles.optionItem} onPress={onPress}>
    <View style={styles.optionLeft}>
      <Ionicons name={icon} size={24} color={colors.dark.text} />
      <View style={styles.optionTextContainer}>
        <Text style={[styles.optionTitle, titleStyle]}>{title}</Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Ionicons name="chevron-forward" size={18} color={colors.dark.border} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconBtn: {
    padding: 8,
    marginLeft: 8,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: layout.spacing.md,
    marginTop: 10,
  },
  userText: {
    flex: 1,
    marginLeft: 15,
  },
  nameText: {
    color: colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  handleText: {
    color: colors.dark.textSecondary,
    fontSize: 14,
  },
  switchAccountBtn: {
    padding: 8,
  },
  quickActions: {
    paddingHorizontal: layout.spacing.md,
    paddingBottom: layout.spacing.lg,
    gap: 10,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  actionPillText: {
    color: colors.dark.text,
    fontSize: 13,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginHorizontal: layout.spacing.md,
  },
  menuSection: {
    paddingTop: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: 14,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionTextContainer: {
    marginLeft: 16,
  },
  optionTitle: {
    color: colors.dark.text,
    fontSize: 16,
  },
  optionSubtitle: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: 4,
    marginHorizontal: layout.spacing.md,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: 20,
    marginTop: 10,
    gap: 16,
  },
  logoutText: {
    color: colors.dark.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 40,
    alignItems: 'center',
  },
  footerText: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
});
