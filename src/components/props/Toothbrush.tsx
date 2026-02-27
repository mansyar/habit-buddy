import React from 'react';
import Svg, { Rect, G } from 'react-native-svg';

export const Toothbrush: React.FC<{ size?: number }> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <G>
        {/* Handle */}
        <Rect x="40" y="10" width="20" height="80" rx="10" fill="#2196F3" />
        {/* Bristles */}
        <Rect
          x="35"
          y="10"
          width="30"
          height="20"
          rx="5"
          fill="#FFFFFF"
          stroke="#F0F0F0"
          strokeWidth="1"
        />
      </G>
    </Svg>
  );
};
