import NoteCard from '@/components/items/NoteCard';
import { BaseList } from '@/components/lists/BaseList';
import { useTheme } from '@/constants/theme';
import { useNotesStore } from '@/store/notesStore';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function NotasScreen() {
  const { notes, _hydrated, deleteNote } = useNotesStore();
  const router = useRouter();
  const theme = useTheme();

  if (!_hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  const activas = notes.filter((n) => !n.archived);

  return (
    <BaseList
      data={activas}
      searchKeys={(n) => [n.title, n.content]}
      searchPlaceholder="Buscar notas..."
      emptyTitle="No hay notas aún"
      emptySubtitle="Pulsa + para crear una"
      renderItem={({ item, index }) => (
        <NoteCard
          note={item}
          index={index}
          onPress={() => router.push(`/notas/${item.id}`)}
          onDelete={() => deleteNote(item.id)}
        />
      )}
    />
  );
}