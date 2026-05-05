import React, { useEffect } from 'react';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  onFinish?: () => void;
}

export function FadeOutLeft({ children, duration = 300, delay = 0, onFinish }: Props) {
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);

  useEffect(() => {
    const config = { duration, easing: Easing.in(Easing.quad) };
    const callback = (finished?: boolean) => { if (finished && onFinish) runOnJS(onFinish)(); };
    opacity.value = withDelay(delay, withTiming(0, config));
    translateX.value = withDelay(delay, withTiming(-40, config, callback));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}