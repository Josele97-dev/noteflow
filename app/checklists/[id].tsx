import { FadeInDown } from '@/components/animations/FadeInDown';
import { ItemActions } from '@/components/items/ItemActions';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../constants/theme';
import { useNotesStore } from '../../store/notesStore';
import type { ChecklistItem } from '../../types';

export default function ChecklistDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { checklists, deleteChecklist, archiveChecklist, toggleChecklistItem } = useNotesStore();

  const checklist = checklists.find((c) => c.id === id);
  const checklistRef = useRef(checklist);
  if (checklist) checklistRef.current = checklist;
  const data = checklistRef.current;

  const hasVibratedRef = useRef(false);
  const [isOpening, setIsOpening] = useState(false);

  if (!data) return <View style={{ flex: 1, backgroundColor: theme.background }} />;

  const completadas = data.items.filter((i) => i.isCompleted).length;
  const total = data.items.length;
  const progreso = total > 0 ? (completadas / total) * 100 : 0;

  const fecha = new Date(data.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleToggle = (itemId: string) => {
    toggleChecklistItem(id, itemId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setTimeout(() => {
      const current = checklistRef.current;
      if (!current) return;
      const comp = current.items.filter((i) => i.isCompleted).length;
      const tot = current.items.length;
      if (tot > 0 && comp === tot && !hasVibratedRef.current) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        hasVibratedRef.current = true;
      }
      if (comp < tot) hasVibratedRef.current = false;
    }, 50);
  };

  function confirmar(titulo: string, mensaje: string, accion: () => void) {
    Alert.alert(titulo, mensaje, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: titulo,
        style: titulo === 'Eliminar' ? 'destructive' : 'default',
        onPress: accion,
      },
    ]);
  }

  const eliminar = () =>
    confirmar('Eliminar', '¿Seguro que quieres eliminar esta tarea?', () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      deleteChecklist(id);
      router.back();
    });

  const archivar = () =>
    confirmar('Archivar', '¿Quieres archivar esta tarea?', () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      archiveChecklist(id);
      router.back();
    });

  const editar = () => {
    if (isOpening) return;
    setIsOpening(true);
    router.push({ pathname: '/checklists/editar/EditTaskScreen', params: { id } });
    setTimeout(() => setIsOpening(false), 600);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FadeInDown duration={400} offset={-30}>
          <Text style={[styles.fecha, { color: theme.textTertiary }]}>{fecha}</Text>
        </FadeInDown>

        <FadeInDown duration={400} offset={-30} delay={100}>
          <Text style={[styles.title, { color: theme.text }]}>{data.title}</Text>
          <Text style={[styles.counter, { color: theme.textSecondary }]}>
            {completadas}/{total} completadas
          </Text>
          <View style={[styles.barraFondo, { backgroundColor: theme.border }]}>
            <View style={[styles.barraRelleno, { width: `${progreso}%`, backgroundColor: theme.success }]} />
          </View>
        </FadeInDown>

        <FadeInDown duration={400} offset={-30} delay={200}>
          {data.items.map((item: ChecklistItem) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.item, { borderBottomColor: theme.border }]}
              onPress={() => handleToggle(item.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor: theme.border },
                  item.isCompleted && { backgroundColor: theme.success, borderColor: theme.success },
                ]}
              />
              <Text
                style={[
                  styles.itemText,
                  { color: theme.text },
                  item.isCompleted && { textDecorationLine: 'line-through', color: theme.textTertiary },
                ]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </FadeInDown>
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
  fecha: {
    fontSize: 13,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 34,
  },
  counter: { fontSize: 14, marginBottom: 8 },
  barraFondo: { height: 6, borderRadius: 3, marginBottom: 16 },
  barraRelleno: { height: 6, borderRadius: 3 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    marginRight: 12,
  },
  itemText: { fontSize: 16, flex: 1 },
});