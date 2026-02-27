import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './Themed';
import { Zap } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

interface BoltCounterProps {
  balance: number;
}

export function BoltCounter({ balance }: BoltCounterProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    // Bounce effect when balance changes
    scale.value = withSequence(
      withSpring(1.5, { damping: 10, stiffness: 100 }),
      withSpring(1, { damping: 10, stiffness: 100 }),
    );
  }, [balance, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconWrapper, animatedStyle]}>
        <Zap size={24} color="#FFD700" fill="#FFD700" />
      </Animated.View>
      <Text style={styles.balanceText}>{balance}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  iconWrapper: {
    marginRight: 6,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#B8860B', // Dark golden rod
    fontFamily: 'Fredoka-One',
  },
});
