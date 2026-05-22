import { FadeInDown } from '@/components/animations/FadeInDown';
import { EditHeader } from '@/components/ui/EditHeader';
import { useExitAnimation } from '@/hooks/useExitAnimation';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../constants/theme';
import { useNotesStore } from '../../../store/notesStore';

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { notes, updateNote } = useNotesStore();
  const note = notes.find((n) => n.id === id);

  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');
  const { animStyle, exit } = useExitAnimation();

  if (!note) return null;

  const save = async () => {
    if (!title.trim()) return;
    updateNote(note.id, { title, content });
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    exit(router.back);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <Animated.View style={[{ flex: 1 }, animStyle]}>
        <EditHeader title="Editar nota" onBack={router.back} onSave={save} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40 }}
            showsVerticalScrollIndicator={false}
          >
            <FadeInDown duration={300} offset={-20} delay={80}>
              <TextInput
                style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border, fontSize: 18, fontWeight: '600' }]}
                placeholder="Título"
                placeholderTextColor={theme.textTertiary}
                value={title}
                onChangeText={setTitle}
              />
            </FadeInDown>

            <FadeInDown duration={300} offset={-20} delay={160}>
              <TextInput
                style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border, minHeight: 200, textAlignVertical: 'top' }]}
                placeholder="Contenido"
                placeholderTextColor={theme.textTertiary}
                value={content}
                onChangeText={setContent}
                multiline
              />
            </FadeInDown>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: { padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
});