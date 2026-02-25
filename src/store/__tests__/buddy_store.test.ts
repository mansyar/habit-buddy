import { useBuddyStore, BuddyState } from '../buddy_store';
import { describe, it, expect, beforeEach } from 'vitest';

describe('useBuddyStore', () => {
  beforeEach(() => {
    useBuddyStore.getState().reset();
  });

  it('initializes with idle state', () => {
    expect(useBuddyStore.getState().state).toBe('idle');
  });

  it('transitions from idle to active', () => {
    useBuddyStore.getState().startMission();
    expect(useBuddyStore.getState().state).toBe('active');
  });

  it('transitions between active and paused', () => {
    useBuddyStore.getState().startMission();

    useBuddyStore.getState().pauseMission();
    expect(useBuddyStore.getState().state).toBe('paused');

    useBuddyStore.getState().resumeMission();
    expect(useBuddyStore.getState().state).toBe('active');
  });

  it('transitions to success', () => {
    useBuddyStore.getState().startMission();
    useBuddyStore.getState().completeMission();
    expect(useBuddyStore.getState().state).toBe('success');
  });

  it('transitions to sleepy', () => {
    useBuddyStore.getState().startMission();
    useBuddyStore.getState().failMission();
    expect(useBuddyStore.getState().state).toBe('sleepy');
  });

  it('resets to idle', () => {
    useBuddyStore.getState().startMission();
    useBuddyStore.getState().completeMission();
    useBuddyStore.getState().reset();
    expect(useBuddyStore.getState().state).toBe('idle');
  });
});
