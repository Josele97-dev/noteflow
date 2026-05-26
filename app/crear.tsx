import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View, useColorScheme
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';
import { DateTimePickerCustom } from '../components/ui/DateTimePicker';
import { useTheme } from '../constants/theme';
import { useNotesStore } from '../store/notesStore';
import { NoteLocation } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false
  }),
});

async function scheduleReminder(title: string, date: Date) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;
  await Notifications.scheduleNotificationAsync({
    content: { title: '🔔 Recordatorio NoteFlow', body: title },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date }
  });
  return true;
}

async function getCurrentLocation(): Promise<NoteLocation | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;

    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const [addr] = await Location.reverseGeocodeAsync(pos.coords);
    const address = [addr.street, addr.city].filter(Boolean).join(', ') || 'Ubicación desconocida';

    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude, address };
  } catch {
    return null;
  }
}

const TIPOS = ['nota', 'tarea', 'idea'] as const;
const COLORES = ['#FFD700', '#FF6B6B', '#6C63FF', '#4CAF50', '#FF9800', '#00BCD4'];

const noteSchema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres'),
  content: z.string().min(1, 'Contenido vacío')
});
const baseSchema = z.object({ title: z.string().min(3, 'Mínimo 3 caracteres') });

const AddRow = ({ value, onChange, onAdd, placeholder, theme }: any) => (
  <View style={styles.row}>
    <TextInput
      style={[styles.input, styles.flex, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
      placeholder={placeholder} placeholderTextColor={theme.textTertiary}
      value={value} onChangeText={onChange} onSubmitEditing={onAdd}
    />
    <TouchableOpacity style={[styles.addBtn, { backgroundColor: theme.primary }]} onPress={onAdd}>
      <Text style={styles.addBtnText}>+</Text>
    </TouchableOpacity>
  </View>
);

export default function NuevaNota() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = (useColorScheme() ?? 'light') === 'dark';

  const { addNote, addChecklist, addIdea, updateNoteLocation } = useNotesStore();
  const { tipo: tipoParam } = useLocalSearchParams<{ tipo: string }>();

  const [tipo, setTipo] = useState<typeof TIPOS[number]>(tipoParam as any || 'nota');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tareaInput, setTareaInput] = useState('');
  const [tareas, setTareas] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [color, setColor] = useState('#FFD700');
  const [errors, setErrors] = useState<any>({});
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time' | null>(null);

  const [reminderDate, setReminderDate] = useState(new Date());
  const [dateError, setDateError] = useState('');
  const [isDateValid, setIsDateValid] = useState(true);

  const inputStyle = [styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }];

  const guardar = async () => {
    setErrors({});
    const schema = tipo === 'nota' ? noteSchema : baseSchema;
    const result = schema.safeParse({ title, content });
    if (!result.success) return setErrors(result.error.flatten().fieldErrors);

    let created: any;

    if (tipo === 'nota') {
      created = await addNote({ title, content });
    } else if (tipo === 'tarea') {
      created = await addChecklist({
        title,
        items: tareas.map((t, i) => ({ id: `${Date.now()}-${i}`, text: t, isCompleted: false }))
      });
    } else {
      created = await addIdea({ title, content, color, tags });
    }

    getCurrentLocation().then((loc) => {
      if (loc) updateNoteLocation(created.id, loc);
    });

    setShowReminderModal(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleReminder = async (withReminder: boolean) => {
    setShowReminderModal(false);
    if (withReminder) await scheduleReminder(title, reminderDate);
    router.back();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { backgroundColor: isDark ? theme.card : theme.primary, paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backIcon, { color: isDark ? theme.text : '#fff' }]}>✕</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: isDark ? theme.text : '#fff' }]}>Nueva entrada</Text>

        <TouchableOpacity onPress={guardar} style={[styles.saveBtn, { backgroundColor: isDark ? theme.primary : 'rgba(255,255,255,0.2)' }]}>
          <Text style={styles.saveBtnText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.tipos}>
          {TIPOS.map((t) => (
            <TouchableOpacity key={t}
              style={[styles.tipoBtn, { borderColor: theme.border }, tipo === t && { backgroundColor: theme.primary, borderColor: theme.primary }]}
              onPress={() => { setTipo(t); setErrors({}); }}>
              <Text style={[styles.tipoText, { color: tipo === t ? '#fff' : theme.textSecondary }]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput style={[...inputStyle, errors.title && { borderColor: theme.danger }]}
          placeholder="Título" placeholderTextColor={theme.textTertiary}
          value={title} onChangeText={setTitle} />
        {errors.title && <Text style={[styles.error, { color: theme.danger }]}>{errors.title}</Text>}

        {tipo === 'nota' && (
          <>
            <TextInput style={[...inputStyle, styles.textarea, errors.content && { borderColor: theme.danger }]}
              placeholder="Contenido" placeholderTextColor={theme.textTertiary}
              value={content} onChangeText={setContent} multiline />
            {errors.content && <Text style={[styles.error, { color: theme.danger }]}>{errors.content}</Text>}
          </>
        )}

        {tipo === 'tarea' && (
          <>
            <AddRow value={tareaInput} onChange={setTareaInput}
              onAdd={() => tareaInput.trim() && (setTareas((p) => [...p, tareaInput.trim()]), setTareaInput(''))}
              placeholder="Añadir tarea" theme={theme} />

            {tareas.map((t, i) => (
              <View key={i} style={styles.itemRow}>
                <Text style={[styles.item, { color: theme.textSecondary }]}>• {t}</Text>
                <TouchableOpacity onPress={() => setTareas((p) => p.filter((_, idx) => idx !== i))}>
                  <Text style={[styles.remove, { color: theme.danger }]}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {tipo === 'idea' && (
          <>
            <AddRow value={tagInput} onChange={setTagInput}
              onAdd={() => tagInput.trim() && (setTags((p) => [...p, tagInput.trim()]), setTagInput(''))}
              placeholder="Añadir etiqueta" theme={theme} />

            <View style={styles.tags}>
              {tags.map((tag, i) => (
                <TouchableOpacity key={i} style={[styles.tag, { backgroundColor: theme.primary + '22' }]}
                  onPress={() => setTags((p) => p.filter((_, idx) => idx !== i))}>
                  <Text style={[styles.tagText, { color: theme.primary }]}>#{tag} ×</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { color: theme.text }]}>Color</Text>
            <View style={styles.colores}>
              {COLORES.map((c) => (
                <TouchableOpacity key={c}
                  style={[styles.colorBtn, { backgroundColor: c }, color === c && { borderWidth: 3, borderColor: theme.text }]}
                  onPress={() => setColor(c)} />
              ))}
            </View>

            <Text style={[styles.label, { color: theme.text }]}>Descripción</Text>
            <TextInput style={[...inputStyle, styles.textarea]}
              placeholder="Describe tu idea..." placeholderTextColor={theme.textTertiary}
              value={content} onChangeText={setContent} multiline />
          </>
        )}
      </ScrollView>

      <Modal
        visible={showReminderModal}
        transparent
        animationType="fade"
        onRequestClose={() => handleReminder(false)}
        onDismiss={() => handleReminder(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>¿Añadir recordatorio?</Text>
            <Text style={[styles.modalSub, { color: theme.textSecondary }]}>Te notificaremos para "{title}"</Text>

            {dateError !== '' && (
              <Text style={{ color: theme.danger, marginBottom: 8, fontWeight: '600' }}>
                {dateError}
              </Text>
            )}

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.dateBtn, { borderColor: pickerMode === 'date' ? theme.primary : theme.border }]}
                onPress={() => setPickerMode(pickerMode === 'date' ? null : 'date')}>
                <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>📅 Fecha</Text>
                <Text style={[styles.dateValue, { color: theme.text }]}>
                  {reminderDate.toLocaleDateString('es-ES')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.dateBtn, { borderColor: pickerMode === 'time' ? theme.primary : theme.border }]}
                onPress={() => setPickerMode(pickerMode === 'time' ? null : 'time')}>
                <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>🕐 Hora</Text>
                <Text style={[styles.dateValue, { color: theme.text }]}>
                  {reminderDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
            </View>

            {pickerMode && (
              <DateTimePickerCustom
                value={reminderDate}
                mode={pickerMode}
                onChange={(date) => {
                  const hoy = new Date();
                  hoy.setHours(0, 0, 0, 0);

                  const ahora = new Date();

                  if (date < hoy) {
                    setDateError('No puedes seleccionar una fecha pasada');
                    setReminderDate(ahora);
                    setIsDateValid(false);
                    setTimeout(() => setDateError(''), 2500);
                    return;
                  }

                  if (date.toDateString() === ahora.toDateString() && date < ahora) {
                    setDateError('La hora no puede ser anterior a la actual');
                    setReminderDate(ahora);
                    setIsDateValid(false);
                    setTimeout(() => setDateError(''), 2500);
                    return;
                  }

                  setIsDateValid(true);
                  setReminderDate(date);
                }}
              />
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, { borderColor: theme.border }]}
                onPress={() => handleReminder(false)}>
                <Text style={styles.modalBtnTextSec}>Sin recordatorio</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!isDateValid}
                style={[
                  styles.modalBtn,
                  { backgroundColor: isDateValid ? theme.primary : theme.border }
                ]}
                onPress={() => isDateValid && handleReminder(true)}
              >
                <Text style={[
                  styles.modalBtnText,
                  { opacity: isDateValid ? 1 : 0.4 }
                ]}>
                  Añadir 🔔
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 20 },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14 },
  backBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontSize: 18, fontWeight: '600' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700' },
  saveBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  tipos: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  tipoBtn: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  tipoText: { fontSize: 14, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8, fontSize: 16 },
  textarea: { height: 120, textAlignVertical: 'top' },
  error: { fontSize: 13, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 12, alignItems: 'center' },
  addBtn: { padding: 12, borderRadius: 8 },
  addBtnText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  item: { fontSize: 15, flex: 1 },
  remove: { fontSize: 18, paddingHorizontal: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  tag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 13 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  colores: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  colorBtn: { width: 36, height: 36, borderRadius: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalBox: { width: '100%', borderRadius: 20, padding: 24, gap: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalSub: { fontSize: 14, lineHeight: 20 },
  dateBtn: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, gap: 4 },
  dateLabel: { fontSize: 12 },
  dateValue: { fontSize: 13, fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  modalBtn: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  modalBtnText: { color: '#fff', fontWeight: '600' },
  modalBtnTextSec: { color: '#888', fontWeight: '600' }
});
