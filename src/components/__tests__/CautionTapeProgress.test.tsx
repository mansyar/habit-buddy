import React from 'react';
import { render } from '@testing-library/react';
import { CautionTapeProgress } from '../CautionTapeProgress';

// Mock react-native-svg
vi.mock('react-native-svg', () => ({
  Svg: ({ children }: any) => <div>{children}</div>,
  Rect: () => <div />,
  Defs: ({ children }: any) => <div>{children}</div>,
  Pattern: ({ children }: any) => <div>{children}</div>,
  Path: () => <div />,
}));

// Mock Reanimated
vi.mock('react-native-reanimated', () => {
  return {
    default: {
      View: ({ children, style }: any) => <div style={style}>{children}</div>,
    },
    useSharedValue: vi.fn(() => ({ value: 0 })),
    useAnimatedStyle: vi.fn(() => ({})),
    withRepeat: vi.fn((val) => val),
    withTiming: vi.fn((val) => val),
    Easing: {
      linear: vi.fn(),
    },
  };
});

vi.mock('../useColorScheme', () => ({
  useColorScheme: vi.fn(() => 'light'),
}));

describe('CautionTapeProgress', () => {
  it('renders correctly with 0 percent', () => {
    const { getByTestId } = render(<CautionTapeProgress progress={0} />);
    expect(getByTestId('caution-tape-container')).toBeTruthy();
  });

  it('renders correctly with 50 percent', () => {
    const { getByTestId } = render(<CautionTapeProgress progress={50} />);
    expect(getByTestId('caution-tape-fill')).toBeTruthy();
  });
});
