import { useRef, useState } from 'react';
import { Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

export const useScrollHeader = (headerHeight: number = 60) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  // Used for mapping scrollY to translateY of header
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        
        // Hide header if scrolled down past headerHeight
        if (currentScrollY > lastScrollY.current && currentScrollY > headerHeight && isHeaderVisible) {
          setIsHeaderVisible(false);
        } 
        // Show header if scrolling up
        else if (currentScrollY < lastScrollY.current && !isHeaderVisible) {
          setIsHeaderVisible(true);
        }
        
        lastScrollY.current = currentScrollY;
      },
    }
  );

  return {
    scrollY,
    headerTranslateY,
    onScroll,
    isHeaderVisible,
  };
};
