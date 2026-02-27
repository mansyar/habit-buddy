import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { Svg, Rect, Defs, Pattern, Path } from 'react-native-svg';
import { AppColors } from '../theme/Colors';

interface CautionTapeProgressProps {
  progress: number; // 0 to 100
}

const STRIPE_WIDTH = 20;
const TAPE_HEIGHT = 12; // AppSizes.progressBarHeight

export function CautionTapeProgress({ progress }: CautionTapeProgressProps) {
  const offset = useSharedValue(0);
  const animatedWidth = useSharedValue(progress);

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(-STRIPE_WIDTH, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [offset]);

  useEffect(() => {
    animatedWidth.value = withSpring(progress, { damping: 15, stiffness: 100 });
  }, [progress, animatedWidth]);

  const stripeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
  }));

  return (
    <View style={styles.container} testID="caution-tape-container">
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} testID="caution-tape-fill">
          <Animated.View style={[styles.stripeContainer, stripeStyle]}>
            <Svg width="200%" height={TAPE_HEIGHT}>
              <Defs>
                <Pattern
                  id="stripe"
                  width={STRIPE_WIDTH}
                  height={TAPE_HEIGHT}
                  patternUnits="userSpaceOnUse"
                >
                  <Rect width={STRIPE_WIDTH} height={TAPE_HEIGHT} fill={AppColors.rewardGold} />
                  <Path
                    d={`M0 ${TAPE_HEIGHT} L${STRIPE_WIDTH / 2} 0 L${STRIPE_WIDTH} 0 L${STRIPE_WIDTH / 2} ${TAPE_HEIGHT} Z`}
                    fill={AppColors.missionOrange}
                  />
                </Pattern>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#stripe)" />
            </Svg>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: TAPE_HEIGHT,
    width: '100%',
    justifyContent: 'center',
  },
  track: {
    height: TAPE_HEIGHT,
    backgroundColor: AppColors.cardMedium,
    borderRadius: TAPE_HEIGHT / 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: AppColors.rewardGold,
    overflow: 'hidden',
    borderRadius: TAPE_HEIGHT / 2,
  },
  stripeContainer: {
    flexDirection: 'row',
    width: '200%',
    height: '100%',
  },
});
