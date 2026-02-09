export const colors = {
    primary: '#1A237E', // Deep Midnight Blue
    secondary: '#FFD700', // Gold/Bronze
    background: '#F5F5F5', // Off-White
    surface: '#FFFFFF', // Pure White
    text: {
        primary: '#212121', // Black/Dark Grey
        secondary: '#757575', // Grey
        disabled: '#BDBDBD', // Light Grey
    },
    accent: '#C2185B', // Deep Pink/Red for recording
    success: '#4CAF50',
    error: '#F44336',
    border: '#E0E0E0',
};

export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.text.primary,
        fontFamily: 'System', // Use custom font later
    },
    h2: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.text.primary,
    },
    body: {
        fontSize: 16,
        color: colors.text.primary,
        lineHeight: 24,
    },
    caption: {
        fontSize: 12,
        color: colors.text.secondary,
    },
    button: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.surface,
    },
};
