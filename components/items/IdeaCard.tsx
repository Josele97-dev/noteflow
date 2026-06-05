import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { Easing, FadeInDown, FadeOutLeft } from 'react-native-reanimated';
import { useTheme } from '../../constants/theme';

function getReadableTextColor(bgColor: string) {
  const rgb = parseInt(bgColor.replace('#', ''), 16);
  const luminance = 0.299 * ((rgb >> 16) & 0xff) + 0.587 * ((rgb >> 8) & 0xff) + 0.114 * (rgb & 0xff);
  return luminance > 160 ? '#000' : '#fff';
}

type Idea = { id: string; title: string; color: string; tags: string[]; createdAt: string | number | Date };
type Props = { idea: Idea; onPress: () => void; onDelete: () => void; index?: number };

export default function IdeaCard({ idea, onPress, onDelete, index = 0 }: Props) {
  const theme = useTheme();
  const [removing, setRemoving] = useState(false);
  const onDeleteRef = useRef(onDelete);
  onDeleteRef.current = onDelete;

  const bg = idea.color || theme.card;
  const readable = getReadableTextColor(bg);
  const textSecondary = readable === '#000' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
  const btnColor = readable === '#000' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)';
  const tags = Array.isArray(idea.tags) ? idea.tags : [];
  const fecha = new Date(idea.createdAt).toLocaleDateString('es-ES');

  useEffect(() => {
    if (!removing) return;
    const t = setTimeout(() => onDeleteRef.current?.(), 200);
    return () => clearTimeout(t);
  }, [removing]);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 40).springify()}
      exiting={FadeOutLeft.duration(200).easing(Easing.out(Easing.cubic))}
      style={removing && { opacity: 0.95 }}>
      <Swipeable enabled={!removing} friction={1.7} rightThreshold={28} overshootRight={false}
        onSwipeableWillOpen={() => setRemoving(true)}
        renderRightActions={() => (
          <View style={[styles.deleteContainer, { backgroundColor: theme.danger }]}>
            <Ionicons name="trash-outline" size={22} color="#fff" />
          </View>
        )}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.9} disabled={removing}
          style={[styles.card, { backgroundColor: bg, borderColor: theme.border }]}>
          <View style={styles.row}>
            <Ionicons name="bulb-outline" size={20} color={readable} style={{ marginRight: 10 }} />
            <Text numberOfLines={1} style={[styles.title, { color: readable }]}>{idea.title}</Text>
          </View>
          {tags.length > 0 && (
            <View style={styles.tags}>
              {tags.map((tag, i) => (
                <View key={i} style={[styles.tag, { backgroundColor: btnColor }]}>
                  <Text style={[styles.tagText, { color: textSecondary }]}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
          <View style={styles.footer}>
            <Text style={[styles.date, { color: textSecondary }]}>{fecha}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 16, marginHorizontal: 16, marginVertical: 8, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 16, fontWeight: '600', flexShrink: 1 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  tag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 12 },
  date: { fontSize: 12, marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end' },
  deleteContainer: { marginVertical: 8, marginRight: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center', width: 80 },
});