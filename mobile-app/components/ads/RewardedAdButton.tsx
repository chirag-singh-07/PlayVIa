/**
 * RewardedAdButton.tsx
 * A reusable Button that shows a Rewarded Ad when tapped.
 *
 * USAGE:
 *   <RewardedAdButton
 *     label="Watch Ad to Unlock 1080p"
 *     onRewarded={() => setQuality('1080p')}
 *     onNotAvailable={() => Alert.alert('No ad available')}
 *   />
 *
 * PLACEMENTS:
 *   - VideoPlayerScreen → Unlock HD Quality
 *   - ProfileScreen     → Unlock a premium feature badge
 *   - UploadScreen      → Boost video reach for 24h
 */

import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { rewardedAdService } from '../../services/ads/rewardedAdService';
import { colors } from '../../theme';

interface RewardedAdButtonProps {
  label?: string;
  onRewarded: () => void;
  onNotAvailable?: () => void;
  style?: object;
}

export const RewardedAdButton: React.FC<RewardedAdButtonProps> = ({
  label = 'Watch Ad for Reward',
  onRewarded,
  onNotAvailable,
  style,
}) => {
  const [adReady, setAdReady] = useState(false);

  // Poll readiness every 2 seconds (lightweight check)
  useEffect(() => {
    const interval = setInterval(() => {
      setAdReady(rewardedAdService.ready);
    }, 2000);

    // Initial check
    setAdReady(rewardedAdService.ready);

    return () => clearInterval(interval);
  }, []);

  const handlePress = () => {
    rewardedAdService.show(onRewarded, onNotAvailable);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.button, !adReady && styles.buttonDisabled, style]}
      disabled={false} // allow press even when not ready — service handles fallback
      activeOpacity={0.8}
    >
      <View style={styles.inner}>
        <Ionicons name="play-circle-outline" size={20} color="#fff" style={styles.icon} />
        {adReady ? (
          <Text style={styles.label}>{label}</Text>
        ) : (
          <>
            <Text style={styles.label}>Loading ad...</Text>
            <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 8 }} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.dark.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonDisabled: {
    backgroundColor: '#444',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
