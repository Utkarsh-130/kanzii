import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

// Modern Dark Theme with aesthetic colors
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    primaryContainer: '#3700B3',
    secondary: '#03DAC6',
    secondaryContainer: '#018786',
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#CAC4D0',
    outline: '#938F99',
    error: '#CF6679',
    errorContainer: '#B00020',
    // Custom colors for Japanese learning app
    accent: '#FF6B6B',
    accentSecondary: '#4ECDC4',
    gradient1: '#667eea',
    gradient2: '#764ba2',
    cardBackground: '#1E1E1E',
    cardBorder: '#383838',
    textPrimary: '#FFFFFF',
    textSecondary: '#B0BEC5',
    shadowColor: '#000000',
  },
};

// Light theme for fallback
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200EE',
    primaryContainer: '#BB86FC',
    secondary: '#03DAC6',
    secondaryContainer: '#018786',
  },
};

export const theme = darkTheme; // Default to dark theme
