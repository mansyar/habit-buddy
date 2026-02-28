import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { GlobalErrorBoundary } from '../GlobalErrorBoundary';

const ThrowError = () => {
  throw new Error('Test Error');
};

describe('GlobalErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <GlobalErrorBoundary>
        <div>Safe Content</div>
      </GlobalErrorBoundary>,
    );

    expect(screen.getByText('Safe Content')).toBeTruthy();
  });

  it('renders the fallback UI when an error occurs', () => {
    // Suppress console.error for expected test error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <GlobalErrorBoundary>
        <ThrowError />
      </GlobalErrorBoundary>,
    );

    expect(screen.getByText(/Something went wrong/i)).toBeTruthy();
    expect(screen.getByText(/Oops! Your Buddy ran into a little trouble/i)).toBeTruthy();

    spy.mockRestore();
  });
});
