import React from 'react';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

export const Dino: React.FC<{ size?: number }> = ({ size = 200 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 250 250">
      <G>
        {/* Body */}
        <Circle cx="125" cy="125" r="100" fill="#a3d144" />
        {/* Belly */}
        <Path
          d="M125 225c-55.2 0-100-44.8-100-100 0-10 1.5-19.6 4.2-28.7 15.8 15.3 37.4 24.7 61.3 24.7 48.6 0 88-39.4 88-88 0-4.1-.3-8.1-.8-12.1 27.8 18.4 47.3 50.1 47.3 86.1 0 55.2-44.8 100-100 100z"
          fill="#c7e682"
        />
        {/* Eyes */}
        <Circle cx="90" cy="100" r="10" fill="#000" />
        <Circle cx="160" cy="100" r="10" fill="#000" />
        {/* Arms */}
        <Rect x="70" y="140" width="20" height="10" rx="5" fill="#86b32d" />
        <Rect x="160" y="140" width="20" height="10" rx="5" fill="#86b32d" />
        {/* Nostrils */}
        <Circle cx="115" cy="160" r="3" fill="#86b32d" />
        <Circle cx="135" cy="160" r="3" fill="#86b32d" />
      </G>
    </Svg>
  );
};
