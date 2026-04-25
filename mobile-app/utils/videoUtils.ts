import * as FileSystem from 'expo-file-system';
import {
  Platform,
  Alert
} from 'react-native';
import { getLocalizedStrings } from './localization';

const strings = getLocalizedStrings();

export const isYouTubeUrl = (url: string): boolean => {
  const youtubeRegex = /^(https?:\/\/(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/.*)$/;
  return youtubeRegex.test(url);
};

export const isTeraboxUrl = (url: string): boolean => {
  const teraboxRegex = /^(https?:\/\/(?:www\.)?(?:1024)?terabox\.com\/.*)$/;
  return teraboxRegex.test(url);
};

export const isVimeoUrl = (url: string): boolean => {
  const vimeoRegex = /^(https?:\/\/(?:www\.)?vimeo\.com\/.*)$/;
  return vimeoRegex.test(url);
};

export const isDailymotionUrl = (url: string): boolean => {
  const dailymotionRegex = /^(https?:\/\/(?:www\.)?(?:dailymotion\.com\/video|dai\.ly)\/.*)$/;
  return dailymotionRegex.test(url);
};

export const getVideoThumbnail = async (url: string): Promise<string | null> => {
  try {
    if (isYouTubeUrl(url)) {
      const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
    }

    if (isVimeoUrl(url)) {
      const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
      const videoId = match ? match[1] : null;
      if (videoId) {
        try {
          const response = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
          const data = await response.json();
          return data[0]?.thumbnail_large || null;
        } catch (e) {
          console.error("Error fetching Vimeo thumbnail", e);
          return null;
        }
      }
    }

    if (isDailymotionUrl(url)) {
      const match = url.match(/(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9]+)/);
      const videoId = match ? match[1] : null;
      return videoId ? `https://www.dailymotion.com/thumbnail/video/${videoId}` : null;
    }

    return null; // For direct links, we'd need expo-video-thumbnails
  } catch (error) {
    console.error('Error getting video thumbnail:', error);
    return null;
  }
};

export const getVideoInfo = async (url: string): Promise<any> => {
  try {
    // In a real application, you'd use a backend service to safely fetch video info
    // and avoid CORS issues or directly hitting rate limits/API keys from the client.
    // For this example, we'll just return a mock structure.
    // A HEAD request might give some basic info like content-type and length, but not full video metadata.
    const response = await fetch(url, {
      method: 'HEAD',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch video info: ${response.statusText}`);
    }

    const contentType = response.headers.get('Content-Type');
    const contentLength = response.headers.get('Content-Length');

    return {
      url,
      contentType,
      contentLength: contentLength ? `${(parseInt(contentLength, 10) / (1024 * 1024)).toFixed(2)} MB` : 'Unknown',
      // More details would come from a proper video metadata API
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw error;
  }
};

export const checkDownloadability = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
    });

    if (!response.ok) {
      console.warn(
        `HEAD request for ${url} failed with status ${response.status}`
      );
      return false;
    }

    const contentType = response.headers.get('Content-Type') || '';
    const contentDisposition = response.headers.get('Content-Disposition') || '';
    const urlExtension = url.split('.').pop()?.split('/')[0].toLowerCase() || '';

    const allowedContentTypes = ['video/', 'application/octet-stream'];
    const allowedExtensions = ['.mp4', '.mkv', '.webm', '.mov', '.ts', '.m3u8'];

    const isContentTypeAllowed = allowedContentTypes.some((type) =>
      contentType.startsWith(type)
    );
    const isContentDispositionAttachment = contentDisposition.includes('attachment');
    const isExtensionAllowed = allowedExtensions.some((ext) =>
      urlExtension.endsWith(ext.replace('.', ''))
    );

    // Strict & legal: Do NOT allow YouTube downloading.
    if (isYouTubeUrl(url)) {
      Alert.alert(strings.error, strings.youtubeDownloadNotAllowed);
      return false;
    }

    if (isContentTypeAllowed || isContentDispositionAttachment || isExtensionAllowed) {
      return true;
    }

    console.warn(
      `Download not allowed for ${url}. Content-Type: ${contentType}, Content-Disposition: ${contentDisposition}, Extension: ${urlExtension}`
    );
    return false;
  } catch (error) {
    console.error('Error checking downloadability:', error);
    return false;
  }
};

export const downloadFile = async (url: string): Promise<string | null> => {
  try {
    const fileExtension = url.split('.').pop()?.split('/')[0] || 'mp4';
    const filename = `${Date.now()}.${fileExtension}`;
    const downloadDirectory = ((FileSystem as any).documentDirectory || '') + 'RudnexDownloads/';

    // Ensure the download directory exists
    const dirInfo = await FileSystem.getInfoAsync(downloadDirectory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(downloadDirectory, { intermediates: true });
    }

    const fileUri = downloadDirectory + filename;

    const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);

    const result = await downloadResumable.downloadAsync();

    if (result && result.uri) {
      console.log('Finished downloading to ', result.uri);
      return result.uri;
    }
    return null;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

export const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M';
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  }
  return views.toString();
};

export const formatTimeAgo = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  if (diffInMonths > 0) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInMins > 0) return `${diffInMins} minute${diffInMins > 1 ? 's' : ''} ago`;
  return 'Just now';
};

export const formatDuration = (seconds: number): string => {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

