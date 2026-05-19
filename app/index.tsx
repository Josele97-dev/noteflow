import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../constants/theme';

export default function Index() {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={theme.primary} />
    </View>
  );
}