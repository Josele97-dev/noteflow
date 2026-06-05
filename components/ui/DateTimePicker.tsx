import { useTheme } from '@/constants/theme';
import { useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

interface Props { value: Date; onChange: (date: Date) => void; mode: 'date' | 'time' }

const ITEM_HEIGHT = 44;
const VISIBLE = 5;

type WheelPickerProps = {
  items: string[]; selectedIndex: number; onSelect: (i: number) => void; label: string;
  theme: { primary: string; text: string; textTertiary: string };
};

function WheelPicker({ items, selectedIndex, onSelect, theme, label }: WheelPickerProps) {
  const ref = useRef<FlatList<string>>(null);
  return (
    <View style={{ height: ITEM_HEIGHT * VISIBLE, overflow: 'hidden', flex: 1 }}
      accessibilityRole="adjustable" accessibilityLabel={label}
      accessibilityHint="Desliza hacia arriba o abajo para cambiar el valor"
      accessibilityValue={{ text: items[selectedIndex] }}>
      <View pointerEvents="none" style={[styles.selectionBar, { borderColor: theme.primary, top: ITEM_HEIGHT * 2 }]} />
      <View pointerEvents="none" style={[styles.selectionBar, { borderColor: theme.primary, top: ITEM_HEIGHT * 3 - 1 }]} />
      <FlatList<string> ref={ref} data={['', '', ...items, '', '']}
        keyExtractor={(_, i) => String(i)} showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT} decelerationRate="fast" initialScrollIndex={selectedIndex}
        getItemLayout={(_, i) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * i, index: i })}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
          onSelect(Math.max(0, Math.min(i, items.length - 1)));
        }}
        renderItem={({ item, index }) => {
          const isSelected = index - 2 === selectedIndex;
          return (
            <View style={styles.item} accessible={false}>
              <Text style={[styles.itemText, {
                color: isSelected ? theme.text : theme.textTertiary,
                fontWeight: isSelected ? '700' : '400',
                fontSize: isSelected ? 18 : 15,
              }]}>{item}</Text>
            </View>
          );
        }} />
    </View>
  );
}

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const pad = (n: number) => String(n).padStart(2, '0');

export function DateTimePickerCustom({ value, onChange, mode }: Props) {
  const theme = useTheme();
  const now = new Date();
  const containerStyle = [styles.row, { backgroundColor: theme.background, borderRadius: 12, padding: 8 }];

  if (mode === 'time') {
    const hours = Array.from({ length: 24 }, (_, i) => pad(i));
    const minutes = Array.from({ length: 60 }, (_, i) => pad(i));
    const update = (setter: (d: Date, i: number) => void) => (i: number) => {
      const d = new Date(value); setter(d, i); onChange(d);
    };
    return (
      <View style={containerStyle} accessibilityLabel="Selector de hora">
        <WheelPicker label="Selector de horas" items={hours} selectedIndex={value.getHours()}
          onSelect={update((d, i) => d.setHours(i))} theme={theme} />
        <Text style={[styles.sep, { color: theme.text }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">:</Text>
        <WheelPicker label="Selector de minutos" items={minutes} selectedIndex={value.getMinutes()}
          onSelect={update((d, i) => d.setMinutes(i))} theme={theme} />
      </View>
    );
  }

  const currentYear = now.getFullYear();
  const selectedYear = value.getFullYear();
  const selectedMonth = value.getMonth();
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear + i));
  const monthOffset = selectedYear === currentYear ? now.getMonth() : 0;
  const months = selectedYear === currentYear ? MONTHS.slice(now.getMonth()) : MONTHS;
  const firstDay = selectedYear === currentYear && selectedMonth === now.getMonth() ? now.getDate() : 1;
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth - firstDay + 1 }, (_, i) => pad(firstDay + i));

  return (
    <View style={containerStyle} accessibilityLabel="Selector de fecha">
      <WheelPicker label="Selector de días" items={days} selectedIndex={Math.max(0, value.getDate() - firstDay)}
        onSelect={(i) => { const d = new Date(value); d.setDate(firstDay + i); onChange(d); }} theme={theme} />
      <WheelPicker label="Selector de meses" items={months} selectedIndex={selectedMonth - monthOffset}
        onSelect={(i) => {
          const d = new Date(value);
          d.setMonth(i + monthOffset);
          const max = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
          if (d.getDate() > max) d.setDate(max);
          onChange(d);
        }} theme={theme} />
      <WheelPicker label="Selector de años" items={years} selectedIndex={selectedYear - currentYear}
        onSelect={(i) => {
          const d = new Date(value);
          d.setFullYear(currentYear + i);
          if (d.getFullYear() === currentYear && d.getMonth() < now.getMonth()) d.setMonth(now.getMonth());
          if (d.getFullYear() === currentYear && d.getMonth() === now.getMonth() && d.getDate() < now.getDate()) d.setDate(now.getDate());
          onChange(d);
        }} theme={theme} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  item: { height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' },
  itemText: { textAlign: 'center' },
  sep: { fontSize: 22, fontWeight: '700', paddingHorizontal: 4 },
  selectionBar: { position: 'absolute', left: 0, right: 0, height: 0, borderTopWidth: 1.5, zIndex: 10 },
});