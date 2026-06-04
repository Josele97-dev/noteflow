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
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

  const [isSaving, setIsSaving] = useState(false);

  if (!idea) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.background }]}
        accessibilityRole="none"
        accessibilityLabel="Idea no encontrada"
      />
    );
  }

  const save = async () => {
    if (isSaving) return;
    if (!title.trim()) return;

    setIsSaving(true);

    try {
      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      updateIdea(idea.id, { title, content, tags: tagsArray });

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      exit(router.back);
    } catch (e) {
      console.log('Error guardando:', e);
      setIsSaving(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background }]}
      accessibilityLabel="Pantalla de edición de idea"
    >
      <Stack.Screen options={{ headerShown: false }} />

      <Animated.View style={[{ flex: 1 }, animStyle]}>
        <EditHeader
          title="Editar idea"
          onBack={router.back}
          onSave={save}
          disabled={isSaving}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              paddingBottom: insets.bottom + 40,
            }}
            showsVerticalScrollIndicator={false}
            accessibilityLabel="Formulario de edición de idea"
          >
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  fontSize: 18,
                  fontWeight: '600',
                },
              ]}
              placeholder="Título"
              placeholderTextColor={theme.textTertiary}
              value={title}
              onChangeText={setTitle}
              accessibilityLabel="Campo de título"
              accessibilityRole="text"
            />

            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  minHeight: 160,
                  textAlignVertical: 'top',
                },
              ]}
              placeholder="Contenido"
              placeholderTextColor={theme.textTertiary}
              value={content}
              onChangeText={setContent}
              multiline
              accessibilityLabel="Campo de contenido"
              accessibilityRole="text"
            />

            <Text
              style={[styles.label, { color: theme.textSecondary }]}
              accessibilityRole="text"
              accessibilityLabel="Etiqueta de tags"
            >
              Tags
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Tag1, Tag2, Tag3..."
              placeholderTextColor={theme.textTertiary}
              value={tags}
              onChangeText={setTags}
              accessibilityLabel="Campo de etiquetas separadas por comas"
              accessibilityRole="text"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: { padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
});