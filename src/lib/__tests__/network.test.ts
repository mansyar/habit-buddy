import { describe, it, expect, vi, beforeEach } from 'vitest';
import NetInfo from '@react-native-community/netinfo';
import { networkService } from '../network';

describe('NetworkService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isOnline', () => {
    it('should return true when connected', async () => {
      vi.mocked(NetInfo.fetch).mockResolvedValueOnce({
        isConnected: true,
        isInternetReachable: true,
        type: 'wifi',
        details: { isConnectionExpensive: false },
      } as any);

      const online = await networkService.isOnline();
      expect(online).toBe(true);
      expect(NetInfo.fetch).toHaveBeenCalled();
    });

    it('should return false when disconnected', async () => {
      vi.mocked(NetInfo.fetch).mockResolvedValueOnce({
        isConnected: false,
        isInternetReachable: false,
        type: 'none',
        details: null,
      } as any);

      const online = await networkService.isOnline();
      expect(online).toBe(false);
    });

    it('should return false when isConnected is null', async () => {
      vi.mocked(NetInfo.fetch).mockResolvedValueOnce({
        isConnected: null,
        isInternetReachable: null,
        type: 'unknown',
        details: null,
      } as any);

      const online = await networkService.isOnline();
      expect(online).toBe(false);
    });

    it('should return false when fetch throws', async () => {
      vi.mocked(NetInfo.fetch).mockRejectedValueOnce(new Error('Network error'));

      const online = await networkService.isOnline();
      expect(online).toBe(false);
    });
  });

  describe('subscribeToConnectionChange', () => {
    it('should call NetInfo.addEventListener', () => {
      const callback = vi.fn();
      networkService.subscribeToConnectionChange(callback);
      expect(NetInfo.addEventListener).toHaveBeenCalled();
    });

    it('should invoke callback with boolean when status changes', () => {
      const callback = vi.fn();
      let listener: (state: any) => void = () => {};

      vi.mocked(NetInfo.addEventListener).mockImplementationOnce((cb: any) => {
        listener = cb;
        return () => {};
      });

      networkService.subscribeToConnectionChange(callback);

      // Simulate connection change to offline
      listener({ isConnected: false });
      expect(callback).toHaveBeenCalledWith(false);

      // Simulate connection change to online
      listener({ isConnected: true });
      expect(callback).toHaveBeenCalledWith(true);
    });

    it('should return an unsubscribe function', () => {
      const unsubscribeMock = vi.fn();
      vi.mocked(NetInfo.addEventListener).mockReturnValueOnce(unsubscribeMock as any);

      const unsubscribe = networkService.subscribeToConnectionChange(vi.fn());
      unsubscribe();
      expect(unsubscribeMock).toHaveBeenCalled();
    });
  });
});
