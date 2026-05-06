import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../constants/theme';
import { Note } from '../../types';

interface Props {
  note: Note;
  onPress: () => void;
}

export default function NoteCard({ note, onPress }: Props) {
  const theme = useTheme();
  const fecha = new Date(note.createdAt).toLocaleDateString('es-ES');

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={onPress}
    >
      <View style={styles.row}>
        <Ionicons name="document-text-outline" size={22} color={theme.primary} style={{ marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: theme.text }]}>{note.title}</Text>
          <Text style={[styles.content, { color: theme.textSecondary }]} numberOfLines={2}>{note.content}</Text>
          <Text style={[styles.date, { color: theme.textTertiary }]}>{fecha}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  content: { fontSize: 14, marginBottom: 8 },
  date: { fontSize: 12 },
});