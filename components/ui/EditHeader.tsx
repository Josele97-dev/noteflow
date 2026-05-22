import { useTheme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  title: string;
  onBack: () => void;
  onSave?: () => void;
  saveLabel?: string;
}

export function EditHeader({ title, onBack, onSave, saveLabel = 'Guardar' }: Props) {
  const theme = useTheme();
  const scheme = useColorScheme() ?? 'light';
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();

  const headerBg = isDark ? theme.card : theme.primary;
  const headerText = isDark ? theme.text : '#ffffff';
  const iconColor = isDark ? theme.text : '#ffffff';

  return (
    <>
      <StatusBar style="light" backgroundColor={headerBg} translucent />
      <View
        style={{
          backgroundColor: headerBg,
          // insets.top cubre exactamente la status bar en cualquier Android
          paddingTop: insets.top + 8,
          paddingBottom: 14,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          // Asegura que ocupe el ancho completo sin márgenes
          alignSelf: 'stretch',
        }}
      >
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}
        >
          <Ionicons name="arrow-back" size={24} color={iconColor} />
        </TouchableOpacity>

        <Text style={{ flex: 1, fontSize: 18, fontWeight: '700', color: headerText }}>
          {title}
        </Text>

        {onSave && (
          <TouchableOpacity
            onPress={onSave}
            style={{
              backgroundColor: isDark ? theme.primary : 'rgba(255,255,255,0.2)',
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '600' }}>
              {saveLabel}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}