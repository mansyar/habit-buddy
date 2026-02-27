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
