import NetInfo from '@react-native-community/netinfo';

export const checkIsOnline = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return !!state.isConnected;
  } catch (e) {
    return false;
  }
};
