import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatsCard } from '../components/StatsCard';
import { DashboardCard } from '../components/DashboardCard';
import { Button } from '../components/Button';
import { VideoCard } from '../components/VideoCard';
import { colors, typography } from '../theme';
import { layout, MOCK_DATA } from '../constants';
import { ScreenWrapper } from '../components/ScreenWrapper';

import { useAuth } from '../context/AuthContext';
import { channelService } from '../services/channelService';
import { earningsService } from '../services/earningsService';
import { ActivityIndicator } from 'react-native';
import { formatViews } from '../utils/videoUtils';

export const ChannelDashboardScreen: React.FC<any> = ({ navigation }) => {
  const { user } = useAuth();
  const [videos, setVideos] = React.useState<any[]>([]);
  const [earnings, setEarnings] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user?.channel) {
          const [channelVideos, channelEarnings] = await Promise.all([
            channelService.getChannelVideos(user.channel._id),
            earningsService.getChannelEarnings(user.channel._id)
          ]);
          setVideos(channelVideos);
          setEarnings(channelEarnings);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

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
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Analytics Summary */}
        <DashboardCard style={styles.section}>
          <Text style={styles.sectionTitle}>Channel Analytics</Text>
          <Text style={styles.sectionSubtitle}>Current subscribers</Text>
          <Text style={styles.largeValue}>{formatViews(user?.channel?.subscribersCount || 0)}</Text>
          <Text style={styles.statChange}>Overall performance</Text>

          <View style={styles.divider} />
          
          <Text style={styles.sectionSubtitle}>Summary</Text>
          <View style={styles.statsRow}>
            <StatsCard title="Views" value={formatViews(user?.channel?.totalViews || 0)} icon="eye-outline" />
            <StatsCard title="Videos" value={videos.length.toString()} icon="videocam-outline" />
            <StatsCard title="Subscribers" value={formatViews(user?.channel?.subscribersCount || 0)} icon="people-outline" />
          </View>
        </DashboardCard>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <Button
            title="Upload Video"
            onPress={() => navigation.navigate('Upload')}
            style={styles.actionBtn}
          />
          <Button
            title="Edit Channel"
            variant="secondary"
            onPress={() => navigation.navigate('ChannelProfile')}
            style={styles.actionBtn}
          />
        </View>

        {/* Monetization Section */}
        <DashboardCard style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Monetization Status</Text>
            <Ionicons 
              name={earnings?.eligible ? "checkmark-circle" : "alert-circle"} 
              size={24} 
              color={earnings?.eligible ? "#4CAF50" : colors.dark.textSecondary} 
            />
          </View>
          {earnings?.eligible ? (
            <View>
              <Text style={styles.largeValue}>₹{earnings.earnings}</Text>
              <Text style={styles.sectionSubtitle}>Total Estimated Earnings</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.sectionSubtitle}>{earnings?.message}</Text>
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${Math.min(100, (user?.channel?.subscribersCount || 0) / 20)}%` }]} />
              </View>
              <Text style={styles.progressText}>{user?.channel?.subscribersCount || 0} / 2000 subscribers</Text>
            </View>
          )}
        </DashboardCard>

        {/* Latest Content */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Content</Text>
        </View>
        
        {videos.slice(0, 5).map((item) => (
          <VideoCard
            key={item._id}
            title={item.title}
            thumbnail={item.thumbnailUrl}
            channelName={user?.channel?.name || 'Your Channel'}
            channelAvatar={user?.avatar || ''}
            views={formatViews(item.views || 0)}
            createdAt={item.createdAt} // Should be formatted but for now okay
            duration={item.duration}
            onPress={() => navigation.navigate('VideoPlayer', { video: item })}
          />
        ))}

        <Button
          title="See All Videos"
          variant="outline"
          onPress={() => navigation.navigate('YourVideos')}
          style={styles.allVideosBtn}
        />
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
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
  },
  content: {
    padding: layout.spacing.md,
    paddingBottom: layout.spacing.xl,
  },
  section: {
    marginBottom: layout.spacing.lg,
  },
  sectionHeader: {
    marginBottom: layout.spacing.md,
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    marginBottom: 8,
  },
  largeValue: {
    color: colors.dark.text,
    fontSize: 32,
    fontWeight: typography.weights.bold as '700',
  },
  statChange: {
    color: '#4CAF50', // green for positive change
    fontSize: typography.sizes.sm,
    marginBottom: layout.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: layout.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: layout.spacing.lg,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: layout.spacing.xs,
  },
  allVideosBtn: {
    marginTop: layout.spacing.md,
  },
  progressContainer: {
    height: 8,
    backgroundColor: colors.dark.border,
    borderRadius: 4,
    marginVertical: layout.spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.dark.primary,
  },
  progressText: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
  },
});
