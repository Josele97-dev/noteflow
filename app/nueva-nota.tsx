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
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';
import { useTheme } from '../constants/theme';
import { useNotesStore } from '../store/notesStore';

type Tipo = 'nota' | 'tarea' | 'idea';

const noteSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  content: z.string().min(1, 'El contenido no puede estar vacío'),
});

const baseSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
});

const COLORES = ['#FFD700', '#FF6B6B', '#6C63FF', '#4CAF50', '#FF9800', '#00BCD4'];
const TIPOS: Tipo[] = ['nota', 'tarea', 'idea'];

export default function NuevaNota() {
  const router = useRouter();
  const theme = useTheme();
  const { addNote, addChecklist, addIdea } = useNotesStore();
  const { tipo: tipoParam } = useLocalSearchParams<{ tipo: string }>();

  const [tipo, setTipo] = useState<Tipo>((tipoParam as Tipo) || 'nota');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tareaInput, setTareaInput] = useState('');
  const [tareas, setTareas] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [color, setColor] = useState('#FFD700');
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const handleTipo = (t: Tipo) => { setTipo(t); setErrors({}); };

  const añadirTarea = () => {
    if (!tareaInput.trim()) return;
    setTareas((prev) => [...prev, tareaInput.trim()]);
    setTareaInput('');
  };

  const añadirTag = () => {
    if (!tagInput.trim()) return;
    setTags((prev) => [...prev, tagInput.trim()]);
    setTagInput('');
  };

  const eliminarTarea = (i: number) => setTareas((prev) => prev.filter((_, idx) => idx !== i));
  const eliminarTag   = (i: number) => setTags((prev) => prev.filter((_, idx) => idx !== i));

  const guardar = async () => {
    setErrors({});

    if (tipo === 'nota') {
      const result = noteSchema.safeParse({ title, content });
      if (!result.success) {
        const f = result.error.flatten().fieldErrors;
        setErrors({ title: f.title?.[0], content: f.content?.[0] });
        return;
      }
    } else {
      const result = baseSchema.safeParse({ title });
      if (!result.success) {
        const f = result.error.flatten().fieldErrors;
        setErrors({ title: f.title?.[0] });
        return;
      }
    }

    const base = {
      id: Date.now().toString(),
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      archived: false,
    };

    if (tipo === 'nota') addNote({ ...base, content });
    else if (tipo === 'tarea') addChecklist({ ...base, items: tareas.map((t, i) => ({ id: `${Date.now()}-${i}`, text: t, isCompleted: false })) });
    else addIdea({ ...base, tags, color, content });

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
  };

  const inputStyle = [styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.titulo, { color: theme.text }]}>Nueva entrada</Text>

        <View style={styles.tipos}>
          {TIPOS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tipoBtn, { borderColor: theme.border }, tipo === t && { backgroundColor: theme.primary, borderColor: theme.primary }]}
              onPress={() => handleTipo(t)}
            >
              <Text style={[styles.tipoText, { color: theme.textSecondary }, tipo === t && { color: '#fff', fontWeight: '600' }]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={[...inputStyle, errors.title && { borderColor: theme.danger }]}
          placeholder="Título"
          placeholderTextColor={theme.textTertiary}
          value={title}
          onChangeText={setTitle}
        />
        {errors.title && <Text style={[styles.error, { color: theme.danger }]}>{errors.title}</Text>}

        {tipo === 'nota' && (
          <>
            <TextInput
              style={[...inputStyle, styles.textarea, errors.content && { borderColor: theme.danger }]}
              placeholder="Contenido"
              placeholderTextColor={theme.textTertiary}
              value={content}
              onChangeText={setContent}
              multiline
            />
            {errors.content && <Text style={[styles.error, { color: theme.danger }]}>{errors.content}</Text>}
          </>
        )}

        {tipo === 'tarea' && (
          <>
            <View style={styles.row}>
              <TextInput
                style={[...inputStyle, { flex: 1, marginBottom: 0 }]}
                placeholder="Añadir tarea"
                placeholderTextColor={theme.textTertiary}
                value={tareaInput}
                onChangeText={setTareaInput}
                onSubmitEditing={añadirTarea}
                returnKeyType="done"
              />
              <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.primary }]} onPress={añadirTarea}>
                <Text style={styles.addBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            {tareas.map((t, i) => (
              <View key={i} style={styles.itemRow}>
                <Text style={[styles.item, { color: theme.textSecondary, flex: 1 }]}>• {t}</Text>
                <TouchableOpacity onPress={() => eliminarTarea(i)}>
                  <Text style={{ color: theme.danger, fontSize: 18, paddingHorizontal: 8 }}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {tipo === 'idea' && (
          <>
            <View style={styles.row}>
              <TextInput
                style={[...inputStyle, { flex: 1, marginBottom: 0 }]}
                placeholder="Añadir etiqueta"
                placeholderTextColor={theme.textTertiary}
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={añadirTag}
                returnKeyType="done"
              />
              <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.primary }]} onPress={añadirTag}>
                <Text style={styles.addBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tags}>
              {tags.map((tag, i) => (
                <TouchableOpacity key={i} style={[styles.tag, { backgroundColor: theme.primary + '22' }]} onPress={() => eliminarTag(i)}>
                  <Text style={[styles.tagText, { color: theme.primary }]}>#{tag} ×</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.label, { color: theme.text }]}>Color</Text>
            <View style={styles.colores}>
              {COLORES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.colorBtn, { backgroundColor: c }, color === c && { borderWidth: 3, borderColor: theme.text }]}
                  onPress={() => setColor(c)}
                />
              ))}
            </View>
            <Text style={[styles.label, { color: theme.text }]}>Descripción</Text>
            <TextInput
              style={[...inputStyle, styles.textarea]}
              placeholder="Describe tu idea..."
              placeholderTextColor={theme.textTertiary}
              value={content}
              onChangeText={setContent}
              multiline
            />
          </>
        )}

        <TouchableOpacity style={[styles.boton, { backgroundColor: theme.primary }]} onPress={guardar}>
          <Text style={styles.botonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  tipos: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  tipoBtn: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  tipoText: { fontSize: 14 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8, fontSize: 16 },
  textarea: { height: 120, textAlignVertical: 'top' },
  error: { fontSize: 13, marginBottom: 8 },
  boton: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  botonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 10, marginBottom: 8, alignItems: 'center' },
  addBtn: { padding: 12, borderRadius: 8 },
  addBtnText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  item: { fontSize: 15, paddingLeft: 4 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  tag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 13 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 8, marginTop: 8 },
  colores: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  colorBtn: { width: 36, height: 36, borderRadius: 18 },
});