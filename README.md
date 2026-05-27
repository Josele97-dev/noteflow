# NoteFlow

Gestor de notas moderno construido con Expo, React Native, Zustand, FlashList y Expo Router.
Con autenticación Firebase, backend en Next.js, base de datos PostgreSQL y almacenamiento de imágenes en AWS S3.

---

## Descripción

NoteFlow organiza la información en tres tipos de contenido:

- **Notas** — texto libre
- **Checklists** — listas de tareas
- **Ideas** — notas rápidas con etiquetas, color y descripción

Cada tipo tiene su propia vista, detalle, flujo de edición y sistema de archivado. Los datos se sincronizan con un backend real y cada usuario ve únicamente sus propios datos.

---

## Características principales

### Autenticación
- Registro e inicio de sesión con Firebase Auth
- Sesión persistente
- Perfil de usuario con nombre, email y foto
- Foto de perfil desde la galería, almacenada en AWS S3

### Tipos de contenido

#### Notas
- Título, contenido y fecha
- Vista de detalle
- Edición completa
- Eliminación con confirmación
- Archivado
- Feedback háptico

#### Checklists
- Items marcables
- Barra de progreso
- Edición de listas e items
- Archivado
- Vibración al completar tareas

#### Ideas
- Etiquetas dinámicas
- Color personalizado
- Edición completa
- Archivado
- Organización visual rápida

### Notificaciones locales
- Al crear cualquier entrada se ofrece programar un recordatorio
- El usuario elige fecha y hora con un picker custom sin dependencias nativas
- La notificación se lanza aunque la app esté cerrada

### Geolocalización
- Captura automática de ubicación al crear una entrada
- La dirección se guarda en la base de datos y persiste entre sesiones
- Se muestra en el detalle de cada entrada con un chip 📍

### Gestos y animaciones
- Swipe-to-delete en cards — deslizar a la izquierda elimina la entrada
- Animaciones de entrada escalonadas (FadeInDown) al cargar las listas
- Animaciones imperativas en pantallas de detalle para evitar parpadeo en Android

---

## Backend

La app consume una API REST propia desplegada en Vercel: https://noteflow-api.vercel.app/

- **Base de datos:** PostgreSQL en Neon
- **Autenticación:** Firebase Admin SDK
- **Almacenamiento:** AWS S3 para imágenes
- **Repositorio:** `noteflow-api`

---

## Rendimiento

- FlashList en todas las pantallas
- Optimización para +50 elementos sin pérdida de FPS
- Re-render controlado con Zustand
- Búsqueda en tiempo real sin bloqueos
- Animaciones en UI thread con Reanimated (no bloquean el JS thread)

---

## UI / UX

- Tema claro y oscuro automático
- En modo claro: headers y navegación con color primario azul (`#0A4D9C`)
- En modo oscuro: headers con color de card para integrarse con el fondo oscuro
- Sistema de tokens en `constants/theme.ts`
- Animaciones suaves con Reanimated
- Interacciones con feedback háptico
- Estados vacíos personalizados
- Splash screen con fondo azul primario
- Icono de notificación personalizado para Android

---

## Estado global

- Zustand como store principal (sin persist)
- En cada arranque `fetchAll()` hidrata el estado desde la API
- Cada acción (crear, editar, eliminar) actualiza el estado local y llama a la API

---

## Navegación

- Expo Router
- Tabs como navegación principal
- Grupo `(auth)` para login y registro
- Rutas dinámicas `[id].tsx`
- Modal para creación de nuevas notas
- Protección de rutas con Firebase Auth

---

## Estructura del proyecto

```bash
app/
  (auth)/
    _layout.tsx
    login.tsx
    register.tsx

  (tabs)/
    _layout.tsx
    notas.tsx
    ideas.tsx
    checklists.tsx
    archivados.tsx
    perfil.tsx

  notas/
    [id].tsx
    editar/
      EditNoteScreen.tsx

  ideas/
    [id].tsx
    editar/
      EditIdeaScreen.tsx

  checklists/
    [id].tsx
    editar/
      EditTaskScreen.tsx

  crear.tsx
  _layout.tsx
  index.tsx

components/
  animations/
    FadeInDown.tsx
    FadeOutLeft.tsx
  archived/
    ArchivedSection.tsx
  items/
    NoteCard.tsx
    IdeaCard.tsx
    ChecklistCard.tsx
    ItemActions.tsx
  lists/
    BaseList.tsx
  ui/
    EditHeader.tsx
    DateTimePicker.tsx

constants/
  theme.ts

docs/
  ai-setup.md
  idea.md
  project-management.md
  react-native-teoria.md

hooks/
  useExitAnimation.ts

lib/
  api.ts

store/
  notesStore.ts

types/
  index.ts

utils/
  ideaColors.ts
```

---

## Documentación

- `idea.md` → concepto del proyecto
- `project-management.md` → organización en Trello
- `react-native-teoria.md` → teoría de RN, Expo y rendimiento
- `ai-setup.md` → herramientas de IA usadas

---

## Tablero de Trello

https://trello.com/b/I1L4Exy8/noteflow

---

## Tecnologías

- Expo SDK 55
- React Native 0.76
- Expo Router
- Zustand
- Firebase Auth + Firestore
- Firebase Admin SDK
- FlashList
- Reanimated 3
- react-native-gesture-handler
- expo-notifications
- expo-location
- Expo Haptics
- Expo Image Picker
- AWS S3
- Zod
- TypeScript

---

## Instalación

```bash
git clone https://github.com/TU_ENLACE/noteflow.git
cd noteflow
npm install
npx expo start
```

> La app requiere un build propio — no funciona con Expo Go.  
> Para desarrollo: `eas build --profile development --platform android`  
> Para pruebas en dispositivo: `eas build --profile preview --platform android`