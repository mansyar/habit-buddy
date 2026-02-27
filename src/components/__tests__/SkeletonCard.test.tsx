import React from 'react';
import { render } from '@testing-library/react';
import { SkeletonCard } from '../SkeletonCard';
import { describe, it, expect } from 'vitest';

describe('SkeletonCard', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<SkeletonCard />);
    expect(getByTestId('skeleton-card')).toBeTruthy();
  });
});
