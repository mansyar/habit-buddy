import { expect, test, vi, describe, beforeEach } from 'vitest';
import { checkIsOnline } from '../network';
import NetInfo from '@react-native-community/netinfo';

// Mock NetInfo (already mocked in vitest.setup.ts, but we specialize here)
vi.mock('@react-native-community/netinfo', () => ({
  default: {
    fetch: vi.fn(),
  },
  fetch: vi.fn(),
}));

describe('Network Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should return true when connected', async () => {
    (NetInfo.fetch as any).mockResolvedValueOnce({ isConnected: true });
    const isOnline = await checkIsOnline();
    expect(isOnline).toBe(true);
  });

  test('should return false when disconnected', async () => {
    (NetInfo.fetch as any).mockResolvedValueOnce({ isConnected: false });
    const isOnline = await checkIsOnline();
    expect(isOnline).toBe(false);
  });

  test('should return false on fetch error', async () => {
    (NetInfo.fetch as any).mockRejectedValueOnce(new Error('Network error'));
    const isOnline = await checkIsOnline();
    expect(isOnline).toBe(false);
  });
});
