import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AppColors } from '../theme/Colors';
import { BuddyAnimation } from './BuddyAnimation';

export const BouncingBuddyLoader: React.FC = () => {
  return (
    <View style={styles.container} testID="bouncing-buddy-loader">
      <BuddyAnimation buddy="dino" state="active" size={150} />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 46, 0.8)', // Semi-transparent Deep Indigo
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    marginTop: 20,
    fontSize: 24,
    color: AppColors.textPrimary,
    fontFamily: 'FredokaOne_400Regular',
  },
});
