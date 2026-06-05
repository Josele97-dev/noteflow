import { useTheme } from '@/constants/theme';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props<T extends { id?: string }> = {
  title: string;
  data: T[];
  renderItem: ListRenderItem<T>;
};

export default function ArchivedSection<T extends { id?: string }>({
  title,
  data,
  renderItem,
}: Props<T>) {
  const theme = useTheme();

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: theme.textSecondary }]}>
        {title}
      </Text>

      <FlashList<T>
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 1,
  },
  listContent: {
    gap: 8,
  },
});
