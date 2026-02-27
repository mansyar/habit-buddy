import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Svg, Rect, Defs, Pattern, Path } from 'react-native-svg';

interface CautionTapeProgressProps {
  progress: number; // 0 to 100
}

const STRIPE_WIDTH = 40;
const TAPE_HEIGHT = 24;

export function CautionTapeProgress({ progress }: CautionTapeProgressProps) {
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(-STRIPE_WIDTH, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [offset]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <View style={styles.container} testID="caution-tape-container">
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} testID="caution-tape-fill">
          <Animated.View style={[styles.stripeContainer, animatedStyle]}>
            <Svg width="200%" height={TAPE_HEIGHT}>
              <Defs>
                <Pattern
                  id="stripe"
                  width={STRIPE_WIDTH}
                  height={TAPE_HEIGHT}
                  patternUnits="userSpaceOnUse"
                >
                  <Rect width={STRIPE_WIDTH} height={TAPE_HEIGHT} fill="#FFD700" />
                  <Path
                    d={`M0 ${TAPE_HEIGHT} L${STRIPE_WIDTH / 2} 0 L${STRIPE_WIDTH} 0 L${STRIPE_WIDTH / 2} ${TAPE_HEIGHT} Z`}
                    fill="#333"
                  />
                </Pattern>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#stripe)" />
            </Svg>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: TAPE_HEIGHT + 4,
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginVertical: 10,
  },
  track: {
    height: TAPE_HEIGHT,
    backgroundColor: '#EEE',
    borderRadius: TAPE_HEIGHT / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#333',
  },
  fill: {
    height: '100%',
    backgroundColor: '#FFD700',
    overflow: 'hidden',
  },
  stripeContainer: {
    flexDirection: 'row',
    width: '200%',
    height: '100%',
  },
});
