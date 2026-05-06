import ChecklistCard from '@/components/items/ChecklistCard';
import { BaseList } from '@/components/lists/BaseList';
import { useTheme } from '@/constants/theme';
import { useNotesStore } from '@/store/notesStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function ChecklistsScreen() {
  const { checklists, _hydrated } = useNotesStore();
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

  const activas = checklists.filter((c) => !c.archived);

  return (
    <BaseList
      data={activas}
      searchKeys={(c) => [c.title, ...c.items.map((i) => i.text)]}
      searchPlaceholder="Buscar listas o tareas..."
      emptyTitle="No hay listas aún"
      emptySubtitle="Pulsa + para crear una"
      renderItem={({ item }) => (
        <ChecklistCard
          checklist={item}
          onPress={() => router.push(`/checklists/${item.id}`)}
        />
      )}
    />
  );
}
