import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoCard } from '../components/VideoCard';
import { MOCK_DATA, layout } from '../constants';
import { colors, typography } from '../theme';
import { ScreenWrapper } from '../components/ScreenWrapper';

export const LibraryScreen: React.FC<any> = ({ navigation }) => {
  const MenuItem = ({ icon, title, subtitle, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color={colors.dark.text} style={styles.menuIcon} />
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Library</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={24} color={colors.dark.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Recent Watch History Preview */}
        <View style={styles.sectionHeader}>
          <Ionicons name="time-outline" size={20} color={colors.dark.text} />
          <Text style={styles.sectionTitle}>History</Text>
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroll}>
          {MOCK_DATA.videos.map((item) => (
            <View key={item.id} style={{ width: 160, marginRight: layout.spacing.md }}>
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
            </View>
          ))}
        </ScrollView>

        <View style={styles.divider} />

        {/* Library Options */}
        <MenuItem 
          icon="play-circle-outline" 
          title="Your Videos" 
          onPress={() => navigation.navigate('YourVideos')} 
        />
        <MenuItem 
          icon="download-outline" 
          title="Downloads" 
          subtitle="20 videos" 
          onPress={() => navigation.navigate('DownloadManager')} 
        />
        <MenuItem 
          icon="bookmark-outline" 
          title="Saved Videos" 
        />
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
    paddingVertical: layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  headerTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as '700',
  },
  headerActions: {
    flexDirection: 'row',
  },
  content: {
    paddingVertical: layout.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.md,
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as '700',
    marginLeft: layout.spacing.sm,
    flex: 1,
  },
  viewAllBtn: {},
  viewAllText: {
    color: colors.dark.primary, // Using primary color (e.g. red/blue) for link
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium as '500',
  },
  historyScroll: {
    paddingLeft: layout.spacing.md,
    marginBottom: layout.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: layout.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.lg,
  },
  menuIcon: {
    marginRight: layout.spacing.lg,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
  },
  menuSubtitle: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.sm,
    marginTop: 2,
  },
});
