import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../components/SearchBar';
import { VideoCard } from '../components/VideoCard';
import { layout } from '../constants';
import { colors, typography } from '../theme';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { videoService } from '../services/videoService';
import { formatViews, formatTimeAgo, formatDuration } from '../utils/videoUtils';

export const SearchScreen: React.FC<any> = ({ navigation }) => {
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const recentSearches = ['react native tutorial', 'expo router setup', 'glassmorphism ui'];

  const handleSearch = async (query: string) => {
    setHasSearched(true);
    setLoading(true);
    try {
      const data = await videoService.searchVideos(query);
      setSearchResults(data.videos || []);
    } catch (error) {
      console.error('Error searching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <SearchBar 
          onBack={() => navigation.goBack()} 
          onSearch={handleSearch}
          autoFocus={true}
        />
        <TouchableOpacity style={styles.filterBtn} onPress={() => navigation.navigate('SearchResultsFilter')}>
          <Ionicons name="options-outline" size={24} color={colors.dark.text} />
        </TouchableOpacity>
      </View>

      {!hasSearched ? (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent</Text>
          {recentSearches.map((term, index) => (
            <TouchableOpacity key={index} style={styles.recentItem} onPress={() => handleSearch(term)}>
              <Ionicons name="time-outline" size={20} color={colors.dark.textSecondary} style={styles.recentIcon} />
              <Text style={styles.recentText}>{term}</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.dark.textSecondary} style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}
        </View>
      ) : loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.dark.primary} />
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <VideoCard
              title={item.title}
              thumbnail={item.thumbnailUrl}
              channelName={item.channel?.name || 'Unknown Channel'}
              channelAvatar={item.channel?.avatar || ''}
              views={formatViews(item.views || 0)}
              createdAt={formatTimeAgo(item.createdAt)}
              duration={formatDuration(item.duration)}
              onPress={() => navigation.navigate('VideoPlayer', { video: item })}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: colors.dark.textSecondary }}>No results found</Text>
            </View>
          }
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  filterBtn: {
    padding: layout.spacing.sm,
    marginRight: layout.spacing.sm,
  },
  recentSection: {
    padding: layout.spacing.md,
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as '700',
    marginBottom: layout.spacing.md,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: layout.spacing.md,
  },
  recentIcon: {
    marginRight: layout.spacing.md,
  },
  recentText: {
    flex: 1,
    color: colors.dark.text,
    fontSize: typography.sizes.md,
  },
  arrowIcon: {
    marginLeft: layout.spacing.sm,
  },
});
