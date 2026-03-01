import React from 'react';
import { render, act } from '@testing-library/react';
import { BoltCounter } from '../BoltCounter';
import { vi, describe, it, expect } from 'vitest';

// Mock Reanimated
vi.mock('react-native-reanimated', () => {
  return {
    default: {
      View: ({ children, style }: any) => <div style={style}>{children}</div>,
    },
    useSharedValue: vi.fn((initial) => ({ value: initial })),
    useAnimatedStyle: vi.fn(() => ({})),
    withSpring: vi.fn((val) => val),
    withSequence: vi.fn((...vals) => vals[0]),
    withTiming: vi.fn((val) => val),
  };
});

vi.mock('../useColorScheme', () => ({
  useColorScheme: vi.fn(() => 'light'),
}));

vi.mock('../../lib/accessibility_helper', () => ({
  accessibilityHelper: {
    announceBolts: vi.fn(),
  },
}));

describe('BoltCounter', () => {
  it('renders correctly with given balance', () => {
    const { getByText } = render(<BoltCounter balance={125} />);
    expect(getByText('125')).toBeTruthy();
  });

  it('updates display balance after a delay when balance prop changes', async () => {
    vi.useFakeTimers();
    const { getByText, rerender } = render(<BoltCounter balance={100} />);

    expect(getByText('100')).toBeTruthy();

    // Change balance
    rerender(<BoltCounter balance={150} />);

    // Balance should still be 100 before timeout
    expect(getByText('100')).toBeTruthy();

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(getByText('150')).toBeTruthy();
    vi.useRealTimers();
  });

  it('handles balance decrease', async () => {
    vi.useFakeTimers();
    const { getByText, rerender } = render(<BoltCounter balance={100} />);

    rerender(<BoltCounter balance={80} />);

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(getByText('80')).toBeTruthy();
    vi.useRealTimers();
  });
});
