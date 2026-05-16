import React from 'react';
import { Image, StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({ uri, name, size = 40, style }) => {
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setError(false);
  }, [uri]);
  
  const getInitials = (text?: string) => {
    if (!text) return '?';
    const parts = text.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return text.substring(0, Math.min(text.length, 2)).toUpperCase();
  };

  const getRandomColor = (text?: string) => {
    if (!text) return '#757575';
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', 
      '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', 
      '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722'
    ];
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const isValidUri = uri && 
                     typeof uri === 'string' && 
                     uri.trim() !== '' && 
                     !uri.includes('undefined') && 
                     !uri.includes('null') &&
                     (uri.startsWith('http') || uri.startsWith('file') || uri.startsWith('data'));

  if (!isValidUri || error) {
    const initials = getInitials(name || 'User');
    const backgroundColor = getRandomColor(name || 'User');
    
    return (
      <View style={[
        styles.letterAvatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor },
        style
      ]}>
        <Text style={[styles.letterText, { fontSize: size * 0.4 }]}>{initials}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
      resizeMode="cover"
      onError={() => setError(true)}
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#E5E5E5',
  },
  letterAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
