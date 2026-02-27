import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  withDelay,
} from 'react-native-reanimated';
import { AppColors } from '../theme/Colors';
import { BuddyAnimation } from './BuddyAnimation';

interface Props {
  onFinish: () => void;
}

export const AnimatedSplash: React.FC<Props> = ({ onFinish }) => {
  const containerOpacity = useSharedValue(1);
  const logoScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);

  useEffect(() => {
    // 1. Logo pop in
    logoScale.value = withSpring(1, { damping: 12 });

    // 2. Title fade in after logo
    titleOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
    titleTranslateY.value = withDelay(500, withSpring(0));

    // 3. Stay for a while then fade out entire screen
    // Total duration ~2.5s to ensure requirements are met
    const timer = setTimeout(() => {
      containerOpacity.value = withTiming(0, { duration: 500 }, () => {
        runOnJS(onFinish)();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish, logoScale, titleOpacity, titleTranslateY, containerOpacity]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]} testID="animated-splash">
      <View style={styles.content}>
        <Animated.View style={logoStyle} testID="splash-logo">
          <BuddyAnimation buddy="dino" state="active" size={150} />
        </Animated.View>
        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Text style={styles.titleText}>HabitBuddy</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: AppColors.deepIndigo,
    zIndex: 9999,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginTop: 20,
  },
  titleText: {
    fontSize: 40,
    fontWeight: '700',
    color: AppColors.textPrimary,
    fontFamily: 'FredokaOne_400Regular',
  },
});
