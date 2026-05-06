import { FadeInDown } from '@/components/animations/FadeInDown';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/theme';
import { useNotesStore } from '../../store/notesStore';
import type { ChecklistItem } from '../../types';

export default function ChecklistDetalle() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id as string;

  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

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
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); // vibración al confirmar
      deleteChecklist(id);
      router.back();
    });

  const archivar = () =>
    confirmar('Archivar', '¿Quieres archivar esta tarea?', () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // vibración al confirmar
      archiveChecklist(id);
      router.back();
    });

  const editar = () => {
    if (isOpening) return;
    setIsOpening(true);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // vibración al pulsar

    router.push({
      pathname: "/checklists/editar/EditTaskScreen",
      params: { id },
    });

    setTimeout(() => setIsOpening(false), 600);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <FadeInDown duration={400} offset={-30}>
          <Text style={[styles.fecha, { color: theme.textTertiary }]}>{fecha}</Text>
        </FadeInDown>

        <FadeInDown duration={400} offset={-30} delay={100}>
          <Text style={[styles.title, { color: theme.text }]}>{data.title}</Text>
          <Text style={[styles.counter, { color: theme.textSecondary }]}>{completadas}/{total} completadas</Text>

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
                  item.isCompleted && {
                    backgroundColor: theme.success,
                    borderColor: theme.success,
                  },
                ]}
              />

              <Text
                style={[
                  styles.itemText,
                  { color: theme.text },
                  item.isCompleted && {
                    textDecorationLine: 'line-through',
                    color: theme.textTertiary,
                  },
                ]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </FadeInDown>

      </ScrollView>

      <FadeInDown duration={400} offset={-30} delay={300}>
        <View style={[
          styles.actions,
          {
            paddingBottom: insets.bottom + 12,
            borderTopColor: theme.border,
            backgroundColor: theme.background,
          },
        ]}>

          {/* EDITAR */}
          <TouchableOpacity
            disabled={isOpening}
            style={[
              styles.btn,
              {
                backgroundColor: isOpening ? theme.border : theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // vibración al pulsar
              editar();
            }}
          >
            <Text style={[styles.btnText, { color: theme.text }]}>Editar</Text>
          </TouchableOpacity>

          {/* ARCHIVAR — vibración al pulsar + vibración al confirmar */}
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // vibración al pulsar
              archivar(); // vibración al confirmar
            }}
          >
            <Text style={[styles.btnText, { color: theme.text }]}>Archivar</Text>
          </TouchableOpacity>

          {/* ELIMINAR — vibración al pulsar + vibración al confirmar */}
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: theme.danger }]}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); // vibración al pulsar
              eliminar(); // vibración al confirmar
            }}
          >
            <Text style={[styles.btnText, { color: '#fff' }]}>Eliminar</Text>
          </TouchableOpacity>

        </View>
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

  barraFondo: {
    height: 6,
    borderRadius: 3,
    marginBottom: 16,
  },

  barraRelleno: {
    height: 6,
    borderRadius: 3,
  },

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

  btnText: { fontWeight: '600', fontSize: 15 },
});
