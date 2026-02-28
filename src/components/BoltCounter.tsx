import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './Themed';
import { Zap } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { AppColors } from '../theme/Colors';
import { accessibilityHelper } from '../lib/accessibility_helper';

interface BoltCounterProps {
  balance: number;
}

export function BoltCounter({ balance }: BoltCounterProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const [displayBalance, setDisplayBalance] = useState(balance);
  const prevBalance = useRef(balance);

  useEffect(() => {
    if (balance !== prevBalance.current) {
      // 1. Icon bounce
      scale.value = withSequence(
        withSpring(1.5, { damping: 10, stiffness: 100 }),
        withSpring(1, { damping: 10, stiffness: 100 }),
      );

      // 2. Number slide animation
      const direction = balance > prevBalance.current ? -1 : 1;

      // Slide out current
      translateY.value = withTiming(direction * 20, { duration: 200 }, () => {
        // Change number while hidden/offset
        translateY.value = -direction * 20;
        opacity.value = 0;

        // Use a small delay before showing new number
        // (Actually setting state in callback needs careful handling in JS)
      });

      // Update the displayed balance
      setTimeout(() => {
        setDisplayBalance(balance);
        accessibilityHelper.announceBolts(balance);
        opacity.value = withTiming(1, { duration: 200 });
        translateY.value = withSpring(0, { damping: 12 });
      }, 250);

      prevBalance.current = balance;
    }
  }, [balance, scale, opacity, translateY]);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconWrapper, iconAnimatedStyle]}>
        <Zap size={20} color={AppColors.rewardGold} fill={AppColors.rewardGold} />
      </Animated.View>
      <Animated.View style={textAnimatedStyle}>
        <Text style={styles.balanceText}>{displayBalance}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${AppColors.rewardGold}1A`, // 10% opacity as per guide update
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.rewardGold,
    minHeight: 36, // As per AppSizes.boltCounterHeight
  },
  iconWrapper: {
    marginRight: 6,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.rewardGold,
    fontFamily: 'FredokaOne_400Regular',
  },
});
