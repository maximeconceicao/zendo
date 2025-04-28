import { View, TextProps } from 'react-native';
import Animated, {
  withRepeat,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  Easing,
  withDelay
} from 'react-native-reanimated';
import { useEffect } from 'react';
import CustomText from 'src/domains/shared/components/CustomText';

interface FocusPointCounterProps extends TextProps {
  count: number;
  isAnimating: boolean;
}

const HaloCircle = ({
  delay,
  size,
  opacity,
  isAnimating
}: {
  delay: number;
  size: number;
  opacity: number;
  isAnimating: boolean;
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isAnimating) {
      scale.value = withDelay(
        delay,
        withRepeat(
          withTiming(1.15, {
            duration: 3000,
            easing: Easing.inOut(Easing.ease)
          }),
          -1,
          true
        )
      );
    } else {
      scale.value = withTiming(1, { duration: 500 }); // Réduit progressivement la taille
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: `rgba(0, 0, 0, ${opacity})`,
    width: size,
    height: size
  }));

  return <Animated.View className="absolute rounded-full" style={animatedStyle} />;
};

const FocusPointCounter = ({ count, isAnimating }: FocusPointCounterProps) => {
  return (
    <View className="w-48 h-48 justify-center items-center relative">
      <HaloCircle delay={0} size={200} opacity={0.1} isAnimating={isAnimating} />
      <HaloCircle delay={300} size={160} opacity={0.2} isAnimating={isAnimating} />
      <HaloCircle delay={600} size={120} opacity={0.45} isAnimating={isAnimating} />
      <HaloCircle delay={900} size={80} opacity={0.9} isAnimating={isAnimating} />

      <CustomText className="text-4xl font-bold text-white">{count}</CustomText>
    </View>
  );
};

export default FocusPointCounter;
