import auth from '@react-native-firebase/auth';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from '../constants/theme';
import { useNotesStore } from '../store/notesStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme() ?? 'light';
  const theme = scheme === 'dark' ? colors.dark : colors.light;
  const isDark = scheme === 'dark';
  const fetchAll = useNotesStore((s) => s.fetchAll);
  const router = useRouter();
  const segments = useSegments();

  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.background);
  }, [theme.background]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user === undefined) return;

    SplashScreen.hideAsync();

    // @ts-ignore
    const inAuthGroup = String(segments[0]) === '(auth)';
    // @ts-ignore
    const inIndex = segments.length === 0;

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login' as any);
    } else if (user && (inIndex || inAuthGroup)) {
      fetchAll();
      router.replace('/(tabs)/notas' as any);
    }
  }, [user, segments]);

  if (user === undefined) return null;

  return (
    <>
      {/* translucent global: el header de cada screen controla su propio color */}
      <StatusBar style={isDark ? 'light' : 'light'} translucent backgroundColor="transparent" />

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? theme.card : theme.primary,
          },
          headerTitleStyle: {
            color: isDark ? theme.text : '#ffffff',
          },
          headerTintColor: isDark ? theme.primary : '#ffffff',
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="notas/[id]" options={{ title: 'Nota', presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="notas/editar/EditNoteScreen" options={{ title: '', presentation: 'modal', animation: 'slide_from_bottom', headerShown: false }} />
        <Stack.Screen name="ideas/[id]" options={{ title: 'Idea', presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="ideas/editar/EditIdeaScreen" options={{ title: '', presentation: 'modal', animation: 'slide_from_bottom', headerShown: false }} />
        <Stack.Screen name="checklists/[id]" options={{ title: 'Tarea', presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="checklists/editar/EditTaskScreen" options={{ title: '', presentation: 'modal', animation: 'slide_from_bottom', headerShown: false }} />
        <Stack.Screen name="crear" options={{ title: 'Crear', presentation: 'modal', animation: 'fade', headerShown: false }} />
      </Stack>
    </>
  );
}