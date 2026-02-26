import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { ParentalGate } from '../ParentalGate';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ParentalGate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not trigger onSuccess before 3 seconds', () => {
    const onSuccess = vi.fn();
    const { getByText } = render(
      <ParentalGate onSuccess={onSuccess}>
        <span>Parent Only</span>
      </ParentalGate>,
    );

    const button = getByText('Parent Only');

    // Start pressing (mouseDown in web mock)
    fireEvent.mouseDown(button);

    // Advance 2 seconds
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onSuccess).not.toHaveBeenCalled();

    // Release early
    fireEvent.mouseUp(button);

    // Advance 2 more seconds
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should trigger onSuccess after 3 seconds of continuous press', () => {
    const onSuccess = vi.fn();
    const { getByText } = render(
      <ParentalGate onSuccess={onSuccess}>
        <span>Parent Only</span>
      </ParentalGate>,
    );

    const button = getByText('Parent Only');

    // Start pressing
    fireEvent.mouseDown(button);

    // Advance 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);

    // Release
    fireEvent.mouseUp(button);
  });
});
