import ArchivedSection from '@/components/archived/ArchivedSection';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
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
import { getColoredItemStyles } from '../../utils/ideaColors';

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
    deleteIdea,
  } = useNotesStore();

  const [busqueda, setBusqueda] = useState('');
  const [saliendoId, setSaliendoId] = useState<string | null>(null);
  const [accionPendiente, setAccionPendiente] =
    useState<'delete' | 'unarchive' | null>(null);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);

  useEffect(() => {
    const archivedIds = [
      ...notes.filter(n => n.archived).map(n => n.id),
      ...checklists.filter(c => c.archived).map(c => c.id),
      ...ideas.filter(i => i.archived).map(i => i.id),
    ];

    setHiddenIds(prev =>
      prev.filter(id => archivedIds.includes(id))
    );
  }, [notes, checklists, ideas]);

  if (!_hydrated) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  const matches = (title: string) =>
    title.toLowerCase().includes(busqueda.toLowerCase());

  const mapItems = <T extends { id: string; title: string; archived: boolean }>(
    data: T[],
    mapper: (item: T) => ArchivedItem
  ) =>
    data
      .filter(
        item =>
          item.archived &&
          matches(item.title) &&
          !hiddenIds.includes(item.id)
      )
      .map(mapper);

  const sections = [
    {
      title: 'NOTAS',
      data: mapItems(notes, n => ({
        id: n.id,
        title: n.title,
        subtitle: n.content ?? '',   // ← SEGURO
        icon: 'file-text',
        type: 'nota',
      })),
    },
    {
      title: 'TAREAS',
      data: mapItems(checklists, c => {
        const items = c.items ?? []; // ← SEGURO
        const completed = items.filter(i => i?.isCompleted).length;
        return {
          id: c.id,
          title: c.title,
          subtitle: `${completed}/${items.length} completadas`,
          icon: 'check-circle',
          type: 'tarea',
        };
      }),
    },
    {
      title: 'IDEAS',
      data: mapItems(ideas, i => ({
        id: i.id,
        title: i.title,
        subtitle: (i.tags ?? []).join(', '), // ← SEGURO
        icon: 'zap',
        color: i.color,
        type: 'idea',
      })),
    },
  ];

  const total = sections.reduce((a, s) => a + s.data.length, 0);

  const activarSalida = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaliendoId(id);
  };

  const confirmarEliminar = (id: string, nombre: string) =>
    Alert.alert('Eliminar', `¿Seguro que quieres eliminar "${nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          setAccionPendiente('delete');
          activarSalida(id);
        },
      },
    ]);

  const onFinish = (id: string, type: ItemType) => {
    setHiddenIds(prev => [...prev, id]);

    if (accionPendiente === 'delete') {
      if (type === 'nota') deleteNote(id);
      else if (type === 'tarea') deleteChecklist(id);
      else deleteIdea(id);
    } else {
      if (type === 'nota') unarchiveNote(id);
      else if (type === 'tarea') unarchiveChecklist(id);
      else unarchiveIdea(id);
    }

    setSaliendoId(null);
    setAccionPendiente(null);
  };

  const renderCard = (item: ArchivedItem) => {
    const s = getColoredItemStyles(item.color, theme);

    return (
      <View style={[styles.card, { backgroundColor: item.color || theme.card }]}>
        <Feather
          name={item.icon}
          size={18}
          color={s.iconColor}
          style={{ marginRight: 12 }}
        />

        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: s.textColor }]}>
            {item.title}
          </Text>

          {!!item.subtitle && (
            <Text
              numberOfLines={1}
              style={[styles.cardSub, { color: s.textSecondary }]}
            >
              {item.subtitle}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.accionBtn, { backgroundColor: s.btnColor }]}
          onPress={() => {
            setAccionPendiente('unarchive');
            activarSalida(item.id);
          }}
        >
          <Feather
            name="corner-up-left"
            size={16}
            color={s.iconColor}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.accionBtn,
            { backgroundColor: s.dangerBtnColor, marginLeft: 8 },
          ]}
          onPress={() =>
            confirmarEliminar(item.id, item.title)
          }
        >
          <Feather
            name="trash-2"
            size={16}
            color={s.dangerIconColor}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }: { item: ArchivedItem }) =>
    saliendoId === item.id ? (
      <FadeOutLeft
        duration={250}
        onFinish={() => onFinish(item.id, item.type)}
      >
        {renderCard(item)}
      </FadeOutLeft>
    ) : (
      renderCard(item)
    );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.search, { backgroundColor: theme.card }]}>
        <Feather
          name="search"
          size={18}
          color={theme.textSecondary}
        />

        <TextInput
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Buscar archivados..."
          placeholderTextColor={theme.textTertiary}
          style={[styles.searchInput, { color: theme.text }]}
        />
      </View>

      {!total ? (
        <View style={[styles.empty, styles.center]}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {busqueda ? 'Sin resultados' : 'No hay elementos archivados'}
          </Text>

          <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
            {busqueda
              ? 'Prueba otra búsqueda'
              : 'Archiva notas, tareas o ideas para verlas aquí'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {sections.map(section => (
            <ArchivedSection
              key={section.title}
              title={section.title}
              data={section.data}
              renderItem={renderItem}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 16,
    borderRadius: 12,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },

  empty: { flex: 1 },

  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },

  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  cardSub: {
    fontSize: 13,
    marginTop: 2,
  },

  accionBtn: {
    padding: 8,
    borderRadius: 8,
  },
});
