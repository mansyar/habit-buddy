import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AppColors } from '../theme/Colors';
import { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, message }) => {
  return (
    <View style={styles.container} testID="empty-state">
      <View style={styles.iconCircle}>
        <Icon size={48} color={AppColors.textMuted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AppColors.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: AppColors.elevated,
  },
  title: {
    fontSize: 24,
    color: AppColors.textPrimary,
    fontFamily: 'FredokaOne_400Regular',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: AppColors.textSecondary,
    fontFamily: 'Nunito_600SemiBold',
    textAlign: 'center',
    lineHeight: 24,
  },
});
