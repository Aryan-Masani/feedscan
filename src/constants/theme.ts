import { Platform } from 'react-native';

export const Theme = {
  colors: {
    // Primary Earthy Green
    primary: '#2E7D32',
    primaryDark: '#1B5E20',
    primaryLight: '#4CAF50',
    primarySurface: '#E8F5E9',
    primaryBorder: '#C8E6C9',
    
    // Warm Amber Accent
    accent: '#F57C00',
    accentDark: '#E65100',
    accentLight: '#FFF3E0',
    accentBorder: '#FFE0B2',

    // Traffic-light Verdicts
    safe: '#2E7D32',
    safeSurface: '#E8F5E9',
    safeBorder: '#A5D6A7',
    safeDark: '#1B5E20',

    caution: '#D84315',
    cautionSurface: '#FBE9E7',
    cautionBorder: '#FFAB91',
    cautionDark: '#BF360C',

    reject: '#C62828',
    rejectSurface: '#FFEBEE',
    rejectBorder: '#EF9A9A',
    rejectDark: '#B71C1C',

    // Background & Surfaces
    background: '#F8F9F5',
    surface: '#FFFFFF',
    surfaceSubtle: '#F2F4EE',
    surfaceHighlight: '#E9EFE6',
    border: '#E2E6DC',
    borderStrong: '#C5CDC0',

    // Text hierarchy
    text: '#1A2419',
    textSecondary: '#526150',
    textMuted: '#7D8C7B',
    textInverse: '#FFFFFF',
    textLink: '#1B5E20',

    // Overlay & Accents
    overlay: 'rgba(20, 35, 18, 0.65)',
    cardShadow: '#1B3015',
    offlineBadge: '#E0F2F1',
    offlineText: '#00695C',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },

  radius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 26,
    full: 9999,
  },

  typography: {
    fontSizes: {
      xs: 11,
      sm: 13,
      base: 15,
      md: 17,
      lg: 20,
      xl: 24,
      xxl: 28,
      title: 34,
    },
    lineHeights: {
      xs: 16,
      sm: 18,
      base: 22,
      md: 24,
      lg: 28,
      xl: 32,
      xxl: 36,
      title: 42,
    },
  },

  touchTarget: {
    minHeight: 56,
  },

  shadows: {
    soft: Platform.select({
      ios: {
        shadowColor: '#1A2E16',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      default: {
        shadowColor: '#1A2E16',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
    }),
    card: Platform.select({
      ios: {
        shadowColor: '#1A2E16',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.09,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      default: {
        shadowColor: '#1A2E16',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.09,
        shadowRadius: 12,
      },
    }),
    glow: Platform.select({
      ios: {
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
      default: {
        shadowColor: '#2E7D32',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 14,
      },
    }),
  },
};

export const Colors = {
  light: {
    text: Theme.colors.text,
    background: Theme.colors.background,
    tint: Theme.colors.primary,
    icon: Theme.colors.textSecondary,
    tabIconDefault: Theme.colors.textMuted,
    tabIconSelected: Theme.colors.primaryDark,
  },
  dark: {
    text: Theme.colors.text,
    background: Theme.colors.background,
    tint: Theme.colors.primary,
    icon: Theme.colors.textSecondary,
    tabIconDefault: Theme.colors.textMuted,
    tabIconSelected: Theme.colors.primaryDark,
  },
};
