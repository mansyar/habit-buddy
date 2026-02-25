import React from 'react';
import Svg, { Circle, G } from 'react-native-svg';

export const Plate: React.FC<{ size?: number }> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G>
        {/* Plate */}
        <Circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="2" />
        <Circle cx="50" cy="50" r="35" fill="#FFFFFF" stroke="#F0F0F0" strokeWidth="1" />
        {/* Apple (on plate) */}
        <Circle cx="50" cy="50" r="15" fill="#FF5252" />
      </G>
    </Svg>
  );
};
