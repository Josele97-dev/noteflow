import { FadeInDown } from '@/components/animations/FadeInDown';
import { ItemActions } from '@/components/items/ItemActions';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNotesStore } from '../../store/notesStore';

export default function IdeaDetalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { ideas, deleteIdea, archiveIdea } = useNotesStore();

  const idea = ideas.find((i) => i.id === id);
  const ideaRef = useRef(idea);
  if (idea) ideaRef.current = idea;
  const data = ideaRef.current;

  if (!data) return <View style={{ flex: 1 }} />;

  const tags = Array.isArray(data.tags) ? data.tags : [];

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

  const editar = () =>
    router.push({ pathname: '/ideas/editar/EditIdeaScreen', params: { id } });

  const baseDelay = data.content ? 100 : 0;

  return (
    <View style={[styles.container, { backgroundColor: data.color }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FadeInDown duration={400} offset={-30}>
          <Text style={[styles.fecha, { color: 'rgba(0,0,0,0.4)' }]}>{fecha}</Text>
        </FadeInDown>

        <FadeInDown duration={400} offset={-30} delay={100}>
          <Text style={styles.title}>{data.title}</Text>
        </FadeInDown>

        {data.content && (
          <FadeInDown duration={400} offset={-30} delay={200}>
            <Text style={styles.content}>{data.content}</Text>
          </FadeInDown>
        )}

        {/* 🔥 Render seguro de tags */}
        {tags.length > 0 && (
          <FadeInDown duration={400} offset={-30} delay={200 + baseDelay}>
            <View style={styles.tags}>
              {tags.map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </FadeInDown>
        )}
      </ScrollView>

      <FadeInDown duration={400} offset={-30} delay={300 + baseDelay}>
        <ItemActions
          variant="color"
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
    color: '#1a1a1a',
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 16,
    color: '#1a1a1a',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: { fontSize: 14, color: '#1a1a1a' },
});
