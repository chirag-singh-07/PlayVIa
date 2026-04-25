import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeProvider';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface GoogleSignInButtonProps {
  onPress: () => void;
  isLoading?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onPress, isLoading }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { 
          backgroundColor: isDark ? '#FFFFFF' : '#FFFFFF',
          borderColor: isDark ? '#FFFFFF' : '#E0E0E0'
        }
      ]} 
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color="#000" />
      ) : (
        <>
          <Ionicons name="logo-google" size={24} color="#DB4437" style={styles.icon} />
          <Text style={styles.text}>Continue with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    height: spacing.buttonHeight,
    borderRadius: spacing.borderRadiusButtons,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: spacing.md,
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    color: '#0F0F0F', // Always dark for google button
    fontSize: 16,
    fontWeight: '600',
  },
});
