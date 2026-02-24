import React from 'react';
import { render } from '@testing-library/react';
import { BoltCounter } from '../BoltCounter';

// Mock Lucide icons
vi.mock('lucide-react-native', () => ({
  Zap: 'ZapIcon',
}));

// Mock Reanimated
vi.mock('react-native-reanimated', () => {
  return {
    default: {
      View: ({ children, style }: any) => <div style={style}>{children}</div>,
    },
    useSharedValue: vi.fn(() => ({ value: 0 })),
    useAnimatedStyle: vi.fn(() => ({})),
    withSpring: vi.fn((val) => val),
    withSequence: vi.fn((...vals) => vals[0]),
  };
});

vi.mock('../useColorScheme', () => ({
  useColorScheme: vi.fn(() => 'light'),
}));

describe('BoltCounter', () => {
  it('renders correctly with given balance', () => {
    const { getByText } = render(<BoltCounter balance={125} />);
    expect(getByText('125')).toBeTruthy();
  });
});
