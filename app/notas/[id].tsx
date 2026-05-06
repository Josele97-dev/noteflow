import { FadeInDown } from '@/components/animations/FadeInDown';
import { ItemActions } from '@/components/items/ItemActions';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../constants/theme';
import { useNotesStore } from '../../store/notesStore';

export default function NotaDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { notes, deleteNote, archiveNote } = useNotesStore();

  const nota = notes.find((n) => n.id === id);
  const notaRef = useRef(nota);
  if (nota) notaRef.current = nota;
  const data = notaRef.current;

  const [isOpening, setIsOpening] = useState(false);

  if (!data) return <View style={{ flex: 1, backgroundColor: theme.background }} />;

  const fecha = new Date(data.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
    confirmar('Eliminar', '¿Seguro que quieres eliminar esta nota?', () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      deleteNote(id);
      router.back();
    });

  const archivar = () =>
    confirmar('Archivar', '¿Quieres archivar esta nota?', () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      archiveNote(id);
      router.back();
    });

  const editar = () => {
    if (isOpening) return;
    setIsOpening(true);
    router.push({ pathname: '/notas/editar/EditNoteScreen', params: { id } });
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
        </FadeInDown>

        <FadeInDown duration={400} offset={-30} delay={200}>
          <View style={[styles.separador, { backgroundColor: theme.border }]} />
          <Text style={[styles.content, { color: theme.textSecondary }]}>{data.content}</Text>
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
    marginBottom: 16,
    lineHeight: 34,
  },
  separador: { height: 1, marginBottom: 20 },
  content: { fontSize: 16, lineHeight: 26 },
});