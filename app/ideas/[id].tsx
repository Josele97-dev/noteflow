import { FadeInDown } from '@/components/animations/FadeInDown';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/theme';
import { useNotesStore } from '../../store/notesStore';

export default function IdeaDetalle() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id as string;

  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { ideas, deleteIdea, archiveIdea } = useNotesStore();

  const idea = ideas.find((i) => i.id === id);
  const ideaRef = useRef(idea);
  if (idea) ideaRef.current = idea;
  const data = ideaRef.current;

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
    confirmar('Eliminar', '¿Seguro que quieres eliminar esta idea?', () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); // vibración al confirmar
      deleteIdea(id);
      router.back();
    });

  const archivar = () =>
    confirmar('Archivar', '¿Quieres archivar esta idea?', () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // vibración al confirmar
      archiveIdea(id);
      router.back();
    });

  const editar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // vibración al pulsar

    router.push({
      pathname: '/ideas/editar/EditIdeaScreen',
      params: { id },
    });
  };

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

        <FadeInDown duration={400} offset={-30} delay={200 + baseDelay}>
          <View style={styles.tags}>
            {data.tags.map((tag, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </FadeInDown>
      </ScrollView>

      <FadeInDown duration={400} offset={-30} delay={300 + baseDelay}>
        <View style={[styles.actions, { paddingBottom: insets.bottom + 12 }]}>

          {/* EDITAR */}
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: 'rgba(0,0,0,0.15)' }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // vibración al pulsar
              editar();
            }}
          >
            <Text style={styles.btnText}>Editar</Text>
          </TouchableOpacity>

          {/* ARCHIVAR — vibración al pulsar + vibración al confirmar */}
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: 'rgba(0,0,0,0.15)' }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // vibración al pulsar
              archivar(); // vibración al confirmar
            }}
          >
            <Text style={styles.btnText}>Archivar</Text>
          </TouchableOpacity>

          {/* ELIMINAR — vibración al pulsar + vibración al confirmar */}
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#ff4444' }]}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); // vibración al pulsar
              eliminar(); // vibración al confirmar
            }}
          >
            <Text style={styles.btnText}>Eliminar</Text>
          </TouchableOpacity>

        </View>
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
  tagText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  btn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
