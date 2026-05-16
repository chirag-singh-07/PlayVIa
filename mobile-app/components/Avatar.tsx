import React from 'react';
import { Image, StyleSheet, ViewStyle } from 'react-native';

interface AvatarProps {
  uri: string;
  size?: number;
  style?: ViewStyle;
}

const DEFAULT_AVATAR = 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';

export const Avatar: React.FC<AvatarProps> = ({ uri, size = 40, style }) => {
  const [error, setError] = React.useState(false);
  
  const isValidUri = uri && 
                     typeof uri === 'string' && 
                     uri.trim() !== '' && 
                     !uri.includes('undefined') && 
                     !uri.includes('null') &&
                     (uri.startsWith('http') || uri.startsWith('file') || uri.startsWith('data'));

  const sourceUri = isValidUri && !error ? uri : DEFAULT_AVATAR;
  
  return (
    <Image
      source={{ uri: sourceUri }}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
      resizeMode="cover"
      onError={() => {
        if (!error) setError(true);
      }}
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#E5E5E5',
  },
});
