import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, InteractionManager } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeProvider';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { AuthButton } from '../../components/auth/AuthButton';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Watch Anywhere, Anytime',
    subtitle: 'Stream thousands of Indian videos in HD',
    icon: 'play-circle-outline' as any,
  },
  {
    id: 2,
    title: 'Discover Indian Content',
    subtitle: 'Movies, music, news, and more in your language',
    icon: 'grid-outline' as any,
  },
  {
    id: 3,
    title: 'Upload & Share',
    subtitle: 'Share your videos with millions of viewers',
    icon: 'cloud-upload-outline' as any,
  },
];

// ✅ Moved OUTSIDE OnboardingScreen to avoid React hooks rules violation
// (Defining components with hooks inside render crashes on Hermes/production)
const Dot = ({
  index,
  currentIndex,
  borderColor,
}: {
  index: number;
  currentIndex: number;
  borderColor: string;
}) => {
  const animatedDotStyle = useAnimatedStyle(() => {
    const isActive = currentIndex === index;
    return {
      width: withSpring(isActive ? 24 : 8),
      backgroundColor: isActive ? colors.primary : borderColor,
    };
  });

  return <Animated.View style={[styles.dot, animatedDotStyle]} />;
};

export const OnboardingScreen: React.FC<any> = ({ navigation }) => {
  const { theme } = useTheme();
  const themeColors = theme === 'dark' ? colors.dark : colors.light;
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      InteractionManager.runAfterInteractions(() => {
        navigation.replace('Login');
      });
    }
  };

  const handleSkip = () => {
    InteractionManager.runAfterInteractions(() => {
      navigation.replace('Login');
    });
  };

  const currentSlide = slides[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { color: themeColors.textSecondary }]}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Animated.View 
          key={currentSlide.id}
          entering={FadeInRight.duration(400)}
          exiting={FadeOutLeft.duration(400)}
          style={styles.slide}
        >
          <LinearGradient
            colors={['rgba(255,0,0,0.1)', 'transparent']}
            style={styles.iconContainer}
          >
            <Ionicons name={currentSlide.icon} size={120} color={colors.primary} />
          </LinearGradient>
          
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            {currentSlide.title}
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            {currentSlide.subtitle}
          </Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <Dot
              key={index}
              index={index}
              currentIndex={currentIndex}
              borderColor={themeColors.border}
            />
          ))}
        </View>

        <AuthButton 
          title={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.base,
  },
  skipText: {
    ...typography.label,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width,
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.heading,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.subheading,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
