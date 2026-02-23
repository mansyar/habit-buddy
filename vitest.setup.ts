import { vi } from 'vitest';

// Add any global mocks here
vi.mock('expo-font', () => ({
  loadAsync: vi.fn(),
  isLoaded: vi.fn(() => true),
}));
