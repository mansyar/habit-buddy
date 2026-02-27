import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { AppColors } from '../theme/Colors';

export const SkeletonCard: React.FC = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container} testID="skeleton-card">
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.iconArea} />
        <View style={styles.textArea}>
          <View style={styles.titleLine} />
          <View style={styles.subtitleLine} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  card: {
    height: 96,
    borderRadius: 20,
    backgroundColor: AppColors.cardDark,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconArea: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: AppColors.elevated,
  },
  textArea: {
    marginLeft: 16,
    flex: 1,
  },
  titleLine: {
    height: 20,
    width: '70%',
    backgroundColor: AppColors.elevated,
    borderRadius: 4,
    marginBottom: 8,
  },
  subtitleLine: {
    height: 14,
    width: '40%',
    backgroundColor: AppColors.elevated,
    borderRadius: 4,
  },
});
