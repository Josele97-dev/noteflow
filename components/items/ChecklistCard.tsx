import { Feather, Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { Easing, FadeInDown, FadeOutLeft } from 'react-native-reanimated';
import { useTheme } from '../../constants/theme';

type ChecklistItem = { id: string; text: string; isCompleted: boolean };
type Checklist = { id: string; title: string; createdAt: string | number | Date; items: ChecklistItem[] };
type Props = { checklist: Checklist; onPress: () => void; onDelete: () => void; index?: number };

export default function ChecklistCard({ checklist, onPress, onDelete, index = 0 }: Props) {
  const theme = useTheme();
  const [removing, setRemoving] = useState(false);
  const onDeleteRef = useRef(onDelete);
  onDeleteRef.current = onDelete;

  const total = checklist.items.length;
  const completadas = checklist.items.filter(i => i.isCompleted).length;
  const progreso = total ? (completadas / total) * 100 : 0;
  const fecha = new Date(checklist.createdAt).toLocaleDateString('es-ES');

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
          style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.header}>
            <View style={[styles.iconBadge, { backgroundColor: theme.primary + '15' }]}>
              <Feather name="list" size={16} color={theme.primary} />
            </View>
            <Text numberOfLines={1} style={[styles.title, { color: theme.text }]}>{checklist.title}</Text>
          </View>
          <Text style={[styles.counter, { color: theme.textSecondary }]}>{completadas} de {total} completadas</Text>
          <View style={[styles.barraFondo, { backgroundColor: theme.border }]}>
            <View style={[styles.barraRelleno, { width: `${progreso}%`, backgroundColor: theme.success }]} />
          </View>
          <Text style={[styles.date, { color: theme.textTertiary }]}>{fecha}</Text>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 16, marginHorizontal: 16, marginVertical: 8, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  iconBadge: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '600', flex: 1 },
  counter: { fontSize: 13, marginBottom: 8 },
  barraFondo: { height: 6, borderRadius: 3, marginBottom: 10, overflow: 'hidden' },
  barraRelleno: { height: 6, borderRadius: 3 },
  date: { fontSize: 12, marginTop: 2 },
  deleteContainer: { marginVertical: 8, marginRight: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center', width: 80 },
});