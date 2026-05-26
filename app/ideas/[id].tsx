import { FadeInDown } from '@/components/animations/FadeInDown';
import { ItemActions } from '@/components/items/ItemActions';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../constants/theme';
import { useNotesStore } from '../../store/notesStore';

export default function IdeaDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { ideas, deleteIdea, archiveIdea } = useNotesStore();

  const data = ideas.find((i) => i.id === id);
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
      { text: titulo, style: titulo === 'Eliminar' ? 'destructive' : 'default', onPress: accion },
    ]);
  }

  const eliminar = () =>
    confirmar('Eliminar', '¿Seguro que quieres eliminar esta idea?', () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      deleteIdea(id);
      router.back();
    });

  const archivar = () =>
    confirmar('Archivar', '¿Quieres archivar esta idea?', () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      archiveIdea(id);
      router.back();
    });

  const editar = () => {
    if (isOpening) return;
    setIsOpening(true);
    router.push({ pathname: '/ideas/editar/EditIdeaScreen', params: { id } });
    setTimeout(() => setIsOpening(false), 600);
  };

  return (
    <View style={[styles.container, { backgroundColor: data.color }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Overlay blanco */}
        <View style={[styles.overlay]}>
          <FadeInDown duration={400} offset={-30}>
            <Text style={[styles.fecha, { color: theme.textTertiary }]}>{fecha}</Text>
          </FadeInDown>

          <FadeInDown duration={400} offset={-30} delay={100}>
            <Text style={styles.title}>{data.title}</Text>
          </FadeInDown>

          {data.tags.length > 0 && (
            <FadeInDown duration={400} offset={-30} delay={150}>
              <View style={styles.tags}>
                {data.tags.map((tag, i) => (
                  <View key={i} style={[styles.tag, { backgroundColor: theme.primary + '22' }]}>
                    <Text style={[styles.tagText, { color: theme.primary }]}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </FadeInDown>
          )}

          {data.content && (
            <FadeInDown duration={400} offset={-30} delay={250}>
              <Text style={styles.content}>{data.content}</Text>
            </FadeInDown>
          )}

          {data.location && (
            <FadeInDown duration={400} offset={-30} delay={300}>
              <TouchableOpacity
                style={[
                  styles.locationRow,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={[styles.locationText, { color: theme.textSecondary }]}>
                  {data.location.address}
                </Text>
              </TouchableOpacity>
            </FadeInDown>
          )}
        </View>
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

  overlay: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    padding: 16,
  },

  fecha: { fontSize: 13, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },

  title: { fontSize: 28, fontWeight: '700', marginBottom: 16, lineHeight: 34, color: '#000' },

  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagText: { fontSize: 13, fontWeight: '600' },

  content: { fontSize: 16, lineHeight: 26, marginBottom: 20, color: '#000' },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  locationIcon: { fontSize: 16 },
  locationText: { fontSize: 13, flex: 1 },
});
