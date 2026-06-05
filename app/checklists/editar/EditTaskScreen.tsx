import { FadeInDown } from '@/components/animations/FadeInDown';
import { EditHeader } from '@/components/ui/EditHeader';
import { useExitAnimation } from '@/hooks/useExitAnimation';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../constants/theme';
import { useNotesStore } from '../../../store/notesStore';

type Subtarea = { id: string; text: string; isCompleted: boolean };

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { checklists, updateChecklist } = useNotesStore();
  const task = checklists.find((c) => c.id === id);

  const [title, setTitle] = useState(task?.title ?? '');
  const [subtareas, setSubtareas] = useState<Subtarea[]>(task?.items ?? []);
  const [isSaving, setIsSaving] = useState(false);
  const { animStyle, exit } = useExitAnimation();

  if (!task) return (
    <View style={{ flex: 1, backgroundColor: theme.background }}
      accessibilityRole="text" accessibilityLabel="Tarea no encontrada" />
  );

  const hasEmpty = subtareas.some((s) => s.text.trim().length === 0);

  const updateText = (idSub: string, text: string) =>
    setSubtareas((prev) => prev.map((s) => (s.id === idSub ? { ...s, text } : s)));

  const handleBlur = (idSub: string) =>
    setSubtareas((prev) => prev.filter((s) => !(s.id === idSub && s.text.trim() === '')));

  const addSubtarea = () => {
    if (hasEmpty) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); return; }
    setSubtareas((prev) => [...prev, { id: Math.random().toString(), text: '', isCompleted: false }]);
  };

  const save = async () => {
    if (isSaving || !title.trim()) return;
    setIsSaving(true);
    try {
      updateChecklist(task.id, { title, items: subtareas.filter((s) => s.text.trim().length > 0) });
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      exit(router.back);
    } catch {
      setIsSaving(false);
    }
  };

  const inputStyle = [styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border }];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]} accessibilityLabel="Pantalla de edición de tarea">
      <Stack.Screen options={{ headerShown: false }} />
      <Animated.View style={[{ flex: 1 }, animStyle]}>
        <EditHeader title="Editar tarea" onBack={router.back} onSave={save} disabled={isSaving} />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40 }}
            accessibilityLabel="Formulario de edición de subtareas">

            <Text style={[styles.label, { color: theme.textSecondary }]} accessibilityRole="text">Título</Text>
            <TextInput value={title} onChangeText={setTitle} placeholder="Título de la tarea"
              placeholderTextColor={theme.textTertiary}
              style={[inputStyle, styles.titleInput]}
              accessibilityLabel="Campo de título de la tarea" accessibilityHint="Escribe el nombre de la tarea" />

            <Text style={[styles.label, { color: theme.textSecondary }]} accessibilityRole="text">Subtareas</Text>
            {subtareas.map((sub, index) => (
              <FadeInDown key={sub.id}>
                <TextInput value={sub.text} onChangeText={(t) => updateText(sub.id, t)}
                  onBlur={() => handleBlur(sub.id)} placeholder="Subtarea..."
                  placeholderTextColor={theme.textTertiary} style={inputStyle}
                  accessibilityRole="text" accessibilityLabel={`Subtarea ${index + 1}`}
                  accessibilityHint="Escribe o edita esta subtarea" />
              </FadeInDown>
            ))}

            <TouchableOpacity style={[styles.addBtn, { borderColor: theme.border, opacity: hasEmpty ? 0.4 : 1 }]}
              disabled={hasEmpty} onPress={addSubtarea}
              accessibilityRole="button" accessibilityLabel="Añadir subtarea"
              accessibilityHint={hasEmpty ? 'Completa la subtarea actual antes de añadir otra' : 'Añade una nueva subtarea'}
              accessibilityState={{ disabled: hasEmpty }}>
              <Text style={{ color: theme.text }}>+ Añadir subtarea</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 16, marginBottom: 8 },
  titleInput: { fontSize: 16, fontWeight: '600', marginBottom: 4, padding: 16 },
  input: { padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  addBtn: { padding: 12, borderWidth: 1, borderRadius: 10, alignItems: 'center', marginTop: 10 },
});