import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { Toothbrush } from './props/Toothbrush';
import { Plate } from './props/Plate';
import { ToyBox } from './props/ToyBox';

interface FloatingPropProps {
  habitId: string;
  isActive: boolean;
  size?: number;
}

export const FloatingProp: React.FC<FloatingPropProps> = ({ habitId, isActive, size = 60 }) => {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      opacity.value = withTiming(1, { duration: 500 });
      // Float and rotate animation
      translateY.value = withRepeat(
        withSequence(
          withTiming(-15, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
      rotate.value = withRepeat(
        withSequence(
          withTiming(15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(-15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    } else {
      opacity.value = withTiming(0, { duration: 500 });
      cancelAnimation(translateY);
      cancelAnimation(rotate);
    }
  }, [isActive, opacity, rotate, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }, { rotate: `${rotate.value}deg` }],
      position: 'absolute',
      top: 20,
      right: 40,
    };
  });

  const renderProp = () => {
    switch (habitId) {
      case 'tooth-brushing':
        return <Toothbrush size={size} />;
      case 'meal-time':
        return <Plate size={size} />;
      case 'toy-cleanup':
        return <ToyBox size={size} />;
      default:
        return null;
    }
  };

  return <Animated.View style={animatedStyle}>{renderProp()}</Animated.View>;
};
