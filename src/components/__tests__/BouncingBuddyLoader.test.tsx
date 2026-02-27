import React from 'react';
import { render } from '@testing-library/react';
import { BouncingBuddyLoader } from '../BouncingBuddyLoader';
import { describe, it, expect } from 'vitest';

describe('BouncingBuddyLoader', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<BouncingBuddyLoader />);
    expect(getByTestId('bouncing-buddy-loader')).toBeTruthy();
  });
});
