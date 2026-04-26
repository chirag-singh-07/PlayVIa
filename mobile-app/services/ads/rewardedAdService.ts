/**
 * rewardedAdService.ts
 * Manages Rewarded Ad loading and showing.
 * Use this for gating premium features (e.g. "Watch ad to unlock 1080p").
 */

import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from './adConfig';

class RewardedAdService {
  private ad: RewardedAd;
  private isLoaded: boolean = false;
  private unsubscribeListeners: (() => void)[] = [];

  constructor() {
    this.ad = RewardedAd.createForAdRequest(AD_UNIT_IDS.REWARDED, {
      requestNonPersonalizedAdsOnly: false,
    });
    this.setupListeners();
    this.load();
  }

  private setupListeners() {
    this.unsubscribeListeners.forEach(fn => fn());
    this.unsubscribeListeners = [];

    const onLoaded = this.ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      this.isLoaded = true;
      console.log('[AdMob] Rewarded ad loaded ✅');
    });

    const onError = this.ad.addAdEventListener(AdEventType.ERROR, (error) => {
      this.isLoaded = false;
      console.warn('[AdMob] Rewarded ad failed:', error);
    });

    const onClosed = this.ad.addAdEventListener(AdEventType.CLOSED, () => {
      this.isLoaded = false;
      this.load(); // reload for next time
    });

    this.unsubscribeListeners = [onLoaded, onError, onClosed];
  }

  load() {
    this.ad.load();
  }

  /**
   * Show a rewarded ad.
   * @param onRewarded - Called when user earns the reward
   * @param onFailed   - Called when ad is not available
   */
  show(onRewarded: () => void, onFailed?: () => void) {
    if (!this.isLoaded) {
      console.log('[AdMob] Rewarded ad not ready');
      onFailed?.();
      return;
    }

    // Listen for the reward event (user watched enough of the ad)
    const earnedReward = this.ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('[AdMob] User earned reward:', reward);
        onRewarded();
        earnedReward(); // unsubscribe
      }
    );

    this.ad.show();
  }

  get ready(): boolean {
    return this.isLoaded;
  }

  destroy() {
    this.unsubscribeListeners.forEach(fn => fn());
  }
}

export const rewardedAdService = new RewardedAdService();
