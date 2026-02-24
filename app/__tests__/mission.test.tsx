import React from 'react';
import { render } from '@testing-library/react';
import MissionScreen from '../mission/[id]';
import { useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../src/store/auth_store';

// Mock expo-router
vi.mock('expo-router', () => ({
  useLocalSearchParams: vi.fn(() => ({ id: 'brush_teeth' })),
  useRouter: vi.fn(() => ({
    replace: vi.fn(),
    back: vi.fn(),
  })),
}));

// Mock AuthStore
vi.mock('../../src/store/auth_store', () => ({
  useAuthStore: vi.fn(() => ({
    profile: { selected_buddy: 'dino' },
  })),
}));

describe('MissionScreen', () => {
  test('renders buddy area and controls area with correct layout', () => {
    const { getByTestId } = render(<MissionScreen />);

    expect(getByTestId('buddy-area')).toBeTruthy();
    expect(getByTestId('controls-area')).toBeTruthy();
  });

  test('displays the correct buddy based on profile', () => {
    const { getByText } = render(<MissionScreen />);
    expect(getByText('🦖')).toBeTruthy(); // Placeholder for Dino
  });

  test('displays mission name based on id param', () => {
    const { getByText } = render(<MissionScreen />);
    expect(getByText('Brushing teeth')).toBeTruthy(); // Assuming 'brush_teeth' translates to this
  });
});
