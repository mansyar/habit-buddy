import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Cloud, CloudOff } from 'lucide-react-native';
import { networkService } from '@/lib/network';
import { AppColors } from '@/theme/Colors';

export const NetworkStatusIcon: React.FC<{ size?: number }> = ({ size = 20 }) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Initial state
    networkService.isOnline().then(setIsOnline);

    // Subscribe to changes
    const unsubscribe = networkService.subscribeToConnectionChange(setIsOnline);

    return unsubscribe;
  }, []);

  if (isOnline) {
    return <Cloud size={size} color={AppColors.dinoGreen} />;
  }

  return <CloudOff size={size} color={AppColors.error} />;
};
