import React, { useState, useEffect } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { Cloud, CloudOff } from 'lucide-react-native';
import { networkService } from '@/lib/network';
import { AppColors } from '@/theme/Colors';

export const NetworkStatusIcon: React.FC<{ size?: number; style?: StyleProp<ViewStyle> }> = ({
  size = 20,
  style,
}) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Initial state
    networkService.isOnline().then(setIsOnline);

    // Subscribe to changes
    const unsubscribe = networkService.subscribeToConnectionChange(setIsOnline);

    return unsubscribe;
  }, []);

  if (isOnline) {
    return (
      <View style={style}>
        <Cloud size={size} color={AppColors.dinoGreen} />
      </View>
    );
  }

  return (
    <View style={style}>
      <CloudOff size={size} color={AppColors.error} />
    </View>
  );
};
