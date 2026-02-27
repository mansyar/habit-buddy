export const AppColors = {
  // Backgrounds
  deepIndigo: '#1A1A2E',
  nightPurple: '#16213E',

  // Surfaces
  cardDark: '#2A2A4A',
  cardMedium: '#3A3A5C',
  elevated: '#4A4A6A',

  // Accents
  dinoGreen: '#4ADE80',
  missionOrange: '#FB923C',
  rewardGold: '#FBBF24',
  sleepyBlue: '#60A5FA',

  // Status
  success: '#22C55E',
  warning: '#EAB308',
  error: '#EF4444',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',
};

// Legacy Expo format compatibility
export const Colors = {
  light: {
    text: AppColors.textPrimary,
    background: AppColors.deepIndigo,
    tint: AppColors.dinoGreen,
    tabIconDefault: AppColors.textMuted,
    tabIconSelected: AppColors.dinoGreen,
  },
  dark: {
    text: AppColors.textPrimary,
    background: AppColors.deepIndigo,
    tint: AppColors.dinoGreen,
    tabIconDefault: AppColors.textMuted,
    tabIconSelected: AppColors.dinoGreen,
  },
};
