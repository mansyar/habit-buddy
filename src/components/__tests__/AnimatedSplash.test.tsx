import React from 'react';
import { render } from '@testing-library/react';
import { AnimatedSplash } from '../AnimatedSplash';
import { describe, it, expect } from 'vitest';

describe('AnimatedSplash', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<AnimatedSplash onFinish={() => {}} />);
    expect(getByTestId('animated-splash')).toBeTruthy();
  });

  it('renders the logo image', () => {
    const { getByTestId } = render(<AnimatedSplash onFinish={() => {}} />);
    expect(getByTestId('splash-logo')).toBeTruthy();
  });
});
