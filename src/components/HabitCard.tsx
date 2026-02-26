import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text } from './Themed';
import * as Icons from 'lucide-react-native';
import { Habit } from '../types/habit';
import { useRouter } from 'expo-router';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
}

export function HabitCard({ habit, isCompleted }: HabitCardProps) {
  const router = useRouter();
  const Icon = (Icons as any)[habit.iconName] || Icons.HelpCircle;

  const handlePress = () => {
    router.push(`/mission/${habit.id}`);
  };

  return (
    <TouchableOpacity
      testID={`habit-card-${habit.id}`}
      style={[
        styles.card,
        { backgroundColor: isCompleted ? '#E0E0E0' : '#FFFFFF' },
        (styles as any)[
          `border${habit.themeColor.charAt(0).toUpperCase() + habit.themeColor.slice(1)}`
        ],
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: getThemeLightColor(habit.themeColor) }]}
      >
        <Icon size={32} color={getThemeDarkColor(habit.themeColor)} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.habitName}>{habit.name}</Text>
        <Text style={styles.duration}>{habit.defaultDuration} min</Text>
      </View>

      <View style={styles.statusContainer}>
        {isCompleted ? (
          <View style={styles.statusBadge}>
            <Icons.CheckCircle2 size={16} color="#4CAF50" />
            <Text style={[styles.statusText, { color: '#4CAF50' }]}>Done!</Text>
          </View>
        ) : (
          <Text style={styles.statusTextNotDone}>Not Done</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function getThemeLightColor(color: string) {
  switch (color) {
    case 'blue':
      return '#E3F2FD';
    case 'green':
      return '#E8F5E9';
    case 'yellow':
      return '#FFFDE7';
    case 'purple':
      return '#F3E5F5';
    case 'orange':
      return '#FFF3E0';
    default:
      return '#F5F5F5';
  }
}

function getThemeDarkColor(color: string) {
  switch (color) {
    case 'blue':
      return '#2196F3';
    case 'green':
      return '#4CAF50';
    case 'yellow':
      return '#FBC02D';
    case 'purple':
      return '#9C27B0';
    case 'orange':
      return '#FF9800';
    default:
      return '#757575';
  }
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  borderBlue: { borderColor: '#BBDEFB' },
  borderGreen: { borderColor: '#C8E6C9' },
  borderYellow: { borderColor: '#FFF9C4' },
  borderPurple: { borderColor: '#E1BEE7' },
  borderOrange: { borderColor: '#FFE0B2' },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Fredoka-One', // Fallback handled by theme if font not loaded
    color: '#333',
  },
  duration: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  statusTextNotDone: {
    fontSize: 12,
    color: '#BDBDBD',
    fontWeight: '600',
  },
});
