import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../constants/theme';
import { IdeaNote } from '../../types';

function getReadableTextColor(bgColor: string) {
  if (!bgColor) return '#000';

  const c = bgColor.replace('#', '');
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  return luminance > 160 ? '#000' : '#fff';
}

interface Props {
  idea: IdeaNote;
  onPress: () => void;
}

export default function IdeaCard({ idea, onPress }: Props) {
  const theme = useTheme();

  const bg = idea.color || theme.card;
  const readable = getReadableTextColor(bg);

  const textColor = readable;
  const textSecondary =
    readable === '#000' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
  const iconColor = readable;
  const btnColor =
    readable === '#000' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)';

  const tags = Array.isArray(idea.tags) ? idea.tags : [];
  const fecha = new Date(idea.createdAt).toLocaleDateString('es-ES');

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: bg, borderColor: theme.border },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.row}>
        <Ionicons
          name="bulb-outline"
          size={22}
          color={iconColor}
          style={{ marginRight: 10 }}
        />
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {idea.title}
        </Text>
      </View>

      {tags.length > 0 && (
        <View style={styles.tags}>
          {tags.map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: btnColor }]}>
              <Text style={[styles.tagText, { color: textSecondary }]}>
                #{tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      <Text style={[styles.date, { color: textSecondary }]}>{fecha}</Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
  },
  date: {
    fontSize: 12,
    marginTop: 4,
  },
});
