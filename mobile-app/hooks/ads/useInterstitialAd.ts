/**
 * useInterstitialAd.ts
 * Hook for showing interstitial ads before video plays on the HOME FEED.
 *
 * LOGIC:
 * - Maintains a local click counter per screen mount
 * - Shows an interstitial ad every Nth video click (configured in adConfig.ts)
 * - If the ad is not loaded, navigates to the video immediately
 * - After the ad closes, navigates automatically
 *
 * USAGE:
 *   const { handleVideoPress } = useInterstitialAd(navigation);
 *   <VideoCard onPress={() => handleVideoPress(videoItem)} />
 */

import { useRef, useCallback } from 'react';
import { interstitialAdService } from '../../services/ads/interstitialAdService';
import { AD_FREQUENCY } from '../../services/ads/adConfig';

type NavigationProp = {
  navigate: (screen: string, params?: object) => void;
};

export const useInterstitialAd = (navigation: NavigationProp) => {
  // Counts how many video presses have happened on this screen
  const videoClickCount = useRef<number>(0);

  /**
   * Call this instead of navigation.navigate() when a video is tapped.
   * Handles ad frequency logic and navigates after ad closes.
   */
  const handleVideoPress = useCallback(
    (video: any) => {
      videoClickCount.current += 1;

      const shouldShowAd =
        videoClickCount.current % AD_FREQUENCY.HOME_INTERSTITIAL_EVERY_N_VIDEOS === 0;

      if (shouldShowAd) {
        // Show the interstitial ad; navigate to video after it closes
        interstitialAdService.show(() => {
          // This callback fires when the ad closes (or if not loaded)
          navigation.navigate('VideoPlayer', { video });
        });
      } else {
        // Not time for an ad yet — navigate directly
        navigation.navigate('VideoPlayer', { video });
      }
    },
    [navigation]
  );

  return { handleVideoPress };
};
