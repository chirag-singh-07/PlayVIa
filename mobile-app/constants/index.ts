import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 24,
    full: 9999,
  },
};

export const MOCK_DATA = {
  videos: [
    {
      id: '1',
      title: 'Building a YouTube Clone with React Native Expo',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
      channelName: 'Frontend Mastery',
      channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
      views: '1.2M',
      createdAt: '2 days ago',
      duration: '14:20',
    },
    {
      id: '2',
      title: 'Top 10 UI/UX Design Trends in 2026',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop',
      channelName: 'Design Pro',
      channelAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&auto=format&fit=crop',
      views: '450K',
      createdAt: '1 week ago',
      duration: '8:45',
    },
    {
      id: '3',
      title: 'React Native vs Flutter - Which one to choose?',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
      channelName: 'Tech Talk',
      channelAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
      views: '890K',
      createdAt: '3 weeks ago',
      duration: '22:10',
    },
  ],
  shorts: [
    {
      id: 's1',
      title: 'Quick UI Tip: Glassmorphism',
      videoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
      channelName: 'UI Shorts',
      channelAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop',
      likes: '12K',
      comments: '340',
    },
    {
      id: 's2',
      title: 'React Native Animations in 60 seconds',
      videoUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1000&auto=format&fit=crop',
      channelName: 'Code Snippets',
      channelAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
      likes: '45K',
      comments: '1.2K',
    },
  ],
};
