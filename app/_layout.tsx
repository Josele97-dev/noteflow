import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from '../constants/theme';
import { useNotesStore } from '../store/notesStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme() ?? 'dark';
  const theme = scheme === 'dark' ? colors.dark : colors.light;
  const hydrated = useNotesStore((s) => s._hydrated);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.background);
  }, [theme.background]);

  useEffect(() => {
    if (hydrated) SplashScreen.hideAsync();
  }, [hydrated]);

  if (!hydrated) return null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.card },
        headerTitleStyle: { color: theme.text },
        headerTintColor: theme.primary,
        contentStyle: { backgroundColor: theme.background },
      }}
    >

      {/* TABS */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      {/* ================= NOTES ================= */}
      <Stack.Screen
        name="notas/[id]"
        options={{
          title: 'Nota',
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen
        name="notas/editar/EditNoteScreen"
        options={{
          title: '',
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />

      {/* ================= IDEAS ================= */}
      <Stack.Screen
        name="ideas/[id]"
        options={{
          title: 'Idea',
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen
        name="ideas/editar/EditIdeaScreen"
        options={{
          title: '',
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />

      {/* ================= CHECKLISTS ================= */}
      <Stack.Screen
        name="checklists/[id]"
        options={{
          title: 'Tarea',
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />

      <Stack.Screen
        name="checklists/editar/EditTaskScreen"
        options={{
          title: '',
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />

      {/* ================= NUEVA NOTA ================= */}
      <Stack.Screen
        name="nueva-nota"
        options={{
          title: 'Nueva nota',
          presentation: 'modal',
          animation: 'fade',
        }}
      />

    </Stack>
  );
}