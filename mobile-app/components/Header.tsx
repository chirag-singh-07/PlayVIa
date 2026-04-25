import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from './IconButton';
import { Avatar } from './Avatar';
import { colors, typography } from '../theme';

export const Header: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Logo Area */}
      <View style={styles.logoContainer}>
        <Ionicons name="logo-youtube" size={28} color={colors.dark.primary} />
        <Text style={styles.logoText}>VidPlay</Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <IconButton icon="cast-outline" />
        <IconButton icon="notifications-outline" onPress={() => navigation.navigate('Notifications')} />
        <IconButton icon="search-outline" onPress={() => navigation.navigate('Search')} />
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Avatar uri="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" size={30} style={styles.avatar} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Need to import Ionicons for the logo
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.dark.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: colors.dark.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as '700',
    marginLeft: 4,
    letterSpacing: -0.5,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginLeft: 8,
  },
});
