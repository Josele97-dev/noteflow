import { FadeInDown } from '@/components/animations/FadeInDown';
import { ItemActions } from '@/components/items/ItemActions';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../constants/theme';
import { useNotesStore } from '../../store/notesStore';

export default function ChecklistDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { checklists, deleteChecklist, archiveChecklist, toggleChecklistItem } = useNotesStore();

  const data = checklists.find((c) => c.id === id);

  const [isOpening, setIsOpening] = useState(false);

  if (!data)
    return (
      <View
        style={{ flex: 1, backgroundColor: theme.background }}
        accessibilityRole="text"
        accessibilityLabel="No se encontró la lista"
      />
    );

  const fecha = new Date(data.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  function confirmar(titulo: string, mensaje: string, accion: () => void) {
    Alert.alert(titulo, mensaje, [
      { text: 'Cancelar', style: 'cancel' },
      { text: titulo, style: titulo === 'Eliminar' ? 'destructive' : 'default', onPress: accion },
    ]);
  }

  const eliminar = () =>
    confirmar('Eliminar', '¿Seguro que quieres eliminar esta lista?', () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      deleteChecklist(id);
      router.back();
    });

  const archivar = () =>
    confirmar('Archivar', '¿Quieres archivar esta lista?', () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      archiveChecklist(id);
      router.back();
    });

  const editar = () => {
    if (isOpening) return;
    setIsOpening(true);

    router.push({
      pathname: '/checklists/editar/EditTaskScreen',
      params: { id },
    });

    setTimeout(() => setIsOpening(false), 600);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Detalle de checklist"
      >
        <FadeInDown duration={400} offset={-30}>
          <Text
            style={[styles.fecha, { color: theme.textTertiary }]}
            accessibilityRole="text"
            accessibilityLabel={`Fecha de creación ${fecha}`}
          >
            {fecha}
          </Text>
        </FadeInDown>

        <FadeInDown duration={400} offset={-30} delay={100}>
          <Text
            style={[styles.title, { color: theme.text }]}
            accessibilityRole="header"
            accessibilityLabel={`Título de la lista: ${data.title}`}
          >
            {data.title}
          </Text>
        </FadeInDown>

        <FadeInDown duration={400} offset={-30} delay={200}>
          <View style={styles.itemsContainer}>
            {data.items.map((item) => {
              const label = `${item.text}, ${item.isCompleted ? 'completado' : 'pendiente'}`;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemRow}
                  onPress={() => toggleChecklistItem(data.id, item.id)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                  accessibilityHint="Marca o desmarca esta tarea"
                  accessibilityState={{ checked: item.isCompleted }}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: theme.border,
                        backgroundColor: item.isCompleted ? theme.primary : 'transparent',
                      },
                    ]}
                  />

                  <Text
                    style={[
                      styles.itemText,
                      {
                        color: theme.textSecondary,
                        textDecorationLine: item.isCompleted ? 'line-through' : 'none',
                      },
                    ]}
                  >
                    {item.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </FadeInDown>

        {data.location && (
          <FadeInDown duration={400} offset={-30} delay={300}>
            <TouchableOpacity
              style={[
                styles.locationRow,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Ubicación: ${data.location.address}`}
              accessibilityHint="Información de ubicación asociada a esta lista"
            >
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={[styles.locationText, { color: theme.textSecondary }]}>
                {data.location.address}
              </Text>
            </TouchableOpacity>
          </FadeInDown>
        )}
      </ScrollView>

      <FadeInDown duration={400} offset={-30} delay={300}>
        <ItemActions
          isOpening={isOpening}
          onEditar={editar}
          onArchivar={archivar}
          onEliminar={eliminar}
        />
      </FadeInDown>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },

  fecha: { fontSize: 13, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20, lineHeight: 34 },

  itemsContainer: { gap: 12, marginBottom: 20 },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
  },

  itemText: { fontSize: 16, flex: 1 },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  locationIcon: { fontSize: 16 },
  locationText: { fontSize: 13, flex: 1 },
});