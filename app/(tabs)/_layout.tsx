import { Ionicons } from '@expo/vector-icons';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { doc, onSnapshot } from 'firebase/firestore';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { Image, Platform, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../constants/theme';
import { auth, db } from '../../lib/firebase';

type IoniconName = ComponentProps<typeof Ionicons>['name'];
type Tab = { name: string; title: string; tipo?: string; icon: IoniconName };

const TABS: Tab[] = [
  { name: 'notas', title: 'Notas', tipo: 'nota', icon: 'document-text-outline' },
  { name: 'checklists', title: 'Tareas', tipo: 'tarea', icon: 'checkbox-outline' },
  { name: 'ideas', title: 'Ideas', tipo: 'idea', icon: 'bulb-outline' },
  { name: 'archivados', title: 'Archivados', icon: 'archive-outline' },
  { name: 'perfil', title: 'Perfil', icon: 'person-outline' },
];

const fabShadow = Platform.select({
  web: { boxShadow: '0px 4px 8px rgba(0,0,0,0.3)' },
  default: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 6 },
});

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const isDark = (useColorScheme() ?? 'light') === 'dark';
  const theme = useTheme();
  const { card, text, border, primary, textTertiary } = theme;

  const currentTab = TABS.find((t) => pathname.includes(t.name));
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState<string | null>(null);
  const [initial, setInitial] = useState<string>('U');

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      const data = snap.data();
      setAvatar(data?.avatarUrl ?? null);
      setInitial(data?.name?.charAt(0).toUpperCase() ?? user.email?.charAt(0).toUpperCase() ?? 'U');
    });
    return unsub;
  }, [user]);

  const headerBg = isDark ? card : primary;
  const headerTextColor = isDark ? text : '#ffffff';
  const avatarBg = isDark ? primary + '22' : 'rgba(255,255,255,0.2)';
  const avatarTextColor = isDark ? primary : '#ffffff';

  return (
    <View style={{ flex: 1 }} accessibilityRole="tablist" accessibilityLabel="Navegación principal">
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: headerBg },
          headerTitleStyle: { color: headerTextColor },
          headerTintColor: headerTextColor,
          tabBarStyle: { backgroundColor: isDark ? card : '#ffffff', borderTopColor: isDark ? border : 'rgba(10,77,156,0.12)' },
          tabBarActiveTintColor: primary,
          tabBarInactiveTintColor: textTertiary,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/perfil')}
              style={{ marginRight: 16, width: 34, height: 34, borderRadius: 17, overflow: 'hidden', backgroundColor: avatarBg, justifyContent: 'center', alignItems: 'center' }}
              accessibilityRole="button" accessibilityLabel="Abrir perfil"
            >
              {avatar ? (
                <Image source={{ uri: avatar }} style={{ width: '100%', height: '100%' }} accessibilityLabel="Foto de perfil" />
              ) : (
                <Text style={{ color: avatarTextColor, fontWeight: '700', fontSize: 15 }} accessibilityRole="text">{initial}</Text>
              )}
            </TouchableOpacity>
          ),
        }}
      >
        {TABS.map(({ name, title, icon }) => (
          <Tabs.Screen key={name} name={name} options={{
            title,
            tabBarAccessibilityLabel: `Ir a ${title}`,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={icon} size={size} color={color} accessibilityRole="image" accessibilityLabel={`Icono de ${title}`} />
            ),
          }} />
        ))}
      </Tabs>

      {currentTab?.tipo && (
        <TouchableOpacity
          onPress={() => router.push(`/crear?tipo=${currentTab.tipo}`)}
          activeOpacity={0.8}
          style={[{ position: 'absolute', bottom: insets.bottom + 90, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: primary, justifyContent: 'center', alignItems: 'center' }, fabShadow]}
          accessibilityRole="button" accessibilityLabel={`Crear nueva ${currentTab.tipo}`} accessibilityHint="Abre la pantalla para añadir una nueva entrada"
        >
          <Ionicons name="add" size={32} color="white" accessibilityRole="image" accessibilityLabel="Icono de añadir" />
        </TouchableOpacity>
      )}
    </View>
  );
}