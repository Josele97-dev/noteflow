import { useTheme } from '@/constants/theme';
import { Feather } from '@expo/vector-icons';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface Props<T extends { id?: string }> {
  data: T[];
  searchKeys: (item: T) => string[];
  searchPlaceholder: string;
  emptyTitle: string;
  emptySubtitle: string;
  renderItem: ListRenderItem<T>;
}

export function BaseList<T extends { id?: string }>({ data, searchKeys, searchPlaceholder, emptyTitle, emptySubtitle, renderItem }: Props<T>) {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const listRef = useRef<React.ElementRef<typeof FlashList<T>>>(null);

  useFocusEffect(useCallback(() => {
    requestAnimationFrame(() => listRef.current?.scrollToOffset({ offset: 0, animated: false }));
  }, []));

  const q = query.toLowerCase();
  const filtered = q ? data.filter(item => searchKeys(item).some(f => f.toLowerCase().includes(q))) : data;
  const isEmpty = filtered.length === 0;
  const emptyLabel = data.length === 0 ? emptyTitle : 'Sin resultados';
  const emptySubLabel = data.length === 0 ? emptySubtitle : 'Prueba otra búsqueda';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]} accessibilityLabel="Lista de elementos">
      <View style={[styles.search, { backgroundColor: theme.card }]} accessibilityRole="search" accessibilityLabel="Buscador de elementos">
        <Feather name="search" size={18} color={theme.textSecondary} />
        <TextInput style={[styles.searchInput, { color: theme.text }]} placeholder={searchPlaceholder}
          placeholderTextColor={theme.textTertiary} value={query} onChangeText={setQuery}
          accessibilityRole="search" accessibilityLabel={searchPlaceholder} />
      </View>

      {isEmpty ? (
        <View style={styles.empty} accessibilityRole="text" accessibilityLabel={emptyLabel}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{emptyLabel}</Text>
          <Text style={[styles.emptySubtext, { color: theme.textTertiary }]}>{emptySubLabel}</Text>
        </View>
      ) : (
        <FlashList<T> ref={listRef} data={filtered}
          keyExtractor={(item, i) => item.id ?? i.toString()}
          contentContainerStyle={{ paddingBottom: 16 }}
          renderItem={renderItem} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  search: { flexDirection: 'row', alignItems: 'center', padding: 12, margin: 16, borderRadius: 12 },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 16 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  emptyText: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  emptySubtext: { fontSize: 14, marginTop: 8, textAlign: 'center' },
});