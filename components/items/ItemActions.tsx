import { useTheme } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  onEditar: () => void;
  onArchivar: () => void;
  onEliminar: () => void;
  isOpening?: boolean;
  variant?: 'theme' | 'color';
};

export function ItemActions({
  onEditar,
  onArchivar,
  onEliminar,
  isOpening = false,
  variant = 'theme',
}: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isColor = variant === 'color';

  const btnBase = isColor
    ? { backgroundColor: 'rgba(0,0,0,0.15)' }
    : { backgroundColor: theme.card, borderColor: theme.border };

  const btnDisabled = isColor
    ? { backgroundColor: 'rgba(0,0,0,0.15)' }
    : { backgroundColor: theme.border, borderColor: theme.border };

  const textColor = isColor ? '#fff' : theme.text;

  return (
    <View
      style={[
        styles.actions,
        {
          paddingBottom: insets.bottom + 12,
          borderTopColor: isColor ? 'rgba(0,0,0,0.1)' : theme.border,
          backgroundColor: isColor ? 'transparent' : theme.background,
        },
      ]}
      accessibilityRole="toolbar"
      accessibilityLabel="Acciones del elemento"
    >
      {/* EDITAR */}
      <TouchableOpacity
        disabled={isOpening}
        style={[styles.btn, isOpening ? btnDisabled : btnBase]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onEditar();
        }}
        accessibilityRole="button"
        accessibilityLabel="Editar elemento"
        accessibilityHint="Abre la pantalla de edición"
        accessibilityState={{ disabled: isOpening }}
      >
        <Text style={[styles.btnText, { color: textColor }]}>Editar</Text>
      </TouchableOpacity>

      {/* ARCHIVAR */}
      <TouchableOpacity
        style={[styles.btn, btnBase]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onArchivar();
        }}
        accessibilityRole="button"
        accessibilityLabel="Archivar elemento"
        accessibilityHint="Mueve este elemento a la sección de archivados"
      >
        <Text style={[styles.btnText, { color: textColor }]}>Archivar</Text>
      </TouchableOpacity>

      {/* ELIMINAR */}
      <TouchableOpacity
        style={[
          styles.btn,
          { backgroundColor: isColor ? '#ff4444' : theme.danger },
        ]}
        onPress={() => {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Warning
          );
          onEliminar();
        }}
        accessibilityRole="button"
        accessibilityLabel="Eliminar elemento"
        accessibilityHint="Elimina este elemento de forma permanente"
        accessibilityState={{ disabled: false }}
      >
        <Text style={[styles.btnText, { color: '#fff' }]}>
          Eliminar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  btn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  btnText: {
    fontWeight: '600',
    fontSize: 15,
  },
});