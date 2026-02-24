import { Habit } from '../types/habit';

export const CORE_HABITS: Habit[] = [
  {
    id: 'tooth-brushing',
    name: 'Tooth Brushing',
    iconName: 'Sparkles',
    themeColor: 'blue',
    defaultDuration: 2,
  },
  {
    id: 'meal-time',
    name: 'Meal Time',
    iconName: 'Utensils',
    themeColor: 'green',
    defaultDuration: 15,
  },
  {
    id: 'toy-cleanup',
    name: 'Toy Cleanup',
    iconName: 'Box',
    themeColor: 'yellow',
    defaultDuration: 5,
  },
];
