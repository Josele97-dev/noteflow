import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../constants/theme';
import { ChecklistNote } from '../../types';

interface Props {
  checklist: ChecklistNote;
  onPress: () => void;
}

export default function ChecklistCard({ checklist, onPress }: Props) {
  const theme = useTheme();
  const total = checklist.items.length;
  const completadas = checklist.items.filter((i) => i.isCompleted).length;
  const progreso = total > 0 ? (completadas / total) * 100 : 0;
  const fecha = new Date(checklist.createdAt).toLocaleDateString('es-ES');

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Feather name="check-circle" size={20} color={theme.primary} />
        <Text style={[styles.title, { color: theme.text }]}>{checklist.title}</Text>
      </View>

      <Text style={[styles.counter, { color: theme.textSecondary }]}>
        {completadas}/{total} tareas
      </Text>

      <View style={[styles.barraFondo, { backgroundColor: theme.border }]}>
        <View style={[styles.barraRelleno, { width: `${progreso}%` as any, backgroundColor: theme.success }]} />
      </View>

      <Text style={[styles.date, { color: theme.textTertiary }]}>{fecha}</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  title: { fontSize: 16, fontWeight: '600', flex: 1 },
  counter: { fontSize: 13, marginBottom: 8 },
  barraFondo: { height: 6, borderRadius: 3, marginBottom: 8 },
  barraRelleno: { height: 6, borderRadius: 3 },
  date: { fontSize: 12, marginTop: 4 },
});