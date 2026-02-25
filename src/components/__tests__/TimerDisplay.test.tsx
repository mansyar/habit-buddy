import React from 'react';
import { render } from '@testing-library/react';
import { TimerDisplay } from '../TimerDisplay';
import { describe, it, expect, vi } from 'vitest';

// Svg components are mocked in vitest.setup.ts
describe('TimerDisplay', () => {
  it('renders time in MM:SS format', () => {
    const { getByText } = render(<TimerDisplay timeLeft={125} totalTime={180} />);
    expect(getByText('2:05')).toBeTruthy();
  });

  it('renders correctly with different sizes', () => {
    const { container } = render(<TimerDisplay timeLeft={60} totalTime={120} size={200} />);
    expect(container).toBeTruthy();
  });
});
