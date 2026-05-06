import { useTheme } from '@/constants/theme';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// MISMO TRUCO QUE EN BASELIST
const List = FlashList as unknown as React.ComponentType<any>;

interface Props {
  title: string;
  data: any[];
  renderItem: any; // igual que BaseList
}

export default function ArchivedSection({ title, data, renderItem }: Props) {
  const theme = useTheme();

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: theme.textSecondary }]}>
        {title}
      </Text>

      <List
        data={data}
        renderItem={renderItem}
        estimatedItemSize={80}   // AHORA SÍ FUNCIONA
        keyExtractor={(item: any, index: number) =>
          item?.id ?? index.toString()
        }
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
