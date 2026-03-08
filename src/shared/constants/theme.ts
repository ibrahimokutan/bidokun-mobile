export const colors = {
    primary: '#136dec',
    backgroundLight: '#f6f7f8',
    backgroundDark: '#101822',
    textDark: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
    white: '#ffffff',
} as const;

export const fontFamily = {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
} as const;

export const borderRadius = {
    sm: 4,   // 0.25rem
    md: 8,   // 0.5rem
    lg: 12,  // 0.75rem
    full: 9999,
} as const;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    statusBar: 48, // pt-12
} as const;
