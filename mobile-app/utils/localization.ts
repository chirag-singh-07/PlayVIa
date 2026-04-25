import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Set up translations
const translations = {
  en: {
    // General
    rudnex: 'PlayVia',
    home: 'Home',
    premium: 'Premium',
    profile: 'Profile',
    error: 'Error',
    ok: 'OK',
    cancel: 'Cancel',
    share: 'Share',
    // Home Screen
    enterVideoUrl: 'Enter Video URL',
    pasteVideoUrlPlaceholder: 'Paste video URL here...',
    play: 'Play',
    download: 'Download',
    fetchDetails: 'Fetch Details',
    clear: 'Clear',
    featuredCategories: 'Featured Categories',
    quickAccess: 'Quick Access',
    myDownloads: 'My Downloads',
    watchHistory: 'Watch History',
    // Playback
    openInYouTubeTitle: 'Open in YouTube?',
    openInYouTubeMessage: 'This is a YouTube video. Do you want to open it in the YouTube app?',
    open: 'Open',
    // Download
    legalDisclaimerTitle: 'Legal Disclaimer',
    legalDisclaimerMessage:
      'PlayVia does NOT allow downloading YouTube or DRM-protected content. Only download files from sources that explicitly permit downloads. Do not bypass content owner protections.',
    agreeAndDownload: 'Agree & Download',
    emptyUrlError: 'Please enter a video URL.',
    youtubeDownloadNotAllowed: 'Downloading YouTube content is not permitted.',
    downloadNotAllowed: 'Downloading not allowed for this source.',
    permissionRequired: 'Permission Required',
    mediaLibraryPermissionDenied: 'Permission to access media library is required to save videos.',
    downloadSuccessTitle: 'Download Complete',
    downloadSuccessMessage: 'Video has been downloaded to your device.',
    rudnexDownloadsAlbum: 'PlayVia Downloads',
    fileSaved: 'File Saved',
    fileSavedMessage: 'Your video has been saved to the PlayVia Downloads album in your media library.',
    downloadFailed: 'Download Failed',
    sharingNotAvailable: 'Sharing is not available on this device.',
    sharingFailed: 'Failed to share file.',
    // Video Details
    videoDetails: 'Video Details',
    failedToFetchDetails: 'Failed to fetch video details',
    // Premium Screen
    premiumFeaturesTitle: 'Unlock Premium Features',
    premiumFeaturesDescription: 'Upgrade to PlayVia Premium for an ad-free experience, faster downloads, and exclusive content!',
    getPremium: 'Get Premium',
    featureAdFree: 'Ad-Free Experience',
    featureFastDownloads: 'Faster Downloads',
    featureExclusiveContent: 'Exclusive Content',
    // Profile Screen
    profileSettingsTitle: 'Profile Settings',
    generalSettings: 'General Settings',
    language: 'Language',
    darkMode: 'Dark Mode',
    notifications: 'Notifications',
    about: 'About',
    version: 'Version',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    logout: 'Logout',
    // Android 11+ Scoped Storage Note
    androidScopedStorageNote: 'Note: On Android 11 (API level 30) and above, files downloaded by this app are saved to an app-specific directory and are not directly visible in the public Downloads folder unless explicitly moved/shared. Use the \'Share\' option after download to move it to a public folder.',
  },
  // Add other languages here if needed
  // es: {
  //   ...
  // }
};

// Simple localization helper that returns the translation object
// This matches the usage strings.key found in the app
export const getLocalizedStrings = () => {
  // In a real app, you would check Localization.locale and return the matching object
  // For now, we only have English
  return translations.en;
};
