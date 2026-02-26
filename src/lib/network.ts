import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export class NetworkService {
  /**
   * Returns true if the device is currently online.
   */
  async isOnline(): Promise<boolean> {
    try {
      const state = await NetInfo.fetch();
      return !!state.isConnected;
    } catch (e) {
      console.error('Failed to fetch network state:', e);
      return false;
    }
  }

  /**
   * Subscribes to connection changes.
   * @param callback Function to call when connection status changes.
   * @returns Unsubscribe function.
   */
  subscribeToConnectionChange(callback: (isOnline: boolean) => void): () => void {
    return NetInfo.addEventListener((state: NetInfoState) => {
      callback(!!state.isConnected);
    });
  }
}

export const networkService = new NetworkService();

// Keep legacy export if any other part of the app uses it
export const checkIsOnline = async (): Promise<boolean> => {
  return networkService.isOnline();
};
