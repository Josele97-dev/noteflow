import { FadeInDown } from '@/components/animations/FadeInDown';
import { ItemActions } from '@/components/items/ItemActions';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../constants/theme';
import { useNotesStore } from '../../store/notesStore';

export default function NotaDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { notes, deleteNote, archiveNote } = useNotesStore();

  const data = notes.find((n) => n.id === id);
  const [isOpening, setIsOpening] = useState(false);

  if (!data) return <View style={{ flex: 1, backgroundColor: theme.background }} />;

  const fecha = new Date(data.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  function confirmar(titulo: string, mensaje: string, accion: () => void) {
    if (Platform.OS === 'web') {
      if (window.confirm(mensaje)) accion();
      return;
    }
    Alert.alert(titulo, mensaje, [
      { text: 'Cancelar', style: 'cancel' },
      { text: titulo, style: titulo === 'Eliminar' ? 'destructive' : 'default', onPress: accion },
    ]);
  }

  const eliminar = () =>
    confirmar('Eliminar', '¿Seguro que quieres eliminar esta nota?', () => {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      deleteNote(id);
      router.back();
    });

  const archivar = () =>
    confirmar('Archivar', '¿Quieres archivar esta nota?', () => {
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
    <View style={[styles.container, { backgroundColor: theme.background }]} accessible accessibilityLabel="Pantalla de detalle de nota">
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FadeInDown duration={400} offset={-30}>
          <Text style={[styles.fecha, { color: theme.textTertiary }]} accessible accessibilityRole="text" accessibilityLabel={`Fecha de creación: ${fecha}`}>
            {fecha}
          </Text>
        </FadeInDown>

        <FadeInDown duration={400} offset={-30} delay={100}>
          <Text style={[styles.title, { color: theme.text }]} accessible accessibilityRole="header" accessibilityLabel={`Título de la nota: ${data.title}`}>
            {data.title}
          </Text>
        </FadeInDown>

        <FadeInDown duration={400} offset={-30} delay={200}>
          <View style={[styles.separador, { backgroundColor: theme.border }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
          <Text style={[styles.content, { color: theme.textSecondary }]} accessible accessibilityRole="text" accessibilityLabel={`Contenido de la nota: ${data.content}`}>
            {data.content}
          </Text>
        </FadeInDown>

        {data.location && (
          <FadeInDown duration={400} offset={-30} delay={300}>
            <TouchableOpacity
              style={[styles.locationRow, { backgroundColor: theme.card, borderColor: theme.border }]}
              activeOpacity={0.7} accessible accessibilityRole="button"
              accessibilityLabel={`Ubicación guardada: ${data.location.address}`}
              accessibilityHint="Muestra la ubicación asociada a esta nota"
            >
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={[styles.locationText, { color: theme.textSecondary }]}>{data.location.address}</Text>
            </TouchableOpacity>
          </FadeInDown>
        )}
      </ScrollView>

      <FadeInDown duration={400} offset={-30} delay={300}>
        <ItemActions isOpening={isOpening} onEditar={editar} onArchivar={archivar} onEliminar={eliminar} />
      </FadeInDown>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  fecha: { fontSize: 13, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16, lineHeight: 34 },
  separador: { height: 1, marginBottom: 20 },
  content: { fontSize: 16, lineHeight: 26 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 24, padding: 12, borderRadius: 12, borderWidth: 1 },
  locationIcon: { fontSize: 16 },
  locationText: { fontSize: 13, flex: 1 },
});