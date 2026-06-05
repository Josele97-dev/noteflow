import React, { useEffect, useRef } from 'react';
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

  const durationRef = useRef(duration);
  const delayRef = useRef(delay);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    const config = {
      duration: durationRef.current,
      easing: Easing.in(Easing.quad),
    };

    const callback = (finished?: boolean) => {
      if (finished && onFinishRef.current) {
        runOnJS(onFinishRef.current)();
      }
    };

    opacity.value = withDelay(delayRef.current, withTiming(0, config));
    translateX.value = withDelay(delayRef.current, withTiming(-40, config, callback));
  }, [opacity, translateX]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}
