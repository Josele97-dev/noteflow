import { EditHeader } from '@/components/ui/EditHeader';
import { useExitAnimation } from '@/hooks/useExitAnimation';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../constants/theme';
import { useNotesStore } from '../../../store/notesStore';

export default function EditIdeaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { ideas, updateIdea } = useNotesStore();
  const idea = ideas.find((i) => i.id === id);

  const [title, setTitle] = useState(idea?.title ?? '');
  const [content, setContent] = useState(idea?.content ?? '');
  const [tags, setTags] = useState((idea?.tags ?? []).join(', '));
  const { animStyle, exit } = useExitAnimation();

  if (!idea) return null;

  const save = async () => {
    if (!title.trim()) return;

    const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
    updateIdea(idea.id, { title, content, tags: tagsArray });
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    exit(router.back);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 20}
      >
        <Animated.View style={[{ flex: 1 }, animStyle]}>
          <ScrollView
            contentContainerStyle={{ padding: 20, paddingTop: 10, paddingBottom: insets.bottom + 40 }}
            showsVerticalScrollIndicator={false}
          >
            <EditHeader title="Editar idea" onBack={router.back} marginTop={insets.top} />

            <TextInput
              style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border, fontSize: 20, fontWeight: '600' }]}
              placeholder="Título"
              placeholderTextColor={theme.textSecondary}
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, { color: theme.textSecondary, backgroundColor: theme.card, borderColor: theme.border, minHeight: 160, textAlignVertical: 'top' }]}
              placeholder="Contenido"
              placeholderTextColor={theme.textTertiary}
              value={content}
              onChangeText={setContent}
              multiline
            />

            <TextInput
              style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border }]}
              placeholder="Tags separados por comas"
              placeholderTextColor={theme.textSecondary}
              value={tags}
              onChangeText={setTags}
            />

            <Text onPress={save} style={[styles.saveBtn, { backgroundColor: theme.primary }]}>
              Guardar cambios
            </Text>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: { padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  saveBtn: { marginTop: 10, padding: 16, borderRadius: 12, textAlign: 'center', color: '#fff', fontWeight: '600', fontSize: 16 },
});