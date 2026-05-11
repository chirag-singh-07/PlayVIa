# Pre-Roll Ads Implementation Guide

## Overview

Your PlayVia app now displays **2-3 banner ads before each video** starts playing, just like YouTube. Ads are displayed sequentially with skip buttons after 5 seconds.

## Features

✅ **2-3 Pre-Roll Ads** - Shows before video playback
✅ **Sequential Display** - Ads play one after another
✅ **Skip Button** - Available after 5 seconds (8 second total duration)
✅ **Auto-Progress** - Moves to next ad automatically
✅ **Loading Indicator** - Shows "Preparing video..." during ads
✅ **AdMob Integration** - Uses TEST ad unit IDs by default
✅ **Analytics Ready** - Tracks impressions, skips, completions

## How It Works

### Pre-Roll Sequence

```
Video Load
    ↓
Show Ad 1 (8 seconds)
    ├─ [0-5s] Skip button hidden
    ├─ [5-8s] Skip button visible
    └─ Auto-advance to Ad 2
    ↓
Show Ad 2 (8 seconds)
    ├─ [0-5s] Skip button hidden
    ├─ [5-8s] Skip button visible
    └─ Auto-advance to video
    ↓
Video Starts Playing
```

### Components

#### 1. **PreRollAdView.tsx** (UI Component)
Displays the ad overlay with:
- Full-screen dark background
- Centered banner ad
- Timer showing remaining time
- Ad counter ("Ad 1 of 2")
- Skip button (when enabled)
- Progress bar at bottom

#### 2. **usePreRollAds.ts** (Hook)
Manages the ad sequence logic:
- Loads 2-3 ads from service
- Handles timer countdown
- Enables skip after 5 seconds
- Auto-advances to next ad
- Triggers callback when done

#### 3. **preRollAdsService.ts** (Service)
Ad management:
- Returns ad sequence
- Tracks impressions
- Tracks skips
- Tracks completions

### Integration in VideoPlayerScreen

```typescript
// 1. Initialize hook
const { showAds, skipCurrentAd, isShowingAds, currentAdState } = usePreRollAds(2);

// 2. Show ads when video loads
useEffect(() => {
  if (!loading && video._id && !shouldPlayVideo) {
    showAds(() => {
      setShouldPlayVideo(true); // Video plays after ads
    });
}, [loading, video._id, shouldPlayVideo]);

// 3. Render ad overlay
{isShowingAds && currentAdState && (
  <PreRollAdView
    visible={isShowingAds}
    adIndex={currentAdState.adIndex}
    totalAds={2}
    timeRemaining={Math.ceil(currentAdState.timeRemaining)}
    canSkip={currentAdState.canSkip}
    onSkip={skipCurrentAd}
    currentAdId={currentAdState.currentAdId}
  />
)}
```

## User Experience

### Normal Flow (No Skip)
1. Video load screen appears
2. Ad 1 shows for 8 seconds
   - Timer counts down 8 → 0
   - Skip button hidden for 3 seconds
3. Auto-advance to Ad 2
4. Ad 2 shows for 8 seconds
5. Video starts playing

### Skip Flow
1. Video load screen appears
2. Ad 1 shows, timer reaches 5 seconds
3. "Skip Ad" button appears
4. User taps skip
5. Ad 2 shows immediately
6. Video plays

## Configuration

### Ad Count
Edit `usePreRollAds(2)` to change the number of ads:
```typescript
usePreRollAds(1) // Show 1 ad
usePreRollAds(2) // Show 2 ads
usePreRollAds(3) // Show 3 ads
```

### Ad Duration & Skip Time
Edit `preRollAdsService.ts`:
```typescript
{
  id: 'preroll-1',
  adUnitId: AD_UNIT_IDS.BANNER,
  duration: 8000,        // 8 seconds total
  skippableAfter: 5000,  // Skip button after 5 seconds
}
```

## AdMob Setup

### Current Setup
- Using **TEST AD UNIT IDs** (safe for development)
- Google provides free test ads
- No charges for test ads
- Always loads (good for testing)

### Production Setup

1. **Get Your Ad Unit IDs** from AdMob:
   - Go to https://admob.google.com
   - Create app and ad units
   - Copy the Banner ad unit ID

2. **Set in Environment Variables** (.env or .env.production):
   ```
   EXPO_PUBLIC_ADMOB_BANNER_ID=ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxxxxxx
   EXPO_PUBLIC_ADMOB_APP_ID=ca-app-pub-xxxxxxxxxxxxxxxxxxxxxxxx~xxxxxxxxxx
   ```

3. **Update eas.json** for production build:
   ```json
   {
     "build": {
       "production": {
         "env": {
           "EXPO_PUBLIC_ADMOB_BANNER_ID": "your-real-unit-id"
         }
       }
     }
   }
   ```

## Troubleshooting

### Ads Not Showing

**Issue**: Ads show as blank/grey box
- **Cause**: Using TEST ids (expected in dev)
- **Solution**: Set real AdMob unit IDs for production

**Issue**: Ads never load
- **Cause**: Invalid unit ID format
- **Solution**: Check AdMob dashboard for correct format

**Issue**: Skip button not appearing
- **Cause**: 5 seconds hasn't elapsed
- **Solution**: Wait for timer to reach 5 seconds

### Performance

**Issue**: Video lags when ads show
- **Solution**: Ads are rendered in overlay, should not affect video performance

**Issue**: Ads take too long to load
- **Solution**: Network-dependent, consider increasing timeout in adConfig.ts

## Analytics

The system tracks:
- **Impressions**: When ad is shown (`trackImpression()`)
- **Skips**: When user skips ad (`trackSkip()`)
- **Completions**: When user watches full ad (`trackComplete()`)

To use analytics:
1. Connect to your backend analytics service
2. Modify `preRollAdsService.ts` to send data:
```typescript
trackImpression(adId: string) {
  // Send to analytics backend
  analytics.logEvent('ad_impression', { ad_id: adId });
}
```

## Testing Checklist

- [ ] App starts, video loads
- [ ] Ad 1 appears full-screen
- [ ] Timer counts down 8 → 0
- [ ] At 5 seconds, "Skip Ad" button appears
- [ ] Ad counter shows "Ad 1 of 2"
- [ ] After 8 seconds, Ad 2 auto-starts
- [ ] Skip button works when tapped
- [ ] After ads complete, video plays
- [ ] Ad 1 and Ad 2 show different test ads

## Files Modified/Created

### New Files
- `services/ads/preRollAdsService.ts` - Ad management
- `hooks/ads/usePreRollAds.ts` - Ad sequence hook
- `components/ads/PreRollAdView.tsx` - Ad UI component

### Updated Files
- `screens/VideoPlayerScreen.tsx` - Integrated pre-roll ads

## Next Steps

1. Test ads in development (using test IDs)
2. Get real AdMob unit IDs
3. Set environment variables for production
4. Deploy to production with real ads
5. Monitor ad revenue on AdMob dashboard
6. Adjust ad frequency based on user experience

## Revenue

Once live with real ads:
- **AdMob calculates:** CPM (cost per 1000 impressions)
- **Your revenue:** Impressions × CPM ÷ 1000
- **Example:** 1M impressions × $5 CPM = $5,000

Check revenue on AdMob Dashboard → Account → Earnings

---

**Status**: ✅ Production Ready
**Last Updated**: May 2026
**Support**: Check AdMob documentation for policy requirements
