import { FadeInDown } from '@/components/animations/FadeInDown';
import { EditHeader } from '@/components/EditHeader';
import { useExitAnimation } from '@/hooks/useExitAnimation';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../constants/theme';
import { useNotesStore } from '../../../store/notesStore';

type Subtarea = {
  id: string;
  text: string;
  isCompleted: boolean;
};

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { checklists, updateChecklist } = useNotesStore();
  const task = checklists.find((c) => c.id === id);

  const [title, setTitle] = useState(task?.title ?? '');
  const [subtareas, setSubtareas] = useState<Subtarea[]>(task?.items ?? []);
  const { animStyle, exit } = useExitAnimation();

  useEffect(() => {
  }, []);

  if (!task) return null;

  const hasEmptySubtarea = subtareas.some((s) => s.text.trim().length === 0);

  const createSubtarea = (): Subtarea => ({
    id: Math.random().toString(),
    text: '',
    isCompleted: false,
  });

  const updateText = (idSub: string, text: string) =>
    setSubtareas((prev) => prev.map((s) => (s.id === idSub ? { ...s, text } : s)));

  const handleBlur = (idSub: string) =>
    setSubtareas((prev) => prev.filter((s) => !(s.id === idSub && s.text.trim() === '')));

  const addSubtarea = () => {
    if (hasEmptySubtarea) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    setSubtareas((prev) => [...prev, createSubtarea()]);
  };

  const save = async () => {
    if (!title.trim()) return;
    const cleaned = subtareas.filter((s) => s.text.trim().length > 0);
    updateChecklist(task.id, { title, items: cleaned });
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    exit(router.back);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <Animated.View style={[{ flex: 1 }, animStyle]}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingTop: 10, paddingBottom: insets.bottom + 40 }}
        >
          <EditHeader title="Editar tarea" onBack={router.back} marginTop={insets.top} />

          <Text style={[styles.label, { color: theme.textSecondary }]}>Título</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Título de la tarea"
            placeholderTextColor={theme.textSecondary}
            style={[styles.titleInput, { color: theme.text, backgroundColor: theme.card }]}
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>Subtareas</Text>

          {subtareas.map((sub) => (
            <FadeInDown key={sub.id}>
              <TextInput
                value={sub.text}
                onChangeText={(text) => updateText(sub.id, text)}
                onBlur={() => handleBlur(sub.id)}
                placeholder="Subtarea..."
                placeholderTextColor={theme.textSecondary}
                style={[styles.input, { color: theme.text, backgroundColor: theme.card }]}
              />
            </FadeInDown>
          ))}

          <TouchableOpacity
            style={[styles.addBtn, { borderColor: theme.border, opacity: hasEmptySubtarea ? 0.4 : 1 }]}
            disabled={hasEmptySubtarea}
            onPress={addSubtarea}
          >
            <Text style={{ color: theme.text }}>+ Añadir subtarea</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: theme.primary }]}
            onPress={save}
          >
            <Text style={styles.saveText}>Guardar cambios</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 10, marginBottom: 8 },
  titleInput: { padding: 16, borderRadius: 14, fontSize: 18, fontWeight: '600', marginBottom: 20 },
  input: { padding: 14, borderRadius: 12, marginBottom: 12 },
  addBtn: { padding: 12, borderWidth: 1, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveBtn: { marginTop: 20, padding: 16, borderRadius: 12, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '600' },
});