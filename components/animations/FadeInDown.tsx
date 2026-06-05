import React, { useEffect, useRef } from 'react';
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

  const durationRef = useRef(duration);
  const delayRef = useRef(delay);

  useEffect(() => {
    opacity.value = withDelay(
      delayRef.current,
      withTiming(1, {
        duration: durationRef.current,
        easing: Easing.out(Easing.quad),
      })
    );

    translateY.value = withDelay(
      delayRef.current,
      withTiming(0, {
        duration: durationRef.current,
        easing: Easing.out(Easing.quad),
      })
    );
  }, [opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}
