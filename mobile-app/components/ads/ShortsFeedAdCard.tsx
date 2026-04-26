/**
 * ShortsFeedAdCard.tsx
 * Ad placeholder card inserted between real short videos in the FlatList.
 *
 * This renders inside the Shorts FlatList when item.type === 'ad'.
 * It is the same height as a normal short (full screen) so the
 * paging/snap behavior stays seamless.
 *
 * WHAT THIS RENDERS:
 * - A full-screen placeholder with a BannerAd (mediumRectangle 300x250)
 *   centered vertically. This mimics a "sponsored card" that feels natural
 *   between short videos.
 *
 * FUTURE: Replace the placeholder with a proper NativeAd component when
 * react-native-google-mobile-ads supports NativeAd on Expo.
 *
 * AdMob Policy Note:
 *   - The ad card must be clearly labeled "Sponsored" or "Ad"
 *   - Must not auto-scroll past it — the paging pause is intentional
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BannerAdView } from './BannerAdView';
import { colors } from '../../theme';

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');

interface ShortsFeedAdCardProps {
  adIndex?: number;
}

export const ShortsFeedAdCard: React.FC<ShortsFeedAdCardProps> = ({ adIndex = 0 }) => {
  return (
    <View style={styles.container}>
      {/* Dark overlay background, same look as short videos */}
      <View style={styles.background} />

      {/* "Sponsored" label — required by AdMob policy */}
      <View style={styles.sponsoredBadge}>
        <Text style={styles.sponsoredText}>Sponsored</Text>
      </View>

      {/* The actual ad unit — mediumRectangle (300×250) works best here */}
      <View style={styles.adWrapper}>
        <BannerAdView size="MEDIUM_RECTANGLE" />
      </View>

      {/* Bottom info strip */}
      <View style={styles.bottomStrip}>
        <Text style={styles.bottomText}>Advertisement</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    backgroundColor: colors.dark.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.92)',
  },
  sponsoredBadge: {
    position: 'absolute',
    top: 56,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sponsoredText: {
    color: '#ccc',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  adWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    // Shadow for a card-like feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomStrip: {
    position: 'absolute',
    bottom: 90,
    alignItems: 'center',
  },
  bottomText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
});
