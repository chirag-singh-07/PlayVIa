/**
 * PreRollAdView.tsx
 * Component that displays pre-roll ads before video playback.
 *
 * Shows:
 * - Full-screen ad overlay
 * - Ad counter (Ad 1/3)
 * - Time remaining
 * - Skip button (when allowed)
 * - Progress bar
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BannerAdView } from './BannerAdView';
import { colors, typography } from '../../theme';

const { height: WINDOW_HEIGHT, width: WINDOW_WIDTH } = Dimensions.get('window');

interface PreRollAdViewProps {
  visible: boolean;
  adIndex: number;
  totalAds: number;
  timeRemaining: number;
  canSkip: boolean;
  onSkip: () => void;
  currentAdId: string;
}

export const PreRollAdView: React.FC<PreRollAdViewProps> = ({
  visible,
  adIndex,
  totalAds,
  timeRemaining,
  canSkip,
  onSkip,
  currentAdId,
}) => {
  if (!visible) return null;

  // Calculate progress (0 to 1)
  const maxTime = 8; // 8 seconds per ad
  const progress = Math.max(0, 1 - timeRemaining / maxTime);

  return (
    <View style={styles.container}>
      {/* Dark background overlay */}
      <View style={styles.background} />

      {/* Ad Content Area */}
      <View style={styles.adContainer}>
        {/* Mock Ad Content - Shows when AdMob fails */}
        <View style={styles.mockAdWrapper}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800' }} 
            style={styles.mockAdImage}
            resizeMode="cover"
          />
          <View style={styles.mockAdOverlay}>
            <View style={styles.mockAdBranding}>
              <Ionicons name="play-circle" size={40} color={colors.dark.primary} />
              <Text style={styles.mockAdTitle}>Stream Premium Content</Text>
              <Text style={styles.mockAdDesc}>Upgrade to PlayVia Pro for an ad-free experience and exclusive creator tools.</Text>
              <TouchableOpacity style={styles.mockAdBtn}>
                <Text style={styles.mockAdBtnText}>LEARN MORE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.bannerAdWrapper}>
          <BannerAdView size="MEDIUM_RECTANGLE" />
        </View>
      </View>

      {/* Top Controls */}
      <View style={styles.topBar}>
        <View style={styles.adCounter}>
          <Text style={styles.adCounterText}>Ad {adIndex + 1} of {totalAds}</Text>
        </View>

        {/* Time Display */}
        <View style={styles.timeDisplay}>
          <Ionicons name="timer-outline" size={14} color={colors.dark.white} />
          <Text style={styles.timeText}>{timeRemaining}s</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${progress * 100}%` },
          ]}
        />
      </View>

      {/* Skip Button (shown when allowed) */}
      {canSkip ? (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={onSkip}
          activeOpacity={0.8}
        >
          <Text style={styles.skipButtonText}>Skip Ad</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.dark.white}
            style={styles.skipIcon}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.skipButtonPlaceholder}>
          <Text style={styles.skipPlaceholderText}>
            Skip in {timeRemaining}s
          </Text>
        </View>
      )}

      {/* "Advertisement" Label */}
      <View style={styles.adLabel}>
        <Text style={styles.adLabelText}>Advertisement</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    backgroundColor: colors.dark.black,
    zIndex: 1000,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  adContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mockAdWrapper: {
    width: '100%',
    maxWidth: 400,
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  mockAdImage: {
    width: '100%',
    height: '100%',
  },
  mockAdOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mockAdBranding: {
    alignItems: 'center',
    textAlign: 'center',
  },
  mockAdTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 10,
    textAlign: 'center',
  },
  mockAdDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  mockAdBtn: {
    backgroundColor: colors.dark.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 15,
  },
  mockAdBtnText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 12,
  },
  bannerAdWrapper: {
    position: 'absolute',
    opacity: 0, // Keep AdMob hidden while it fails/loads
  },
  topBar: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  adCounter: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  adCounterText: {
    color: colors.dark.white,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold as '700',
  },
  timeDisplay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    color: colors.dark.white,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold as '700',
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.dark.primary,
  },
  skipButton: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    backgroundColor: colors.dark.primary,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  skipButtonText: {
    color: colors.dark.white,
    fontWeight: typography.weights.bold as '700',
    fontSize: typography.sizes.sm,
  },
  skipIcon: {
    marginLeft: 4,
  },
  skipButtonPlaceholder: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  skipPlaceholderText: {
    color: colors.dark.textSecondary,
    fontWeight: typography.weights.medium as '500',
    fontSize: typography.sizes.xs,
  },
  adLabel: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  adLabelText: {
    color: colors.dark.textSecondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium as '500',
  },
});
