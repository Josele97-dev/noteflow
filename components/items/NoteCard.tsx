import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { Easing, FadeInDown, FadeOutLeft } from 'react-native-reanimated';
import { useTheme } from '../../constants/theme';
import { Note } from '../../types';

interface Props { note: Note; onPress: () => void; onDelete?: () => void; index?: number }

export default function NoteCard({ note, onPress, onDelete, index = 0 }: Props) {
  const theme = useTheme();
  const [removing, setRemoving] = useState(false);
  const onDeleteRef = useRef(onDelete);
  onDeleteRef.current = onDelete;

  const fecha = new Date(note.createdAt).toLocaleDateString('es-ES');

  useEffect(() => {
    if (!removing) return;
    const t = setTimeout(() => onDeleteRef.current?.(), 250);
    return () => clearTimeout(t);
  }, [removing]);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 40).springify()}
      exiting={FadeOutLeft.duration(250).easing(Easing.out(Easing.cubic))}
      style={removing ? { opacity: 0.9 } : undefined}>
      <Swipeable
        enabled={!removing}
        friction={1.5}
        rightThreshold={20}
        overshootRight={false}
        overshootFriction={1}
        onSwipeableWillOpen={() => setRemoving(true)}
        renderRightActions={() => (
          <View style={[styles.deleteContainer, { backgroundColor: theme.danger }]}>
            <Ionicons name="trash-outline" size={22} color="#fff" />
          </View>
        )}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.88} disabled={removing}
          style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.header}>
            <View style={[styles.iconBadge, { backgroundColor: theme.primary + '15' }]}>
              <Ionicons name="document-text-outline" size={18} color={theme.primary} />
            </View>
            <Text numberOfLines={1} style={[styles.title, { color: theme.text }]}>{note.title}</Text>
          </View>
          <Text numberOfLines={2} style={[styles.content, { color: theme.textSecondary }]}>{note.content}</Text>
          <View style={styles.footer}>
            <Text style={[styles.date, { color: theme.textTertiary }]}>{fecha}</Text>
            {note.location && (
              <View style={[styles.locationPill, { backgroundColor: theme.border + '40' }]}>
                <Ionicons name="location-outline" size={12} color={theme.textTertiary} />
                <Text numberOfLines={1} style={[styles.locationText, { color: theme.textTertiary }]}>{note.location.address}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
}

const cardShadow = Platform.select({
  web: { boxShadow: '0px 4px 10px rgba(0,0,0,0.06)' },
  default: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
});

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 14, marginHorizontal: 16, marginVertical: 8, borderWidth: 1, ...cardShadow },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  iconBadge: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  title: { fontSize: 15, fontWeight: '700', flex: 1 },
  content: { fontSize: 13.5, lineHeight: 18, marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: 11.5 },
  locationPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, maxWidth: '65%' },
  locationText: { fontSize: 11 },
  deleteContainer: { marginVertical: 8, marginRight: 16, borderRadius: 14, justifyContent: 'center', alignItems: 'center', width: 78 },
});