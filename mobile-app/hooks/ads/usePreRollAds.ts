/**
 * usePreRollAds.ts
 * Hook for managing pre-roll ad sequence before video playback.
 *
 * LOGIC:
 * - Shows 2-3 banner ads in sequence
 * - Each ad auto-plays for 8 seconds
 * - Skip button appears after 5 seconds
 * - After all ads complete, triggers onAdSequenceComplete callback
 *
 * USAGE:
 *   const { showAds, isShowingAds } = usePreRollAds();
 *   useEffect(() => {
 *     showAds(() => setVideoReady(true));
 *   }, []);
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { preRollAdsService } from '../../services/ads/preRollAdsService';

interface PreRollAdState {
  adIndex: number;
  currentAdId: string;
  timeRemaining: number; // seconds
  canSkip: boolean;
}

export const usePreRollAds = (adCount: number = 2) => {
  const [isShowingAds, setIsShowingAds] = useState(false);
  const [currentAdState, setCurrentAdState] = useState<PreRollAdState | null>(null);
  const [adSequence, setAdSequence] = useState<any[]>([]);
  
  const adTimerRef = useRef<NodeJS.Timeout | null>(null);
  const adCountdownRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef<(() => void) | null>(null);

  /**
   * Show the pre-roll ad sequence
   */
  const showAds = useCallback((onComplete: () => void) => {
    onCompleteRef.current = onComplete;
    const sequence = preRollAdsService.getPreRollSequence(adCount);
    setAdSequence(sequence);
    setIsShowingAds(true);

    // Start with first ad
    startAd(0, sequence);
  }, [adCount]);

  /**
   * Start showing a specific ad in the sequence
   */
  const startAd = (index: number, sequence: any[]) => {
    if (index >= sequence.length) {
      // All ads complete
      finishAdSequence();
      return;
    }

    const ad = sequence[index];
    const duration = ad.duration / 1000; // Convert to seconds
    const skippableAfter = ad.skippableAfter / 1000;

    setCurrentAdState({
      adIndex: index,
      currentAdId: ad.id,
      timeRemaining: duration,
      canSkip: false,
    });

    preRollAdsService.trackImpression(ad.id);

    // Countdown timer
    let timeLeft = duration;
    adCountdownRef.current = setInterval(() => {
      timeLeft -= 1;
      
      setCurrentAdState(prev => prev ? {
        ...prev,
        timeRemaining: timeLeft,
        canSkip: timeLeft <= (duration - skippableAfter),
      } : null);

      if (timeLeft <= 0) {
        clearInterval(adCountdownRef.current!);
        preRollAdsService.trackComplete(ad.id);
        
        // Move to next ad
        adTimerRef.current = setTimeout(() => {
          startAd(index + 1, sequence);
        }, 500);
      }
    }, 1000);
  };

  /**
   * User manually skips current ad
   */
  const skipCurrentAd = useCallback(() => {
    if (!currentAdState || !currentAdState.canSkip) return;

    const ad = adSequence[currentAdState.adIndex];
    if (ad) {
      preRollAdsService.trackSkip(ad.id);
    }

    // Clear timers
    if (adCountdownRef.current) clearInterval(adCountdownRef.current);
    if (adTimerRef.current) clearTimeout(adTimerRef.current);

    // Move to next ad
    startAd(currentAdState.adIndex + 1, adSequence);
  }, [currentAdState, adSequence]);

  /**
   * Skip entire ad sequence (for testing/dev)
   */
  const skipAllAds = useCallback(() => {
    // Clear timers
    if (adCountdownRef.current) clearInterval(adCountdownRef.current);
    if (adTimerRef.current) clearTimeout(adTimerRef.current);

    finishAdSequence();
  }, []);

  /**
   * Complete the ad sequence
   */
  const finishAdSequence = () => {
    setIsShowingAds(false);
    setCurrentAdState(null);
    
    // Call completion callback
    if (onCompleteRef.current) {
      onCompleteRef.current();
      onCompleteRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (adCountdownRef.current) clearInterval(adCountdownRef.current);
      if (adTimerRef.current) clearTimeout(adTimerRef.current);
    };
  }, []);

  return {
    showAds,
    skipCurrentAd,
    skipAllAds,
    isShowingAds,
    currentAdState,
    adSequence,
  };
};
