import { useTheme } from '@/constants/theme';
import { useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

interface Props {
  value: Date;
  onChange: (date: Date) => void;
  mode: 'date' | 'time';
}

const ITEM_HEIGHT = 44;
const VISIBLE = 5;

function WheelPicker({
  items,
  selectedIndex,
  onSelect,
  theme,
  label,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  theme: any;
  label: string;
}) {
  const ref = useRef<FlatList>(null);

  return (
    <View
      style={{ height: ITEM_HEIGHT * VISIBLE, overflow: 'hidden', flex: 1 }}
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityHint="Desliza hacia arriba o abajo para cambiar el valor"
      accessibilityValue={{
        text: items[selectedIndex],
      }}
    >
      <View
        pointerEvents="none"
        style={[
          styles.selectionBar,
          { borderColor: theme.primary, top: ITEM_HEIGHT * 2 },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.selectionBar,
          { borderColor: theme.primary, top: ITEM_HEIGHT * 3 - 1 },
        ]}
      />

      <FlatList
        ref={ref}
        data={['', '', ...items, '', '']}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        initialScrollIndex={selectedIndex}
        getItemLayout={(_, i) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * i,
          index: i,
        })}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(
            e.nativeEvent.contentOffset.y / ITEM_HEIGHT
          );
          onSelect(Math.max(0, Math.min(i, items.length - 1)));
        }}
        renderItem={({ item, index }) => {
          const realIndex = index - 2;
          const isSelected = realIndex === selectedIndex;

          return (
            <View
              style={styles.item}
              accessible={false}
            >
              <Text
                style={[
                  styles.itemText,
                  {
                    color: isSelected
                      ? theme.text
                      : theme.textTertiary,
                    fontWeight: isSelected ? '700' : '400',
                    fontSize: isSelected ? 18 : 15,
                  },
                ]}
              >
                {item}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

export function DateTimePickerCustom({ value, onChange, mode }: Props) {
  const theme = useTheme();
  const now = new Date();

  if (mode === 'time') {
    const hours = Array.from({ length: 24 }, (_, i) =>
      String(i).padStart(2, '0')
    );
    const minutes = Array.from({ length: 60 }, (_, i) =>
      String(i).padStart(2, '0')
    );

    return (
      <View
        style={[
          styles.row,
          {
            backgroundColor: theme.background,
            borderRadius: 12,
            padding: 8,
          },
        ]}
        accessibilityLabel="Selector de hora"
      >
        <WheelPicker
          label="Selector de horas"
          items={hours}
          selectedIndex={value.getHours()}
          onSelect={(i) => {
            const d = new Date(value);
            d.setHours(i);
            onChange(d);
          }}
          theme={theme}
        />

        <Text
          style={[styles.sep, { color: theme.text }]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          :
        </Text>

        <WheelPicker
          label="Selector de minutos"
          items={minutes}
          selectedIndex={value.getMinutes()}
          onSelect={(i) => {
            const d = new Date(value);
            d.setMinutes(i);
            onChange(d);
          }}
          theme={theme}
        />
      </View>
    );
  }

  const currentYear = now.getFullYear();
  const selectedYear = value.getFullYear();
  const selectedMonth = value.getMonth();

  const years = Array.from({ length: 5 }, (_, i) =>
    String(currentYear + i)
  );

  const monthsFull = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];

  const months =
    selectedYear === currentYear
      ? monthsFull.slice(now.getMonth())
      : monthsFull;

  const monthOffset =
    selectedYear === currentYear ? now.getMonth() : 0;

  const daysInMonth = new Date(
    selectedYear,
    selectedMonth + 1,
    0
  ).getDate();

  const firstDay =
    selectedYear === currentYear &&
    selectedMonth === now.getMonth()
      ? now.getDate()
      : 1;

  const days = Array.from(
    { length: daysInMonth - firstDay + 1 },
    (_, i) => String(firstDay + i).padStart(2, '0')
  );

  const selectedDayIndex = Math.max(
    0,
    value.getDate() - firstDay
  );

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: theme.background,
          borderRadius: 12,
          padding: 8,
        },
      ]}
      accessibilityLabel="Selector de fecha"
    >
      <WheelPicker
        label="Selector de días"
        items={days}
        selectedIndex={selectedDayIndex}
        onSelect={(i) => {
          const d = new Date(value);
          d.setDate(firstDay + i);
          onChange(d);
        }}
        theme={theme}
      />

      <WheelPicker
        label="Selector de meses"
        items={months}
        selectedIndex={selectedMonth - monthOffset}
        onSelect={(i) => {
          const d = new Date(value);
          d.setMonth(i + monthOffset);

          const maxDay = new Date(
            d.getFullYear(),
            d.getMonth() + 1,
            0
          ).getDate();

          if (d.getDate() > maxDay) d.setDate(maxDay);

          onChange(d);
        }}
        theme={theme}
      />

      <WheelPicker
        label="Selector de años"
        items={years}
        selectedIndex={selectedYear - currentYear}
        onSelect={(i) => {
          const d = new Date(value);
          d.setFullYear(currentYear + i);

          if (
            d.getFullYear() === currentYear &&
            d.getMonth() < now.getMonth()
          ) {
            d.setMonth(now.getMonth());
          }

          if (
            d.getFullYear() === currentYear &&
            d.getMonth() === now.getMonth() &&
            d.getDate() < now.getDate()
          ) {
            d.setDate(now.getDate());
          }

          onChange(d);
        }}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: { textAlign: 'center' },
  sep: {
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  selectionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 0,
    borderTopWidth: 1.5,
    zIndex: 10,
  },
});