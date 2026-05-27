import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import Animated, {
  Easing,
  FadeInDown,
  FadeOutLeft,
} from 'react-native-reanimated';

import { useTheme } from '../../constants/theme';
import { Note } from '../../types';

interface Props {
  note: Note;
  onPress: () => void;
  onDelete?: () => void;
  index?: number;
}

export default function NoteCard({
  note,
  onPress,
  onDelete,
  index = 0,
}: Props) {
  const theme = useTheme();

  const [removing, setRemoving] =
    useState(false);

  const fecha = new Date(
    note.createdAt
  ).toLocaleDateString('es-ES');

  useEffect(() => {
    if (!removing) return;

    const timeout = setTimeout(() => {
      onDelete?.();
    }, 200);

    return () => clearTimeout(timeout);
  }, [removing]);

  const renderRightActions = () => {
    return (
      <View
        style={[
          styles.deleteContainer,
          {
            backgroundColor: theme.danger,
          },
        ]}
      >
        <Ionicons
          name="trash-outline"
          size={24}
          color="#fff"
        />
      </View>
    );
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(
        index * 40
      ).springify()}
      exiting={FadeOutLeft.duration(200).easing(
        Easing.out(Easing.cubic)
      )}
      style={[
        removing && {
          opacity: 0.95,
        },
      ]}
    >
      <Swipeable
        enabled={!removing}
        friction={1.7}
        rightThreshold={28}
        overshootRight={false}
        dragOffsetFromRightEdge={1}
        renderRightActions={
          renderRightActions
        }
        onSwipeableWillOpen={() => {
          setRemoving(true);
        }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={removing}
          onPress={onPress}
          style={[
            styles.card,
            {
              backgroundColor:
                theme.card,
              borderColor:
                theme.border,
            },
          ]}
        >
          <View style={styles.row}>
            <Ionicons
              name="document-text-outline"
              size={22}
              color={theme.primary}
              style={styles.noteIcon}
            />

            <View
              style={
                styles.contentContainer
              }
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.title,
                  {
                    color: theme.text,
                  },
                ]}
              >
                {note.title}
              </Text>

              <Text
                numberOfLines={2}
                style={[
                  styles.content,
                  {
                    color:
                      theme.textSecondary,
                  },
                ]}
              >
                {note.content}
              </Text>

              <View style={styles.footer}>
                <Text
                  style={[
                    styles.date,
                    {
                      color:
                        theme.textTertiary,
                    },
                  ]}
                >
                  {fecha}
                </Text>

                {note.location && (
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.location,
                      {
                        color:
                          theme.textTertiary,
                      },
                    ]}
                  >
                    📍{' '}
                    {
                      note.location
                        .address
                    }
                  </Text>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
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

  deleteContainer: {
    marginVertical: 8,
    marginRight: 16,

    borderRadius: 12,

    justifyContent: 'center',
    alignItems: 'center',

    width: 80,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  noteIcon: {
    marginRight: 10,
    marginTop: 2,
  },

  contentContainer: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },

  content: {
    fontSize: 14,
    marginBottom: 8,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  date: {
    fontSize: 12,
  },

  location: {
    fontSize: 11,
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
});