// components/lists/BaseList.tsx
import { useTheme } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

// Usamos ANY solo para el componente FlashList, NO para tus props.
// Esto evita que FlashList colapse props como estimatedItemSize.
const List = FlashList as unknown as React.ComponentType<any>;

interface Props<T> {
  data: T[];
  searchKeys: (item: T) => string[];
  searchPlaceholder: string;
  emptyTitle: string;
  emptySubtitle: string;
  renderItem: (info: { item: T; index: number }) => React.ReactNode;
}

export function BaseList<T>({
  data,
  searchKeys,
  searchPlaceholder,
  emptyTitle,
  emptySubtitle,
  renderItem,
}: Props<T>) {
  const theme = useTheme();
  const [query, setQuery] = useState('');

  const q = query.toLowerCase();

  const filtered = q
    ? data.filter((item) =>
        searchKeys(item).some((field) =>
          field.toLowerCase().includes(q)
        )
      )
    : data;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* SEARCH */}
      <View style={[styles.search, { backgroundColor: theme.card }]}>
        <Feather name="search" size={18} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder={searchPlaceholder}
          placeholderTextColor={theme.textTertiary}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* EMPTY */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {data.length === 0 ? emptyTitle : 'Sin resultados'}
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
            {data.length === 0 ? emptySubtitle : 'Prueba otra búsqueda'}
          </Text>
        </View>
      ) : (
        <List
          data={filtered}
          keyExtractor={(item: any, index: number) =>
            item?.id ?? index.toString()
          }
          estimatedItemSize={90}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={({ item, index }: { item: T; index: number }) =>
            renderItem({ item, index })
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 16,
    borderRadius: 12,
  },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 18, fontWeight: '600' },
  emptySubtext: { fontSize: 14, marginTop: 8 },
});
