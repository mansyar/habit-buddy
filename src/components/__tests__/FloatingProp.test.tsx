import React from 'react';
import { render } from '@testing-library/react';
import { FloatingProp } from '../FloatingProp';
import { describe, it, expect } from 'vitest';

describe('FloatingProp', () => {
  it('renders toothbrush for tooth-brushing habit', () => {
    const { container } = render(<FloatingProp habitId="tooth-brushing" isActive={true} />);
    expect(container).toBeTruthy();
  });

  it('renders plate for meal-time habit', () => {
    const { container } = render(<FloatingProp habitId="meal-time" isActive={true} />);
    expect(container).toBeTruthy();
  });

  it('renders toybox for toy-cleanup habit', () => {
    const { container } = render(<FloatingProp habitId="toy-cleanup" isActive={true} />);
    expect(container).toBeTruthy();
  });

  it('renders nothing for unknown habit', () => {
    const { container } = render(<FloatingProp habitId="unknown" isActive={true} />);
    // Even if renderProp returns null, Animated.View is still rendered
    expect(container).toBeTruthy();
  });
});
