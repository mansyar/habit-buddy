export type HabitThemeColor = 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export interface Habit {
  id: string;
  name: string;
  iconName: string;
  themeColor: HabitThemeColor;
  defaultDuration: number; // in minutes
}
