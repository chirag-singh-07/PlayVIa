/**
 * BannerAdView.tsx
 * Reusable Banner Ad component wrapping react-native-google-mobile-ads.
 *
 * USAGE:
 *   <BannerAdView size="banner" />              // standard 320x50
 *   <BannerAdView size="largeBanner" />          // 320x100
 *   <BannerAdView size="mediumRectangle" />      // 300x250 — best for video screens
 *
 * PLACEMENT RECOMMENDATIONS:
 *   - Bottom of HomeScreen (above tab bar)
 *   - Below video player on VideoPlayerScreen
 *   - Between sections in LibraryScreen
 *
 * AdMob policy: Banner ads must NOT overlay content or be hidden from user.
 */

import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  type BannerAdProps,
} from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../../services/ads/adConfig';

// ─── Props ────────────────────────────────────────────────────────────────────

type BannerSize = keyof typeof BannerAdSize;

interface BannerAdViewProps {
  size?: BannerSize;
  style?: object;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const BannerAdView: React.FC<BannerAdViewProps> = ({
  size = 'BANNER',
  style,
}) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adFailed, setAdFailed] = useState(false);

  // Don't render anything if the ad permanently failed to load
  if (adFailed) return null;

  return (
    <View style={[styles.container, style]}>
      {/* Show a subtle loader while the ad is fetching */}
      {!adLoaded && (
        <ActivityIndicator
          size="small"
          color="#888"
          style={styles.loader}
        />
      )}

      <BannerAd
        unitId={AD_UNIT_IDS.BANNER}
        size={BannerAdSize[size]}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('[AdMob] Banner ad loaded ✅');
          setAdLoaded(true);
        }}
        onAdFailedToLoad={(error) => {
          console.warn('[AdMob] Banner ad failed:', error);
          setAdFailed(true); // hide container entirely on failure
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    minHeight: 50, // reserve space to avoid layout shift
  },
  loader: {
    position: 'absolute',
  },
});
