import { renderHook, act } from '@testing-library/react';
import { useMissionTimer } from '../useMissionTimer';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('useMissionTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with default duration', () => {
    const { result } = renderHook(() => useMissionTimer(2)); // 2 minutes
    expect(result.current.timeLeft).toBe(120);
    expect(result.current.isActive).toBe(false);
  });

  it('starts and stops the timer', () => {
    const { result } = renderHook(() => useMissionTimer(1)); // 1 minute

    act(() => {
      result.current.start();
    });
    expect(result.current.isActive).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.timeLeft).toBe(59);

    act(() => {
      result.current.stop();
    });
    expect(result.current.isActive).toBe(false);
    expect(result.current.timeLeft).toBe(59);
  });

  it('adjusts time by increment/decrement', () => {
    const { result } = renderHook(() => useMissionTimer(2)); // 120s

    act(() => {
      result.current.adjustTime(30);
    });
    expect(result.current.timeLeft).toBe(150);

    act(() => {
      result.current.adjustTime(-30);
    });
    expect(result.current.timeLeft).toBe(120);
  });

  it('does not go below zero', () => {
    const { result } = renderHook(() => useMissionTimer(0.5)); // 30s

    act(() => {
      result.current.adjustTime(-60);
    });
    expect(result.current.timeLeft).toBe(0);
  });

  it('calls onComplete when timer reaches zero', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useMissionTimer(1, onComplete));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(result.current.timeLeft).toBe(0);
    expect(result.current.isActive).toBe(false);
    expect(onComplete).toHaveBeenCalled();
  });
});
