// Modern Study App Theme - Inspired by Notion & Linear
export const colors = {
  // Primary palette - Deep indigo with vibrant accents
  primary: '#5B5FC7',
  primaryLight: '#7C7FD9',
  primaryDark: '#4547A9',
  primaryMuted: 'rgba(91, 95, 199, 0.12)',
  
  // Accent colors for different features
  accent: {
    blue: '#2D9CDB',
    green: '#27AE60',
    orange: '#F2994A',
    pink: '#EB5757',
    purple: '#9B51E0',
    teal: '#00B5AD',
  },
  
  // Backgrounds
  background: '#FAFBFC',
  surface: '#FFFFFF',
  surfaceHover: '#F7F8FA',
  elevated: '#FFFFFF',
  
  // Text hierarchy
  text: '#1A1D26',
  textSecondary: '#5E6278',
  textTertiary: '#9CA3AF',
  textMuted: '#C4C9D4',
  textInverse: '#FFFFFF',
  
  // Borders & Dividers
  border: '#E8ECF0',
  borderLight: '#F1F3F5',
  divider: '#EBEEF2',
  
  // Semantic colors
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.12)',
  warning: '#F59E0B',
  warningLight: 'rgba(245, 158, 11, 0.12)',
  error: '#EF4444',
  errorLight: 'rgba(239, 68, 68, 0.12)',
  info: '#3B82F6',
  infoLight: 'rgba(59, 130, 246, 0.12)',
  
  // Folder colors - Softer, more refined
  folderColors: [
    '#5B5FC7', // Primary indigo
    '#7C3AED', // Violet
    '#EC4899', // Pink
    '#F43F5E', // Rose
    '#F97316', // Orange
    '#EAB308', // Yellow
    '#10B981', // Emerald
    '#14B8A6', // Teal
    '#0EA5E9', // Sky
    '#6366F1', // Indigo
  ],
  
  // Gradients
  gradients: {
    primary: ['#5B5FC7', '#7C3AED'],
    success: ['#10B981', '#059669'],
    warm: ['#F97316', '#EAB308'],
    cool: ['#0EA5E9', '#6366F1'],
  },
  
  // Shadows (for reference)
  shadow: {
    sm: 'rgba(0, 0, 0, 0.04)',
    md: 'rgba(0, 0, 0, 0.08)',
    lg: 'rgba(0, 0, 0, 0.12)',
  },
}

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
}

export const fontSize = {
  xxs: 10,
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
}

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
}

export const borderRadius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  full: 9999,
}

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
}
