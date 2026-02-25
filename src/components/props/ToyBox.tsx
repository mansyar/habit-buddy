import React from 'react';
import Svg, { Rect, Circle, G } from 'react-native-svg';

export const ToyBox: React.FC<{ size?: number }> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G>
        {/* Box */}
        <Rect x="15" y="40" width="70" height="50" rx="4" fill="#8B4513" />
        {/* Toys peeking out */}
        <Circle cx="35" cy="35" r="15" fill="#FFC107" />
        <Rect x="55" y="25" width="20" height="20" rx="4" fill="#E91E63" />
      </G>
    </Svg>
  );
};
