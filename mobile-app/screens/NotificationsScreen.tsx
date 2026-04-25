import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationItem } from '../components/NotificationItem';
import { colors, typography } from '../theme';
import { layout } from '../constants';
import { ScreenWrapper } from '../components/ScreenWrapper';

export const NotificationsScreen: React.FC<any> = ({ navigation }) => {
  const notifications = [
    {
      id: '1',
      type: 'video' as const,
      message: 'Design Pro uploaded: 10 UX Rules You Need To Know',
      timestamp: '2 hours ago',
      avatarUri: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&auto=format&fit=crop',
      isRead: false,
    },
    {
      id: '2',
      type: 'like' as const,
      message: 'Tech Talk liked your comment: "Great explanation!"',
      timestamp: '5 hours ago',
      avatarUri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
      isRead: true,
    },
    {
      id: '3',
      type: 'comment' as const,
      message: 'Frontend Mastery replied to your comment',
      timestamp: '1 day ago',
      avatarUri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
      isRead: true,
    },
  ];

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color={colors.dark.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            type={item.type}
            message={item.message}
            timestamp={item.timestamp}
            avatarUri={item.avatarUri}
            isRead={item.isRead}
            onPress={() => {
              if (item.type === 'video') {
                navigation.navigate('VideoPlayer');
              }
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: layout.spacing.md,
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
  },
});
