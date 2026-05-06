import { FadeInDown } from '@/components/animations/FadeInDown';
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
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../constants/theme';
import { useNotesStore } from '../../../store/notesStore';

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Ionicons } from '@expo/vector-icons';

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { notes, updateNote } = useNotesStore();
  const note = notes.find((n) => n.id === id);

  const [title, setTitle] = useState(note?.title ?? '');
  const [content, setContent] = useState(note?.content ?? '');

  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!note) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Nota no encontrada</Text>
      </SafeAreaView>
    );
  }

  const save = async () => {
    if (!title.trim()) return;

    updateNote(note.id, { title, content });
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(20, { duration: 200 }, () => {
      runOnJS(router.back)();
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 20}
      >
        <Animated.View style={[{ flex: 1 }, anim]}>
          <ScrollView
            contentContainerStyle={{
              padding: 20,
              paddingTop: 10,
              paddingBottom: insets.bottom + 40,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* HEADER */}
            <FadeInDown duration={300} offset={-20}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 20,
                  marginTop: insets.top,
                }}
              >
                <Text onPress={() => router.back()} style={{ marginRight: 12 }}>
                  <Ionicons name="arrow-back" size={24} color={theme.text} />
                </Text>

                <Text style={[styles.header, { color: theme.text }]}>
                  Editar nota
                </Text>
              </View>
            </FadeInDown>

            <FadeInDown duration={300} offset={-20} delay={80}>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    fontSize: 20,
                    fontWeight: '600',
                  },
                ]}
                placeholder="Título"
                placeholderTextColor={theme.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
            </FadeInDown>

            <FadeInDown duration={300} offset={-20} delay={160}>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.textSecondary,
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    minHeight: 200,
                    textAlignVertical: 'top',
                  },
                ]}
                placeholder="Contenido"
                placeholderTextColor={theme.textTertiary}
                value={content}
                onChangeText={setContent}
                multiline
              />
            </FadeInDown>

            <FadeInDown duration={300} offset={-20} delay={240}>
              <Text
                onPress={save}
                style={[styles.saveBtn, { backgroundColor: theme.primary }]}
              >
                Guardar cambios
              </Text>
            </FadeInDown>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 24, fontWeight: '700' },
  input: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  saveBtn: {
    padding: 16,
    borderRadius: 12,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});