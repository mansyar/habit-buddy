import { create } from 'zustand';

export type BuddyState = 'idle' | 'active' | 'paused' | 'success' | 'sleepy';

interface BuddyStore {
  state: BuddyState;
  selectedBuddy: string;
  startMission: () => void;
  pauseMission: () => void;
  resumeMission: () => void;
  completeMission: () => void;
  failMission: () => void;
  reset: () => void;
}

export const useBuddyStore = create<BuddyStore>((set) => ({
  state: 'idle',
  selectedBuddy: 'dino',
  startMission: () => set({ state: 'active' }),
  pauseMission: () => set({ state: 'paused' }),
  resumeMission: () => set({ state: 'active' }),
  completeMission: () => set({ state: 'success' }),
  failMission: () => set({ state: 'sleepy' }),
  reset: () => set({ state: 'idle' }),
}));
