import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { HabitCard } from '../HabitCard';
import { routerMock } from '../../../vitest.setup';
import { CORE_HABITS } from '../../constants/habits';

// Mock Lucide icons
vi.mock('lucide-react-native', () => ({
  Sparkles: 'SparklesIcon',
  Utensils: 'UtensilsIcon',
  Box: 'BoxIcon',
  CheckCircle2: 'CheckIcon',
  HelpCircle: 'HelpCircleIcon',
}));

vi.mock('../useColorScheme', () => ({
  useColorScheme: vi.fn(() => 'light'),
}));

describe('HabitCard', () => {
  const mockHabit = CORE_HABITS[0]; // Tooth Brushing

  it('renders habit details correctly', () => {
    const { getByText } = render(<HabitCard habit={mockHabit} isCompleted={false} />);

    expect(getByText('Tooth Brushing')).toBeTruthy();
    expect(getByText('2 min')).toBeTruthy();
    expect(getByText('Not Done')).toBeTruthy();
  });

  it('shows completion status when completed', () => {
    const { getByText } = render(<HabitCard habit={mockHabit} isCompleted={true} />);

    expect(getByText('Done!')).toBeTruthy();
  });

  it('navigates to the habit mission on press', () => {
    const { getByTestId } = render(<HabitCard habit={mockHabit} isCompleted={false} />);

    const card = getByTestId(`habit-card-${mockHabit.id}`);
    fireEvent.click(card);

    expect(routerMock.push).toHaveBeenCalledWith(`/mission/${mockHabit.id}`);
  });
});
