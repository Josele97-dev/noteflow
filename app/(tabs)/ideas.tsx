// app/ideas/index.tsx
import IdeaCard from '@/components/items/IdeaCard';
import { BaseList } from '@/components/lists/BaseList';
import { useTheme } from '@/constants/theme';
import { useNotesStore } from '@/store/notesStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function IdeasScreen() {
  const { ideas, _hydrated } = useNotesStore();
  const router = useRouter();
  const theme = useTheme();

  if (!_hydrated) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  const activas = ideas.filter((i) => !i.archived);

  return (
    <BaseList
      data={activas}
      searchKeys={(i) => [i.title, ...i.tags]}
      searchPlaceholder="Buscar ideas o etiquetas..."
      emptyTitle="No hay ideas aún"
      emptySubtitle="Pulsa + para crear una"
      renderItem={({ item }) => (
        <IdeaCard
          idea={item}
          onPress={() => router.push(`/ideas/${item.id}`)}
        />
      )}
    />
  );
}
