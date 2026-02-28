import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { Dino } from './buddies/Dino';
import { Bear } from './buddies/Bear';
import { BuddyState } from '../store/buddy_store';

interface BuddyAnimationProps {
  buddy: 'dino' | 'bear';
  state: BuddyState;
  size?: number;
}

export const BuddyAnimation: React.FC<BuddyAnimationProps> = ({ buddy, state, size = 200 }) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Reset animations
    cancelAnimation(translateY);
    cancelAnimation(scale);
    cancelAnimation(rotate);
    translateY.value = 0;
    scale.value = 1;
    rotate.value = 0;

    switch (state) {
      case 'idle':
        // Gentle float
        translateY.value = withRepeat(
          withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          -1,
          true,
        );
        break;
      case 'active':
        // Enthusiastic bounce
        translateY.value = withRepeat(
          withSequence(
            withTiming(-20, { duration: 500, easing: Easing.out(Easing.quad) }),
            withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) }),
          ),
          -1,
          true,
        );
        scale.value = withRepeat(withTiming(1.05, { duration: 500 }), -1, true);
        break;
      case 'paused':
        // Slight sway
        rotate.value = withRepeat(withTiming(5, { duration: 1500 }), -1, true);
        break;
      case 'success':
        // Big jumps
        translateY.value = withRepeat(withSequence(withSpring(-50), withSpring(0)), -1, true);
        scale.value = withSequence(
          withTiming(1.2, { duration: 200 }),
          withTiming(1, { duration: 200 }),
        );
        break;
      case 'sleepy':
        // Drooping scale and slow sway
        scale.value = withTiming(0.9, { duration: 1000 });
        rotate.value = withRepeat(withTiming(10, { duration: 3000 }), -1, true);
        translateY.value = withTiming(10, { duration: 1000 });
        break;
    }
  }, [state, translateY, scale, rotate]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  return (
    <Animated.View testID="buddy-animation" style={animatedStyle}>
      {buddy === 'dino' ? (
        <Dino size={size} />
      ) : buddy === 'bear' ? (
        <Bear size={size} />
      ) : (
        <Dino size={size} /> // Fallback to Dino
      )}
    </Animated.View>
  );
};
