import { useTheme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface Props {
  title: string;
  onBack: () => void;
  marginTop?: number;
}

export function EditHeader({ title, onBack, marginTop = 0 }: Props) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop,
      }}
    >
      <Text onPress={onBack} style={{ marginRight: 12 }}>
        <Ionicons name="arrow-back" size={24} color={theme.text} />
      </Text>
      <Text style={{ fontSize: 24, fontWeight: '700', color: theme.text }}>
        {title}
      </Text>
    </View>
  );
}