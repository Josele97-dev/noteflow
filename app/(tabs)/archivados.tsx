import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FadeOutLeft } from '../../components/animations/FadeOutLeft';
import { useTheme } from '../../constants/theme';
import { useNotesStore } from '../../store/notesStore';

type ItemType = 'nota' | 'tarea' | 'idea';

type ArchivedItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  color?: string;
  type: ItemType;
};

export default function ArchivadosScreen() {
  const theme = useTheme();
  const {
    _hydrated,
    notes,
    checklists,
    ideas,
    unarchiveNote,
    unarchiveChecklist,
    unarchiveIdea,
    deleteNote,
    deleteChecklist,
    deleteIdea
  } = useNotesStore();

  const [busqueda, setBusqueda] = useState('');
  const [saliendoId, setSaliendoId] = useState<string | null>(null);

  if (!_hydrated) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  const q = busqueda.toLowerCase();
  const matches = (title: string) => title.toLowerCase().includes(q);

  const sections: Array<{ label: string; items: ArchivedItem[] }> = [
    {
      label: 'NOTAS',
      items: notes
        .filter((n) => n.archived && matches(n.title))
        .map<ArchivedItem>((n) => ({
          id: n.id,
          title: n.title,
          subtitle: n.content,
          icon: 'file-text',
          type: 'nota',
        })),
    },
    {
      label: 'TAREAS',
      items: checklists
        .filter((c) => c.archived && matches(c.title))
        .map<ArchivedItem>((c) => ({
          id: c.id,
          title: c.title,
          subtitle: `${c.items.filter((i) => i.isCompleted).length}/${c.items.length} completadas`,
          icon: 'check-circle',
          type: 'tarea',
        })),
    },
    {
      label: 'IDEAS',
      items: ideas
        .filter((i) => i.archived && matches(i.title))
        .map<ArchivedItem>((i) => ({
          id: i.id,
          title: i.title,
          subtitle: i.tags.length > 0 ? i.tags.join(', ') : 'Sin etiquetas',
          icon: 'zap',
          color: i.color,
          type: 'idea',
        })),
    },
  ];

  const total = sections.reduce((acc, s) => acc + s.items.length, 0);

  // DESARCHIVAR → vibración Light
  const activarSalida = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaliendoId(id);
  };

  // ELIMINAR → vibración Warning al pulsar y al confirmar
  const confirmarEliminar = (id: string, nombre: string) => {
    // vibración al pulsar el botón rojo
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    Alert.alert('Eliminar', `¿Seguro que quieres eliminar "${nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          // vibración al confirmar
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          activarSalida(id);
        }
      },
    ]);
  };

  const onFinish = (id: string, type: ItemType) => {
    // vibración Light al desarchivar (igual que Archivar/Editar)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (type === 'nota') unarchiveNote(id);
    else if (type === 'tarea') unarchiveChecklist(id);
    else unarchiveIdea(id);

    setSaliendoId(null);
  };

  const renderCard = (item: ArchivedItem) => (
    <View style={[styles.card, { backgroundColor: item.color || theme.card }]}>
      <Feather name={item.icon} size={18} color={theme.primary} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.cardSub, { color: theme.textSecondary }]} numberOfLines={1}>
          {item.subtitle}
        </Text>
      </View>

      {/* DESARCHIVAR */}
      <TouchableOpacity
        style={[styles.accionBtn, { backgroundColor: theme.primary + '22' }]}
        onPress={() => activarSalida(item.id)}
      >
        <Feather name="corner-up-left" size={16} color={theme.primary} />
      </TouchableOpacity>

      {/* ELIMINAR DEFINITIVO */}
      <TouchableOpacity
        style={[styles.accionBtn, { backgroundColor: theme.danger + '22', marginLeft: 8 }]}
        onPress={() => confirmarEliminar(item.id, item.title)}
      >
        <Feather name="trash-2" size={16} color={theme.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.search, { backgroundColor: theme.card }]}>
        <Feather name="search" size={18} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Buscar archivados..."
          placeholderTextColor={theme.textTertiary}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {total === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {busqueda ? 'Sin resultados' : 'No hay elementos archivados'}
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
            {busqueda ? 'Prueba otra búsqueda' : 'Archiva notas, tareas o ideas para verlas aquí'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {sections.map(({ label, items }) =>
            items.length === 0 ? null : (
              <View key={label}>
                <Text style={[styles.seccion, { color: theme.textSecondary }]}>{label}</Text>

                {items.map((item) =>
                  saliendoId === item.id ? (
                    <FadeOutLeft key={item.id} duration={250} onFinish={() => onFinish(item.id, item.type)}>
                      {renderCard(item)}
                    </FadeOutLeft>
                  ) : (
                    <View key={item.id}>{renderCard(item)}</View>
                  )
                )}
              </View>
            )
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 18, fontWeight: '600' },
  emptySubtext: { fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 },
  seccion: { fontSize: 12, fontWeight: '700', marginBottom: 8, marginTop: 16, letterSpacing: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSub: { fontSize: 13, marginTop: 2 },
  accionBtn: { padding: 8, borderRadius: 8 },
});
