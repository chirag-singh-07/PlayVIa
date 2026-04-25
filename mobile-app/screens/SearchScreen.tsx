import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../components/SearchBar';
import { VideoCard } from '../components/VideoCard';
import { MOCK_DATA, layout } from '../constants';
import { colors, typography } from '../theme';
import { ScreenWrapper } from '../components/ScreenWrapper';

export const SearchScreen: React.FC<any> = ({ navigation }) => {
  const [hasSearched, setHasSearched] = useState(false);

  const recentSearches = ['react native tutorial', 'expo router setup', 'glassmorphism ui'];

  const handleSearch = (query: string) => {
    setHasSearched(true);
    // In a real app, you would fetch search results here
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
      ) : (
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
