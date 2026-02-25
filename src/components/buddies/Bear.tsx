import React from 'react';
import Svg, { Circle, Path, Ellipse, G } from 'react-native-svg';

export const Bear: React.FC<{ size?: number }> = ({ size = 200 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 136 136">
      <G>
        {/* Background Circle (Round style) */}
        <Circle cx="68" cy="68" r="64" fill="#916f51" />

        {/* Ears */}
        <Circle cx="35" cy="25" r="18" fill="#916f51" />
        <Circle cx="101" cy="25" r="18" fill="#916f51" />
        <Circle cx="35" cy="25" r="8" fill="#bd9373" />
        <Circle cx="101" cy="25" r="8" fill="#bd9373" />

        {/* Muzzle */}
        <Ellipse cx="68" cy="95" rx="35" ry="25" fill="#bd9373" />

        {/* Nose */}
        <Path d="M58 85 Q68 75 78 85 Q68 95 58 85" fill="#3e2723" />

        {/* Eyes */}
        <Circle cx="45" cy="60" r="6" fill="#3e2723" />
        <Circle cx="91" cy="60" r="6" fill="#3e2723" />
      </G>
    </Svg>
  );
};
