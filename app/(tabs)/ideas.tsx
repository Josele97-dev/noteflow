import IdeaCard from '@/components/items/IdeaCard';
import { Feather } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../constants/theme';
import { useNotesStore } from '../../store/notesStore';
import type { IdeaNote } from '../../types';

const List = FlashList as any;

export default function IdeasScreen() {
  const { ideas, _hydrated } = useNotesStore();
  const router = useRouter();
  const theme = useTheme();
  const [busqueda, setBusqueda] = useState('');

  if (!_hydrated) return (
    <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator color={theme.primary} />
    </View>
  );

  const q = busqueda.toLowerCase();
  const activas = ideas.filter((i) => !i.archived);
  const filtradas = busqueda
    ? activas.filter((i) => i.title.toLowerCase().includes(q) || i.tags.some((t) => t.toLowerCase().includes(q)))
    : activas;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.search, { backgroundColor: theme.card }]}>
        <Feather name="search" size={18} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Buscar ideas o etiquetas..."
          placeholderTextColor={theme.textTertiary}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {filtradas.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {activas.length === 0 ? 'No hay ideas aún' : 'Sin resultados'}
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
            {activas.length === 0 ? 'Pulsa + para crear una' : 'Prueba otra búsqueda'}
          </Text>
        </View>
      ) : (
        <List
          data={filtradas}
          keyExtractor={(item: IdeaNote) => item.id}
          estimatedItemSize={100}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={({ item }: { item: IdeaNote }) => (
            <IdeaCard idea={item} onPress={() => router.push(`/ideas/${item.id}`)} />
          )}
        />
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
  emptySubtext: { fontSize: 14, marginTop: 8 },
});