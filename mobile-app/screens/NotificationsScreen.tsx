import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationItem } from '../components/NotificationItem';
import { colors, typography } from '../theme';
import { layout } from '../constants';
import { ScreenWrapper } from '../components/ScreenWrapper';

import { notificationService } from '../services/notificationService';
import { ActivityIndicator } from 'react-native';

export const NotificationsScreen: React.FC<any> = ({ navigation }) => {
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) return (
    <ScreenWrapper>
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.dark.primary} />
       </View>
    </ScreenWrapper>
  );

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
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => {
          const getIcon = (type: string) => {
            switch(type) {
              case 'video': return 'videocam-outline';
              case 'like': return 'heart-outline';
              case 'subscriber': return 'person-add-outline';
              case 'milestone': return 'trophy-outline';
              case 'comment': return 'chatbubble-outline';
              default: return 'notifications-outline';
            }
          };

          const getIconColor = (type: string) => {
            switch(type) {
              case 'milestone': return '#FFD700';
              case 'like': return '#FF4081';
              case 'subscriber': return '#00E676';
              default: return colors.dark.text;
            }
          };

          return (
            <NotificationItem
              type={item.type}
              message={item.message}
              timestamp={new Date(item.createdAt).toLocaleDateString()}
              avatarUri={item.sender?.avatar || item.relatedVideo?.thumbnailUrl}
              isRead={item.isRead}
              icon={getIcon(item.type)}
              iconColor={getIconColor(item.type)}
              onPress={() => {
                if (item.relatedVideo) {
                  navigation.navigate('VideoPlayer', { video: item.relatedVideo });
                }
              }}
            />
          );
        }}
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
