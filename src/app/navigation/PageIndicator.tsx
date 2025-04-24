import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

type Props = {
  currentIndex: number;
  total: number;
};

const CIRCLE_SIZE = 10;
const CIRCLE_SPACING = 8;
const STEP = CIRCLE_SIZE + CIRCLE_SPACING;

export const PageIndicator = ({ currentIndex, total }: Props) => {
  const position = useSharedValue(currentIndex);

  useEffect(() => {
    position.value = withSpring(currentIndex, { damping: 15 });
  }, [currentIndex]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value * STEP }]
  }));

  return (
    <View className="absolute left-0 right-0 bottom-[4.4rem] items-center">
      <View className="relative flex-row justify-center" style={{ width: total * STEP }}>
        {/* gray circles */}
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={{
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              marginHorizontal: CIRCLE_SPACING / 2
            }}
            className="rounded-full bg-gray-300"
          />
        ))}

        {/* animated circle */}
        <Animated.View
          style={[
            {
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE / 2,
              position: 'absolute',
              top: 0,
              left: STEP / 2 - CIRCLE_SIZE / 2 // offset to center the circle
            },
            indicatorStyle
          ]}
          className="bg-black"
        />
      </View>
    </View>
  );
};
