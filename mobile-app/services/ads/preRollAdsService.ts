/**
 * PreRollAdsService.ts
 * Manages pre-roll ad sequence before video playback.
 * Shows 2-3 ads before video starts, each with skip button (after 5 seconds).
 */

import { AD_UNIT_IDS } from './adConfig';

interface PreRollAd {
  id: string;
  adUnitId: string;
  duration: number; // How long to show ad
  skippableAfter: number; // Allow skip after N seconds
}

class PreRollAdsService {
  private prerollAds: PreRollAd[] = [
    {
      id: 'preroll-1',
      adUnitId: AD_UNIT_IDS.BANNER,
      duration: 8000,
      skippableAfter: 5000,
    },
    {
      id: 'preroll-2',
      adUnitId: AD_UNIT_IDS.BANNER,
      duration: 8000,
      skippableAfter: 5000,
    },
    {
      id: 'preroll-3',
      adUnitId: AD_UNIT_IDS.BANNER,
      duration: 8000,
      skippableAfter: 5000,
    },
  ];

  /**
   * Get the sequence of ads to show before video.
   * Can randomize which ads are shown to vary user experience.
   */
  getPreRollSequence(count: number = 2): PreRollAd[] {
    // Randomly shuffle and pick N ads from available pool
    const shuffled = [...this.prerollAds].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, this.prerollAds.length));
  }

  /**
   * Analytics: Track pre-roll ad impression
   */
  trackImpression(adId: string) {
    console.log(`[PreRoll] Ad shown: ${adId}`);
    // TODO: Send to analytics backend
  }

  /**
   * Analytics: Track when user skips pre-roll
   */
  trackSkip(adId: string) {
    console.log(`[PreRoll] Ad skipped: ${adId}`);
    // TODO: Send to analytics backend
  }

  /**
   * Analytics: Track when user watches full pre-roll
   */
  trackComplete(adId: string) {
    console.log(`[PreRoll] Ad completed: ${adId}`);
    // TODO: Send to analytics backend
  }
}

export const preRollAdsService = new PreRollAdsService();
