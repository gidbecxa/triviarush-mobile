import React from 'react';
import { View } from 'react-native';
import { Svg, Path } from 'react-native-svg';

interface HamburgerProps {
  width: number;
  height: number;
  stroke?: string;
  strokeWidth?: number;
}

const Hamburger: React.FC<HamburgerProps> = ({ width, height, stroke, strokeWidth = 2.5 }) => {
  return (
    <View className="pt-2">
      <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 6H21"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Second line: 3/4 length */}
        <Path
          d="M3 12H16.5"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

export default Hamburger;
