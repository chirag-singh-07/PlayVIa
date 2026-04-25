import { useWindowDimensions } from 'react-native';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  
  const isSmallPhone = width < 375;
  const isTablet = width >= 768;
  const isLandscape = width > height;

  return {
    width,
    height,
    isSmallPhone,
    isTablet,
    isLandscape,
    // Provide a simple scaling utility based on width
    scale: (size: number) => (width / 375) * size,
  };
};
