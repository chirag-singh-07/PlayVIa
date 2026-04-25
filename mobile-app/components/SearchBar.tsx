import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import { layout } from '../constants';

interface SearchBarProps {
  onSearch?: (text: string) => void;
  onBack?: () => void;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onBack, autoFocus }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (onSearch && query.trim()) {
      onSearch(query);
    }
  };

  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.dark.text} />
        </TouchableOpacity>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor={colors.dark.textSecondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoFocus={autoFocus}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <Ionicons name="close" size={20} color={colors.dark.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
        <Ionicons name="search" size={20} color={colors.dark.text} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.micBtn}>
        <Ionicons name="mic" size={20} color={colors.dark.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.spacing.md,
    paddingVertical: layout.spacing.sm,
    backgroundColor: colors.dark.background,
  },
  backBtn: {
    marginRight: layout.spacing.md,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.surface,
    borderRadius: layout.borderRadius.full,
    paddingLeft: layout.spacing.md,
    height: 40,
  },
  input: {
    flex: 1,
    color: colors.dark.text,
    fontSize: typography.sizes.md,
  },
  clearBtn: {
    padding: layout.spacing.sm,
  },
  searchBtn: {
    backgroundColor: colors.dark.surface,
    borderTopRightRadius: layout.borderRadius.full,
    borderBottomRightRadius: layout.borderRadius.full,
    paddingHorizontal: layout.spacing.md,
    height: 40,
    justifyContent: 'center',
    marginLeft: 1, // slight separation
  },
  micBtn: {
    backgroundColor: colors.dark.surface,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: layout.spacing.md,
  },
});
