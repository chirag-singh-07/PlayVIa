/**
 * adConfig.ts
 * Central AdMob configuration file.
 * - Uses TEST ad unit IDs in development (never charged, always loads).
 * - In production, replace TEST IDs with your real AdMob unit IDs via env vars.
 *
 * HOW TO GET YOUR AD UNIT IDs:
 * 1. Go to https://admob.google.com
 * 2. Create an App → Add Ad Units (Interstitial, Banner, Rewarded, Native)
 * 3. Copy the unit IDs and set them in your .env file.
 *
 * AdMob TEST IDs (safe for development — Google provides these):
 * Interstitial : ca-app-pub-3940256099942544/1033173712
 * Banner       : ca-app-pub-3940256099942544/6300978111
 * Rewarded     : ca-app-pub-3940256099942544/5224354917
 */

const IS_DEV = __DEV__;

// ─── Test Ad Unit IDs (Google official test IDs) ────────────────────────────
const TEST_IDS = {
  INTERSTITIAL: "ca-app-pub-3940256099942544/1033173712",
  BANNER: "ca-app-pub-3940256099942544/6300978111",
  REWARDED: "ca-app-pub-3940256099942544/5224354917",
  NATIVE: "ca-app-pub-3940256099942544/2247696110",
};

// ─── Production Ad Unit IDs (set via EAS secrets or .env) ───────────────────
const PROD_IDS = {
  INTERSTITIAL: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID || "",
  BANNER: process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || "",
  REWARDED: process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID || "",
  NATIVE: process.env.EXPO_PUBLIC_ADMOB_NATIVE_ID || "",
};

// Check if ALL required production IDs are configured
// Falls back to test IDs automatically if any are missing
// This means: dev builds, preview builds with no .env → test IDs ✅
// Production builds with EXPO_PUBLIC_ADMOB_* set → real IDs ✅
const prodIdsConfigured =
  !!process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID &&
  !!process.env.EXPO_PUBLIC_ADMOB_BANNER_ID &&
  !!process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID;

export const AD_UNIT_IDS = IS_DEV || !prodIdsConfigured ? TEST_IDS : PROD_IDS;

// ─── AdMob App IDs (required in app.json) ───────────────────────────────────
// Set YOUR real App IDs from https://admob.google.com
export const ADMOB_APP_ID = {
  ANDROID:
    process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID ||
    "ca-app-pub-3940256099942544~3347511713", // TEST
  IOS:
    process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID ||
    "ca-app-pub-3940256099942544~1458002511", // TEST
};

// ─── Frequency Capping Rules ─────────────────────────────────────────────────
// Policy-safe limits to avoid excessive ads (per AdMob policy)
export const AD_FREQUENCY = {
  // Show interstitial every N video plays on the home feed
  HOME_INTERSTITIAL_EVERY_N_VIDEOS: 3,

  // Show interstitial every N shorts viewed
  SHORTS_INTERSTITIAL_EVERY_N_SHORTS: 6,

  // Insert native/feed ad after every N shorts in the feed array
  SHORTS_FEED_AD_EVERY_N_ITEMS: 5,

  // Minimum seconds between two interstitials (cooldown)
  MIN_INTERSTITIAL_COOLDOWN_MS: 30_000, // 30 seconds
};
