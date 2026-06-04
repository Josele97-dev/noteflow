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
  disabled?: boolean;
}

export function EditHeader({
  title,
  onBack,
  onSave,
  saveLabel = 'Guardar',
  disabled = false,
}: Props) {
  const theme = useTheme();
  const scheme = useColorScheme() ?? 'light';
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();

  const bg = isDark ? theme.card : theme.primary;
  const text = isDark ? theme.text : '#fff';
  const subtle = isDark ? theme.textSecondary : 'rgba(255,255,255,0.8)';

  return (
    <>
      <StatusBar style="light" />

      <View
        style={{
          backgroundColor: bg,
          paddingTop: insets.top + 10,
          paddingBottom: 14,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',

          borderBottomWidth: 1,
          borderBottomColor: isDark ? theme.border : 'rgba(255,255,255,0.15)',
        }}
      >
        <TouchableOpacity
          onPress={onBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDark
              ? theme.background
              : 'rgba(255,255,255,0.15)',
          }}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={text}
          />
        </TouchableOpacity>

        {/* CENTER TITLE */}
        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 10 }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: text,
              letterSpacing: 0.2,
            }}
          >
            {title}
          </Text>

          <View
            style={{
              width: 28,
              height: 2,
              borderRadius: 2,
              marginTop: 4,
              backgroundColor: isDark
                ? theme.primary
                : 'rgba(255,255,255,0.6)',
            }}
          />
        </View>

        {onSave ? (
          <TouchableOpacity
            onPress={onSave}
            disabled={disabled}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 10,

              backgroundColor: disabled
                ? isDark
                  ? theme.border
                  : 'rgba(255,255,255,0.25)'
                : '#fff',
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: theme.primary,
                opacity: disabled ? 0.5 : 1,
              }}
            >
              {saveLabel}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>
    </>
  );
}