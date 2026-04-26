/**
 * interstitialAdService.ts
 * Manages Interstitial ad loading, showing, and reloading.
 * This is a singleton service — one instance manages all interstitials.
 *
 * WHY SINGLETON?
 * AdMob recommends pre-loading ads before you need them. By keeping a
 * single shared service, the ad is always warming up in the background.
 */

import {
  InterstitialAd,
  AdEventType,
  type AdShowOptions,
} from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS, AD_FREQUENCY } from './adConfig';

class InterstitialAdService {
  private ad: InterstitialAd;
  private isLoaded: boolean = false;
  private lastShownAt: number = 0;  // timestamp of last shown ad
  private unsubscribeListeners: (() => void)[] = [];

  constructor() {
    // Create the interstitial ad instance once
    this.ad = InterstitialAd.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL, {
      requestNonPersonalizedAdsOnly: false, // set true for GDPR compliance
    });
    this.setupListeners();
    this.load(); // pre-load immediately on app start
  }

  /** Attach event listeners and pre-load next ad after close */
  private setupListeners() {
    // Clean up any old listeners
    this.unsubscribeListeners.forEach(fn => fn());
    this.unsubscribeListeners = [];

    const onLoaded = this.ad.addAdEventListener(AdEventType.LOADED, () => {
      this.isLoaded = true;
      console.log('[AdMob] Interstitial ad loaded ✅');
    });

    const onError = this.ad.addAdEventListener(AdEventType.ERROR, (error) => {
      this.isLoaded = false;
      console.warn('[AdMob] Interstitial ad failed to load:', error);
    });

    const onClosed = this.ad.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('[AdMob] Interstitial ad closed');
      this.isLoaded = false;
      // Pre-load the next ad as soon as the current one closes
      this.load();
    });

    this.unsubscribeListeners = [onLoaded, onError, onClosed];
  }

  /** Load (or reload) the interstitial ad */
  load() {
    this.ad.load();
  }

  /**
   * Show the ad if loaded and frequency cap is not hit.
   * @param onClosed - Callback fired after ad closes (or if ad not ready)
   */
  async show(onClosed?: () => void): Promise<boolean> {
    const now = Date.now();
    const cooldownOk =
      now - this.lastShownAt >= AD_FREQUENCY.MIN_INTERSTITIAL_COOLDOWN_MS;

    if (!this.isLoaded || !cooldownOk) {
      // Ad not ready or too soon — call callback immediately so the user
      // still navigates without interruption
      console.log('[AdMob] Interstitial not ready or in cooldown — skipping');
      onClosed?.();
      return false;
    }

    // Attach a one-time listener for the CLOSED event to call the callback
    if (onClosed) {
      const unsub = this.ad.addAdEventListener(AdEventType.CLOSED, () => {
        onClosed();
        unsub(); // remove this specific listener after firing
      });
    }

    this.lastShownAt = now;
    this.ad.show();
    return true;
  }

  /** Check if an ad is currently loaded and ready */
  get ready(): boolean {
    return this.isLoaded;
  }

  /** Clean up all listeners (call on app unmount) */
  destroy() {
    this.unsubscribeListeners.forEach(fn => fn());
  }
}

// Export a single shared instance
export const interstitialAdService = new InterstitialAdService();
