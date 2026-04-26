/**
 * useShortsAd.ts
 * Hook for managing ALL ad logic inside the Shorts feed:
 *
 * A) INTERSTITIAL ADS:
 *    - Shows an interstitial ad after every N shorts are VIEWED (scrolled past)
 *    - Frequency defined in adConfig.ts (default: every 6 shorts)
 *    - Reloads ad after close, continues normal scrolling if ad unavailable
 *
 * B) FEED AD INSERTION:
 *    - Merges ad placeholder objects into the shorts array
 *    - Insert an ad after every M shorts (default: every 5)
 *    - Ad items have type: 'ad' to differentiate in renderItem
 *
 * USAGE:
 *   const { feedWithAds, onShortViewed } = useShortsAd(rawShorts);
 *   <FlatList data={feedWithAds} renderItem={...} />
 *   onMomentumScrollEnd -> onShortViewed(newIndex)
 */

import { useRef, useCallback, useMemo } from 'react';
import { interstitialAdService } from '../../services/ads/interstitialAdService';
import { AD_FREQUENCY } from '../../services/ads/adConfig';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ShortVideoItem = {
  _id: string;
  type?: 'video';
  [key: string]: any;
};

export type FeedAdItem = {
  _id: string;
  type: 'ad';
  adIndex: number; // which ad slot this is (0, 1, 2 ...)
};

export type FeedItem = ShortVideoItem | FeedAdItem;

// ─── Helper: Insert ad placeholders into the shorts array ────────────────────

/**
 * Takes an array of short video objects and inserts ad placeholder objects
 * after every `everyN` items.
 *
 * Example (everyN=5): [v, v, v, v, v, AD, v, v, v, v, v, AD, ...]
 */
function insertFeedAds(
  shorts: ShortVideoItem[],
  everyN: number = AD_FREQUENCY.SHORTS_FEED_AD_EVERY_N_ITEMS
): FeedItem[] {
  const result: FeedItem[] = [];
  let adIndex = 0;

  shorts.forEach((short, i) => {
    result.push(short);

    // Insert an ad after every Nth real video
    if ((i + 1) % everyN === 0) {
      result.push({
        _id: `ad_${adIndex}`,
        type: 'ad',
        adIndex: adIndex++,
      });
    }
  });

  return result;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useShortsAd = (rawShorts: ShortVideoItem[]) => {
  // Count of real shorts viewed (not ad slots)
  const shortsViewedCount = useRef<number>(0);

  /**
   * Call this whenever the FlatList snaps to a new item.
   * Pass the current index in the REAL shorts array (not the merged feed).
   *
   * @param newIndex - The new active index in the merged feed array
   * @param feedData - The merged feed array (videos + ad slots)
   */
  const onShortViewed = useCallback((newIndex: number, feedData: FeedItem[]) => {
    const currentItem = feedData[newIndex];

    // Don't count ad slots as "viewed shorts"
    if (!currentItem || currentItem.type === 'ad') return;

    shortsViewedCount.current += 1;

    const shouldShowInterstitial =
      shortsViewedCount.current % AD_FREQUENCY.SHORTS_INTERSTITIAL_EVERY_N_SHORTS === 0;

    if (shouldShowInterstitial) {
      console.log('[AdMob] Showing interstitial after shorts milestone');
      // Show interstitial; no navigation needed — just resume scrolling after
      interstitialAdService.show(() => {
        console.log('[AdMob] Interstitial closed, resuming shorts');
        // Reload is handled automatically by the service
      });
    }
  }, []);

  /**
   * feedWithAds: the shorts array with ad placeholder objects inserted.
   * Re-computed whenever rawShorts changes.
   */
  const feedWithAds = useMemo<FeedItem[]>(
    () => insertFeedAds(rawShorts),
    [rawShorts]
  );

  return {
    feedWithAds,  // use this as FlatList data instead of rawShorts
    onShortViewed, // call on scroll snap
  };
};
