import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const NUM_PARTICLES = 30;

const Particle = ({ delay }: { delay: number }) => {
  const progress = useSharedValue(0);
  const randomX = Math.random() * SCREEN_WIDTH;
  const randomRotation = Math.random() * 360;
  const randomColor = ['#FFD700', '#FF5252', '#2196F3', '#4CAF50', '#E91E63'][
    Math.floor(Math.random() * 5)
  ];

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration: 2000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [-50, SCREEN_HEIGHT]);
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [randomX, randomX + (Math.random() - 0.5) * 100],
    );
    const rotate = interpolate(progress.value, [0, 1], [0, randomRotation]);
    const opacity = interpolate(progress.value, [0, 0.8, 1], [1, 1, 0]);

    return {
      transform: [{ translateY }, { translateX }, { rotate: `${rotate}deg` }],
      opacity,
      backgroundColor: randomColor,
    };
  });

  return <Animated.View style={[styles.particle, animatedStyle]} />;
};

export const Confetti: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {[...Array(NUM_PARTICLES)].map((_, i) => (
        <Particle key={i} delay={i * 100} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    width: 10,
    height: 10,
    position: 'absolute',
    borderRadius: 2,
  },
});
