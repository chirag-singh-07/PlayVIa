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

export const ChannelDashboardScreen: React.FC<any> = ({ navigation }) => {
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
          <Text style={styles.largeValue}>1,234</Text>
          <Text style={styles.statChange}>+24 in last 28 days</Text>

          <View style={styles.divider} />
          
          <Text style={styles.sectionSubtitle}>Summary (Last 28 days)</Text>
          <View style={styles.statsRow}>
            <StatsCard title="Views" value="15.2K" icon="eye-outline" />
            <StatsCard title="Watch time" value="124.5" icon="time-outline" />
            <StatsCard title="Videos" value="45" icon="videocam-outline" />
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

        {/* Latest Content */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Latest Video Performance</Text>
        </View>
        
        {MOCK_DATA.videos.slice(0, 1).map((item) => (
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

        <Button
          title="Go to Your Videos"
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
});
