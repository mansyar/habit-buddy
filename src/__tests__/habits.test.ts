import { describe, it, expect } from 'vitest';
import { CORE_HABITS } from '../constants/habits';
import { Habit } from '../types/habit';

describe('Habit Definitions', () => {
  it('should have exactly 3 core habits', () => {
    expect(CORE_HABITS).toHaveLength(3);
  });

  it('should define Tooth Brushing correctly', () => {
    const toothBrushing = CORE_HABITS.find((h) => h.id === 'tooth-brushing');
    expect(toothBrushing).toBeDefined();
    expect(toothBrushing?.name).toBe('Tooth Brushing');
    expect(toothBrushing?.iconName).toBe('Sparkles');
    expect(toothBrushing?.themeColor).toBe('blue');
    expect(toothBrushing?.defaultDuration).toBe(2);
  });

  it('should define Meal Time correctly', () => {
    const mealTime = CORE_HABITS.find((h) => h.id === 'meal-time');
    expect(mealTime).toBeDefined();
    expect(mealTime?.name).toBe('Meal Time');
    expect(mealTime?.iconName).toBe('Utensils');
    expect(mealTime?.themeColor).toBe('green');
    expect(mealTime?.defaultDuration).toBe(15);
  });

  it('should define Toy Cleanup correctly', () => {
    const toyCleanup = CORE_HABITS.find((h) => h.id === 'toy-cleanup');
    expect(toyCleanup).toBeDefined();
    expect(toyCleanup?.name).toBe('Toy Cleanup');
    expect(toyCleanup?.iconName).toBe('Box');
    expect(toyCleanup?.themeColor).toBe('yellow');
    expect(toyCleanup?.defaultDuration).toBe(5);
  });
});
