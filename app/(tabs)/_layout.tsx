import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../../constants/theme';

type Tab = {
  name: string;
  title: string;
  tipo?: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

const TABS: Tab[] = [
  { name: 'notas',      title: 'Notas',      tipo: 'nota',  icon: 'document-text-outline' },
  { name: 'checklists', title: 'Tareas',     tipo: 'tarea', icon: 'checkbox-outline'      },
  { name: 'ideas',      title: 'Ideas',      tipo: 'idea',  icon: 'bulb-outline'          },
  { name: 'archivados', title: 'Archivados',               icon: 'archive-outline'        },
  { name: 'perfil', title: 'Perfil', icon: 'person-outline' },
];

export default function TabsLayout() {
  const router = useRouter();
  const { card, text, border, primary, textTertiary } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: card },
        headerTitleStyle: { color: text },
        tabBarStyle: { backgroundColor: card, borderTopColor: border },
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: textTertiary,
      }}
    >
      {TABS.map(({ name, title, tipo, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, size }) => <Ionicons name={icon} size={size} color={color} />,
            headerRight: tipo
              ? () => (
                  <TouchableOpacity
                    onPress={() => router.push(`/crear?tipo=${tipo}` as any)}
                    style={{ marginRight: 16 }}
                  >
                    <Ionicons name="add-circle-outline" size={28} color={primary} />
                  </TouchableOpacity>
                )
              : undefined,
          }}
        />
      ))}
    </Tabs>
  );
}