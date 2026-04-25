export const COLORS = {
  primary: '#2196F3', // Blue primary color
  secondary: '#1976D2', // Secondary color (Darker Blue)
  accent: '#1976D2', // Darker blue for accents
  background: '#FFFFFF', // White background
  card: '#F5F5F5', // Light gray card background
  text: '#212121', // Dark text for light theme
  lightText: '#757575', // Gray for secondary text
  border: '#E0E0E0', // Light border
  icon: '#2196F3', // Blue icons

  // Grayscale colors
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  gray: '#9E9E9E',
  darkGray: '#616161',
  black: '#000000',

  // Specific UI colors
  inputBackground: '#F5F5F5', // Light input background
  buttonPrimary: '#2196F3', // Blue primary button
  buttonSecondary: '#1976D2', // Darker blue secondary button
  shadow: 'rgba(0, 0, 0, 0.1)', // Light shadow for light theme
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,
};

export const FONTS = {
  h1: { fontSize: SIZES.h1, color: COLORS.text, fontWeight: 'bold' as const },
  h2: { fontSize: SIZES.h2, color: COLORS.text, fontWeight: 'bold' as const },
  h3: { fontSize: SIZES.h3, color: COLORS.text, fontWeight: 'bold' as const },
  h4: { fontSize: SIZES.h4, color: COLORS.text, fontWeight: 'bold' as const },
  body1: { fontSize: SIZES.body1, color: COLORS.text },
  body2: { fontSize: SIZES.body2, color: COLORS.text },
  body3: { fontSize: SIZES.body3, color: COLORS.text },
  body4: { fontSize: SIZES.body4, color: COLORS.text },
  body5: { fontSize: SIZES.body5, color: COLORS.text },
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
};
