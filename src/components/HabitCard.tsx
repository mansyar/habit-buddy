import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './Themed';
import * as Icons from 'lucide-react-native';
import { Habit } from '../types/habit';
import { useRouter } from 'expo-router';
import { AppColors, getHabitColor } from '../theme/Colors';
import { ScaleButton } from './ScaleButton';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
}

export function HabitCard({ habit, isCompleted }: HabitCardProps) {
  const router = useRouter();
  const Icon = (Icons as any)[habit.iconName] || Icons.HelpCircle;
  const habitColor = getHabitColor(habit.id);

  const handlePress = () => {
    router.push(`/mission/${habit.id}`);
  };

  return (
    <ScaleButton
      testID={`habit-card-${habit.id}`}
      style={[styles.card, isCompleted && styles.completedCard]}
      onPress={handlePress}
      accessibilityLabel={`${habit.name}, ${habit.defaultDuration} minutes, ${
        isCompleted ? 'completed' : 'incomplete'
      }`}
      accessibilityRole="button"
      accessibilityHint={!isCompleted ? 'Tap to start this mission' : undefined}
    >
      <View style={[styles.leftAccent, { backgroundColor: habitColor }]} />

      <View style={[styles.iconArea, { backgroundColor: `${habitColor}1A` }]}>
        <Icon size={32} color={habitColor} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.habitName, isCompleted && styles.completedText]}>{habit.name}</Text>
        <Text style={styles.duration}>⏱ {habit.defaultDuration}:00</Text>
      </View>

      <View style={styles.statusContainer}>
        {isCompleted && <Icons.CheckCircle2 size={24} color={AppColors.dinoGreen} />}
      </View>
    </ScaleButton>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 96, // AppSizes.habitCardHeight
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.cardDark,
    borderRadius: 20, // AppRadius.xl
    overflow: 'hidden',
    paddingRight: 16,
    paddingVertical: 12, // Increased padding for scaling
  },
  completedCard: {
    opacity: 0.6,
  },
  leftAccent: {
    width: 4,
    height: '100%',
  },
  iconArea: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  infoContainer: {
    flex: 1,
  },
  habitName: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'FredokaOne_400Regular',
    color: AppColors.textPrimary,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  duration: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginTop: 4,
    fontFamily: 'Nunito_600SemiBold',
  },
  statusContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
