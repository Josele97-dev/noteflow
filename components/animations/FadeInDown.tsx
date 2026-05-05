import React, { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  children: React.ReactNode;
  duration?: number;
  offset?: number;
  delay?: number; 
}

export function FadeInDown({ children, duration = 300, offset = -20, delay = 0 }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(Math.abs(offset));

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.quad) }));
    translateY.value = withDelay(delay, withTiming(0, { duration, easing: Easing.out(Easing.quad) }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}