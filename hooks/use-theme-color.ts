import { colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ThemeProps = {
  light?: string;
  dark?: string;
};

export function useThemeColor(
  props: ThemeProps,
  colorName: keyof typeof colors.light
) {
  const theme = useColorScheme() ?? 'light';

  const scheme: 'light' | 'dark' = theme === 'dark' ? 'dark' : 'light';

  const colorFromProps = props[scheme];
  return colorFromProps ?? colors[scheme][colorName];
}
