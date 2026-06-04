import { useTheme } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

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
  const listRef = useRef<any>(null);

  useFocusEffect(
    useCallback(() => {
      requestAnimationFrame(() => {
        listRef.current?.scrollToOffset?.({
          offset: 0,
          animated: false,
        });
      });
    }, [])
  );

  const q = query.toLowerCase();

  const filtered = q
    ? data.filter((item) =>
        searchKeys(item).some((field) =>
          field.toLowerCase().includes(q)
        )
      )
    : data;

  const isEmpty = filtered.length === 0;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.background }]}
      accessibilityLabel="Lista de elementos"
    >
      <View
        style={[styles.search, { backgroundColor: theme.card }]}
        accessibilityRole="search"
        accessibilityLabel="Buscador de elementos"
      >
        <Feather name="search" size={18} color={theme.textSecondary} />

        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder={searchPlaceholder}
          placeholderTextColor={theme.textTertiary}
          value={query}
          onChangeText={setQuery}
          accessibilityRole="search"
          accessibilityLabel={searchPlaceholder}
        />
      </View>

      {isEmpty ? (
        <View
          style={styles.empty}
          accessibilityRole="text"
          accessibilityLabel={
            data.length === 0 ? emptyTitle : 'Sin resultados'
          }
        >
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {data.length === 0 ? emptyTitle : 'Sin resultados'}
          </Text>

          <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>
            {data.length === 0 ? emptySubtitle : 'Prueba otra búsqueda'}
          </Text>
        </View>
      ) : (
        <List
          ref={listRef}
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
  container: {
    flex: 1,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 16,
    borderRadius: 12,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});