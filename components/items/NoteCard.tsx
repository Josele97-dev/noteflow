import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { Easing, FadeInDown, FadeOutLeft } from 'react-native-reanimated';
import { useTheme } from '../../constants/theme';
import { Note } from '../../types';

interface Props {
  note: Note;
  onPress: () => void;
  onDelete?: () => void;
  index?: number;
}

export default function NoteCard({ note, onPress, onDelete, index = 0 }: Props) {
  const theme = useTheme();
  const [removing, setRemoving] = useState(false);

  const onDeleteRef = useRef(onDelete);
  onDeleteRef.current = onDelete;

  const fecha = new Date(note.createdAt).toLocaleDateString('es-ES');

  useEffect(() => {
    if (!removing) return;
    const timeout = setTimeout(() => onDeleteRef.current?.(), 200);
    return () => clearTimeout(timeout);
  }, [removing]);

  const renderRightActions = () => (
    <View style={[styles.deleteContainer, { backgroundColor: theme.danger }]}>
      <Ionicons name="trash-outline" size={22} color="#fff" />
    </View>
  );

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 40).springify()}
      exiting={FadeOutLeft.duration(200).easing(Easing.out(Easing.cubic))}
      style={removing ? { opacity: 0.9 } : undefined}
    >
      <Swipeable
        enabled={!removing}
        friction={1.8}
        rightThreshold={30}
        overshootRight={false}
        renderRightActions={renderRightActions}
        onSwipeableWillOpen={() => setRemoving(true)}
      >
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.88}
          disabled={removing}
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.header}>
            <View style={[styles.iconBadge, { backgroundColor: theme.primary + '15' }]}>
              <Ionicons name="document-text-outline" size={18} color={theme.primary} />
            </View>

            <Text numberOfLines={1} style={[styles.title, { color: theme.text }]}>
              {note.title}
            </Text>
          </View>

          <Text numberOfLines={2} style={[styles.content, { color: theme.textSecondary }]}>
            {note.content}
          </Text>

          <View style={styles.footer}>
            <Text style={[styles.date, { color: theme.textTertiary }]}>
              {fecha}
            </Text>

            {note.location && (
              <View style={[styles.locationPill, { backgroundColor: theme.border + '40' }]}>
                <Ionicons name="location-outline" size={12} color={theme.textTertiary} />
                <Text numberOfLines={1} style={[styles.locationText, { color: theme.textTertiary }]}>
                  {note.location.address}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },

  content: {
    fontSize: 13.5,
    lineHeight: 18,
    marginBottom: 10,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  date: {
    fontSize: 11.5,
  },

  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    maxWidth: '65%',
  },

  locationText: {
    fontSize: 11,
  },

  deleteContainer: {
    marginVertical: 8,
    marginRight: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    width: 78,
  },
});
