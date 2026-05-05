import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../constants/theme';
import { IdeaNote } from '../../types';

interface Props {
  idea: IdeaNote;
  onPress: () => void;
}

export default function IdeaCard({ idea, onPress }: Props) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: idea.color || theme.card, borderColor: theme.border }]}
      onPress={onPress}
    >
      <View style={styles.row}>
        <Ionicons name="bulb-outline" size={22} color={theme.primary} style={{ marginRight: 10 }} />
        <Text style={[styles.title, { color: theme.text }]}>{idea.title}</Text>
      </View>

      {idea.tags.length > 0 && (
        <View style={styles.tags}>
          {idea.tags.map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: theme.textTertiary + '22' }]}>
              <Text style={[styles.tagText, { color: theme.textSecondary }]}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}
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
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 16, fontWeight: '600', flexShrink: 1 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 12 },
});