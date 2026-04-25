import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Header } from '../components/Header';
import { VideoCard } from '../components/VideoCard';
import { Avatar } from '../components/Avatar';
import { MOCK_DATA, layout } from '../constants';
import { colors, typography } from '../theme';
import { ScreenWrapper } from '../components/ScreenWrapper';

export const SubscriptionsScreen: React.FC<any> = ({ navigation }) => {
  // Mock subscriptions channels
  const channels = MOCK_DATA.videos.map(v => ({
    id: v.id,
    name: v.channelName,
    avatar: v.channelAvatar,
  }));

  return (
    <ScreenWrapper>
      <Header />

      {/* Horizontal Subscriptions List */}
      <View style={styles.channelsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.channelsScroll}>
          {channels.map((channel) => (
            <View key={channel.id} style={styles.channelItem}>
              <Avatar uri={channel.avatar} size={56} />
              <Text style={styles.channelName} numberOfLines={1}>{channel.name}</Text>
            </View>
          ))}
          <View style={styles.channelItem}>
            <View style={[styles.allChannelsBtn, { width: 56, height: 56, borderRadius: 28 }]}>
              <Text style={styles.allChannelsText}>All</Text>
            </View>
            <Text style={styles.channelName}>View All</Text>
          </View>
        </ScrollView>
      </View>

      {/* Subscription Videos Feed */}
      <FlatList
        data={MOCK_DATA.videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            channelName={item.channelName}
            channelAvatar={item.channelAvatar}
            views={item.views}
            createdAt={item.createdAt}
            duration={item.duration}
            onPress={() => navigation.navigate('VideoPlayer', { video: item })}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
