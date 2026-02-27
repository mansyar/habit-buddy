import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { networkService } from '@/lib/network';
import { WifiOff } from 'lucide-react-native';

export const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(false);
  const translateY = useSharedValue(-100);

  useEffect(() => {
    // Initial check
    networkService.isOnline().then((online) => {
      setIsOffline(!online);
      translateY.value = online ? -100 : 0;
    });

    const unsubscribe = networkService.subscribeToConnectionChange((online) => {
      setIsOffline(!online);
      translateY.value = withTiming(online ? -100 : 0);
    });

    return () => unsubscribe();
  }, [translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  if (!isOffline && translateY.value === -100) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.content}>
        <WifiOff size={16} color="#fff" style={styles.icon} />
        <Text style={styles.text}>Offline Mode</Text>
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
    backgroundColor: '#ff4b4b', // Alert red
    zIndex: 1000,
    paddingTop: 40, // Safe area padding
    paddingBottom: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
