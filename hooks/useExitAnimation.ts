import { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export function useExitAnimation() {
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const exit = (onFinish: () => void) => {
    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(20, { duration: 200 }, () => {
      runOnJS(onFinish)();
    });
  };

  return { animStyle, exit };
}