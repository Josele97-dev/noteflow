import { Feather, Ionicons } from '@expo/vector-icons';
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
import { ChecklistNote } from '../../types';

interface Props {
  checklist: ChecklistNote;
  onPress: () => void;
  onDelete?: () => void;
  index?: number;
}

export default function ChecklistCard({
  checklist,
  onPress,
  onDelete,
  index = 0,
}: Props) {
  const theme = useTheme();

  const [removing, setRemoving] =
    useState(false);

  const total = checklist.items.length;

  const completadas =
    checklist.items.filter(
      (i) => i.isCompleted
    ).length;

  const progreso =
    total > 0
      ? (completadas / total) * 100
      : 0;

  const fecha = new Date(
    checklist.createdAt
  ).toLocaleDateString('es-ES');

  useEffect(() => {
    if (!removing) return;

    const timeout = setTimeout(() => {
      onDelete?.();
    }, 200);

    return () => clearTimeout(timeout);
  }, [removing]);

  const renderRightActions = () => (
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
          style={[
            styles.card,
            {
              backgroundColor:
                theme.card,
              borderColor:
                theme.border,
            },
          ]}
          onPress={onPress}
          activeOpacity={0.9}
          disabled={removing}
        >
          <View style={styles.header}>
            <Feather
              name="list"
              size={20}
              color={theme.primary}
            />

            <Text
              style={[
                styles.title,
                {
                  color: theme.text,
                },
              ]}
              numberOfLines={1}
            >
              {checklist.title}
            </Text>
          </View>

          <Text
            style={[
              styles.counter,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            {completadas}/{total} tareas
          </Text>

          <View
            style={[
              styles.barraFondo,
              {
                backgroundColor:
                  theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.barraRelleno,
                {
                  width: `${progreso}%`,
                  backgroundColor:
                    theme.success,
                },
              ]}
            />
          </View>

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

  header: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,

    marginBottom: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',

    flex: 1,
  },

  counter: {
    fontSize: 13,
    marginBottom: 8,
  },

  barraFondo: {
    height: 6,
    borderRadius: 3,

    marginBottom: 8,
  },

  barraRelleno: {
    height: 6,
    borderRadius: 3,
  },

  date: {
    fontSize: 12,
    marginTop: 4,
  },
});