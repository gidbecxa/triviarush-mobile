import { Platform } from 'react-native';

const SYSTEM_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  common: {
    grey6: 'rgb(28, 28, 30)', // Adjusted for dark mode
    grey5: 'rgb(44, 44, 46)', // Adjusted for dark mode
    grey4: 'rgb(58, 58, 60)', // Adjusted for dark mode
    grey3: 'rgb(72, 72, 74)', // Adjusted for dark mode
    grey2: 'rgb(99, 99, 102)', // Adjusted for dark mode
    grey: 'rgb(142, 142, 147)',
    background: 'rgb(18, 18, 19)', // Adjusted for dark mode
    foreground: 'rgb(255, 255, 255)',
    root: 'rgb(18, 18, 19)', // Adjusted for dark mode
    card: 'rgb(28, 28, 30)', // Adjusted for dark mode
    destructive: 'rgb(255, 69, 58)', // Adjusted to be more vibrant
    primary: 'rgb(48, 209, 88)', // Extracted and enhanced from image
    secondary: 'rgb(58, 175, 255)', // Extracted and enhanced from image
    tertiary: 'rgb(255, 214, 10)', // Extracted and enhanced from image
    accent: 'rgb(255, 55, 95)', // Extracted and enhanced from image
  },
} as const;

const COLORS = SYSTEM_COLORS;

export { COLORS };

