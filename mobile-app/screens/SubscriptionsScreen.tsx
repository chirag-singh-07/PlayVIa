import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header } from '../components/Header';
import { VideoCard } from '../components/VideoCard';
import { Avatar } from '../components/Avatar';
import { MOCK_DATA, layout } from '../constants';
import { colors, typography } from '../theme';
import { ScreenWrapper } from '../components/ScreenWrapper';

import { subscriptionService } from '../services/subscriptionService';
import { formatViews, formatTimeAgo, formatDuration } from '../utils/videoUtils';

export const SubscriptionsScreen: React.FC<any> = ({ navigation }) => {
  const [channels, setChannels] = React.useState<any[]>([]);
  const [videos, setVideos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [subscribedChannels, subscriptionVideos] = await Promise.all([
          subscriptionService.getSubscribedChannels(),
          subscriptionService.getSubscriptionVideos()
        ]);
        setChannels(subscribedChannels);
        setVideos(subscriptionVideos);
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      <Header />

      {/* Horizontal Subscriptions List */}
      <View style={styles.channelsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.channelsScroll}>
          {channels.map((channel) => (
            <TouchableOpacity key={channel._id} style={styles.channelItem} onPress={() => navigation.navigate('ChannelProfile', { channelId: channel._id })}>
              <Avatar uri={channel.avatar} size={56} />
              <Text style={styles.channelName} numberOfLines={1}>{channel.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.channelItem}>
            <View style={[styles.allChannelsBtn, { width: 56, height: 56, borderRadius: 28 }]}>
              <Text style={styles.allChannelsText}>All</Text>
            </View>
            <Text style={styles.channelName}>View All</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Subscription Videos Feed */}
      <FlatList
        data={videos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnailUrl}
            channelName={item.channel?.name || 'Unknown'}
            channelAvatar={item.channel?.avatar || ''}
            views={formatViews(item.views || 0)}
            createdAt={formatTimeAgo(item.createdAt)}
            duration={formatDuration(item.duration)}
            onPress={() => navigation.navigate('VideoPlayer', { video: item })}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: colors.dark.textSecondary }}>No subscription updates</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  channelsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
    paddingVertical: layout.spacing.md,
  },
  channelsScroll: {
    paddingHorizontal: layout.spacing.md,
  },
  channelItem: {
    alignItems: 'center',
    marginRight: layout.spacing.md,
    width: 70,
  },
  channelName: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
    marginTop: 6,
    textAlign: 'center',
  },
  allChannelsBtn: {
    backgroundColor: colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allChannelsText: {
    color: colors.dark.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium as '500',
  },
  listContent: {
    paddingTop: layout.spacing.md,
    paddingBottom: 20,
  },
});
