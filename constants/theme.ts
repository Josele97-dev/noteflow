import { useColorScheme } from 'react-native';

export const colors = {
  light: {
    primary: '#6C63FF',
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#eeeeee',
    danger: '#ff4444',
    success: '#4CAF50',
  },
  dark: {
    primary: '#8B85FF',
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#aaaaaa',
    textTertiary: '#666666',
    border: '#333333',
    danger: '#ff6666',
    success: '#66BB6A',
  },
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 13,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 999,
};


export type Theme = typeof colors.light;

export function useTheme(): Theme {
  const scheme = useColorScheme() ?? 'light'; 
  return scheme === 'dark' ? colors.dark : colors.light;
}