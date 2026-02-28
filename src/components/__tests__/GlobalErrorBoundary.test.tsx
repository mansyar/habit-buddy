import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('resets the error when the Try Again button is pressed', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
      if (shouldThrow) throw new Error('Test Error');
      return <div>Recovered Content</div>;
    };

    const { rerender } = render(
      <GlobalErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </GlobalErrorBoundary>,
    );

    expect(screen.getByText(/Something went wrong/i)).toBeTruthy();

    // Now make it safe and trigger reset
    rerender(
      <GlobalErrorBoundary>
        <BuggyComponent shouldThrow={false} />
      </GlobalErrorBoundary>,
    );

    const tryAgainButton = screen.getByRole('button');
    fireEvent.click(tryAgainButton);

    expect(screen.getByText('Recovered Content')).toBeTruthy();
    expect(screen.queryByText(/Something went wrong/i)).toBeNull();

    spy.mockRestore();
  });
});
