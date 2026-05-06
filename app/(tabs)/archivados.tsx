import ArchivedSection from '@/components/archived/ArchivedSection';
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

  if (!_hydrated) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  const q = busqueda.toLowerCase();
  const matches = (title: string) => title.toLowerCase().includes(q);

  const sections = [
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
          subtitle: i.tags.length > 0 ? i.tags.join(', ') : '',
          icon: 'zap',
          color: i.color,
          type: 'idea',
        })),
    },
  ];

  const total = sections.reduce((acc, s) => acc + s.items.length, 0);

  const activarSalida = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaliendoId(id);
  };

  const confirmarEliminar = (id: string, nombre: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Eliminar', `¿Seguro que quieres eliminar "${nombre}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          activarSalida(id);
        },
      },
    ]);
  };

  const onFinish = (id: string, type: ItemType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (type === 'nota') unarchiveNote(id);
    else if (type === 'tarea') unarchiveChecklist(id);
    else unarchiveIdea(id);
    setSaliendoId(null);
  };

  const renderCard = (item: ArchivedItem) => {
    const { textColor, textSecondary, btnColor, iconColor, dangerBtnColor, dangerIconColor } =
      getColoredItemStyles(item.color, theme);

    return (
      <View style={[styles.card, { backgroundColor: item.color || theme.card }]}>
        <Feather name={item.icon} size={18} color={iconColor} style={{ marginRight: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: textColor }]}>{item.title}</Text>
          {item.subtitle ? (
            <Text style={[styles.cardSub, { color: textSecondary }]} numberOfLines={1}>
              {item.subtitle}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.accionBtn, { backgroundColor: btnColor }]}
          onPress={() => activarSalida(item.id)}
        >
          <Feather name="corner-up-left" size={16} color={iconColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.accionBtn, { backgroundColor: dangerBtnColor, marginLeft: 8 }]}
          onPress={() => confirmarEliminar(item.id, item.title)}
        >
          <Feather name="trash-2" size={16} color={dangerIconColor} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }: { item: ArchivedItem }) =>
    saliendoId === item.id ? (
      <FadeOutLeft duration={250} onFinish={() => onFinish(item.id, item.type)}>
        {renderCard(item)}
      </FadeOutLeft>
    ) : (
      renderCard(item)
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
          <ArchivedSection title="NOTAS" data={sections[0].items} renderItem={renderItem} />
          <ArchivedSection title="TAREAS" data={sections[1].items} renderItem={renderItem} />
          <ArchivedSection title="IDEAS" data={sections[2].items} renderItem={renderItem} />
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
  },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 18, fontWeight: '600' },
  emptySubtext: { fontSize: 14, marginTop: 8, textAlign: 'center', paddingHorizontal: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSub: { fontSize: 13, marginTop: 2 },
  accionBtn: { padding: 8, borderRadius: 8 },
});