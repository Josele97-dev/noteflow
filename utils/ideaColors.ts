import { Theme } from '@/constants/theme';

export function getColoredItemStyles(color: string | undefined, theme: Theme) {
  const hasColor = !!color;
  return {
    textColor: hasColor ? '#1a1a1a' : theme.text,
    textSecondary: hasColor ? 'rgba(0,0,0,0.5)' : theme.textSecondary,
    btnColor: hasColor ? 'rgba(0,0,0,0.15)' : theme.primary + '22',
    iconColor: hasColor ? '#1a1a1a' : theme.primary,
    dangerBtnColor: hasColor ? 'rgba(0,0,0,0.15)' : theme.danger + '22',
    dangerIconColor: hasColor ? '#1a1a1a' : theme.danger,
  };
}