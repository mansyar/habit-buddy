import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { networkService } from '@/lib/network';
import { syncService } from '@/lib/sync_service';
import { WifiOff, RefreshCcw, AlertCircle } from 'lucide-react-native';

export const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [hasSyncError, setHasSyncError] = useState(false);
  const translateY = useSharedValue(-100);

  useEffect(() => {
    // Initial checks
    networkService.isOnline().then((online) => {
      const offline = !online;
      const syncErr = networkService.getHasSyncError();
      setIsOffline(offline);
      setHasSyncError(syncErr);
      translateY.value = offline || syncErr ? 0 : -100;
    });

    const unsubOnline = networkService.subscribeToConnectionChange((online) => {
      const offline = !online;
      setIsOffline(offline);
      updateVisibility(offline, hasSyncError);
    });

    const unsubSync = networkService.subscribeToSyncError((hasErr) => {
      setHasSyncError(hasErr);
      updateVisibility(isOffline, hasErr);
    });

    return () => {
      unsubOnline();
      unsubSync();
    };
  }, [translateY, isOffline, hasSyncError]);

  const updateVisibility = (offline: boolean, syncErr: boolean) => {
    translateY.value = withTiming(offline || syncErr ? 0 : -100);
  };

  const handleRetry = () => {
    syncService.processQueue();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const showBanner = isOffline || hasSyncError;
  if (!showBanner && translateY.value === -100) return null;

  return (
    <Animated.View
      style={[styles.container, animatedStyle, hasSyncError && !isOffline && styles.errorBg]}
    >
      <View style={styles.content}>
        {isOffline ? (
          <>
            <WifiOff size={16} color="#fff" style={styles.icon} />
            <Text style={styles.text}>Offline Mode</Text>
          </>
        ) : (
          <>
            <AlertCircle size={16} color="#fff" style={styles.icon} />
            <Text style={styles.text}>Syncing failed</Text>
            <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
              <RefreshCcw size={14} color="#fff" style={styles.iconSmall} />
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#666', // Neutral dark for offline
    zIndex: 1000,
    paddingTop: 45, // Safe area padding
    paddingBottom: 10,
  },
  errorBg: {
    backgroundColor: '#ff4b4b', // Alert red for sync errors
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  iconSmall: {
    marginRight: 4,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 15,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});
