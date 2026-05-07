# NoteFlow

Gestor de notas moderno y minimalista construido con Expo, React Native,
Zustand, FlashList y Expo Router.\
Diseñado para ser rápido, fluido y extremadamente claro, con animaciones
suaves, edición completa y persistencia local.

------------------------------------------------------------------------

## Descripción

NoteFlow organiza la información en tres tipos de contenido:

-   Notas --- texto libre\
-   Checklists --- listas de tareas\
-   Ideas --- notas rápidas con etiquetas y color

Cada tipo tiene su propia vista, su propio detalle, su flujo de edición
y su sistema de archivado.

------------------------------------------------------------------------

## Características principales

### Tipos de contenido

#### Notas

-   Título, contenido y fecha\
-   Vista de detalle\
-   Edición completa\
-   Eliminación con confirmación\
-   Archivado\
-   Feedback háptico

#### Checklists

-   Items marcables\
-   Barra de progreso\
-   Edición de listas e items\
-   Archivado\
-   Vibración al completar tareas

#### Ideas

-   Etiquetas dinámicas\
-   Color personalizado\
-   Edición completa\
-   Archivado\
-   Organización visual rápida

------------------------------------------------------------------------

## Rendimiento

-   FlashList en todas las pantallas\
-   Optimización para +50 elementos sin pérdida de FPS\
-   Re-render controlado\
-   Búsqueda en tiempo real sin bloqueos

------------------------------------------------------------------------

## UI / UX

-   Tema claro y oscuro automático\
-   Sistema de tokens en constants/theme.ts\
-   Animaciones declarativas suaves (FadeInDown)\
-   Interacciones con feedback háptico\
-   Estados vacíos personalizados\
-   Diseño limpio y minimalista

------------------------------------------------------------------------

## Estado global

-   Zustand como store principal\
-   Persistencia con AsyncStorage\
-   Rehidratación automática\
-   Stores unificados para notas, ideas y checklists

------------------------------------------------------------------------

## Navegación

-   Expo Router\
-   Tabs como navegación principal\
-   Rutas dinámicas \[id\].tsx\
-   Pantallas de edición en subcarpetas /editar\
-   Modal para creación de nuevas notas

------------------------------------------------------------------------

## Estructura del proyecto

```bash
app/
  (tabs)/
    _layout.tsx
    notas.tsx
    ideas.tsx
    checklists.tsx
    archivados.tsx

  notas/
    _layout.tsx
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

components/
  animations/
    FadeInDown.tsx
  archived/
    ArchivedCard.tsx
  items/
    NoteCard.tsx
    IdeaCard.tsx
    ChecklistCard.tsx
    ItemActions.tsx
  lists/
    BaseList.tsx
  ui/
    EditHeader.tsx

constants/
  theme.ts

docs/
  ai-setup.md
  idea.md
  project-management.md
  react-native-teoria.md

hooks/
  use-color-scheme.ts
  use-color-scheme.web.ts
  use-theme-color.ts
  useExitAnimation.ts

store/
  notesStore.ts
```

------------------------------------------------------------------------

## Documentación

-   idea.md → concepto del proyecto\
-   project-management.md → organización en Trello\
-   react-native-teoria.md → teoría de RN, Expo y rendimiento\
-   ai-setup.md → herramientas de IA usadas

------------------------------------------------------------------------

## Tablero de Trello

https://trello.com/b/I1L4Exy8/noteflow

------------------------------------------------------------------------

## Animaciones

Se utilizan animaciones declarativas suaves con Reanimated:

-   FadeInDown\
-   Delays progresivos\
-   Transiciones limpias en pantallas de detalle

### Beneficios:

-   Entrada fluida del contenido\
-   Código simple y mantenible\
-   Compatible con FlashList\
-   Sin sobrecarga en pantallas de detalle

------------------------------------------------------------------------

## Tecnologías

-   Expo SDK 55\
-   React Native 0.76\
-   Expo Router\
-   Zustand + persist\
-   AsyncStorage\
-   FlashList\
-   Reanimated 3\
-   Zod\
-   Expo Haptics\
-   TypeScript

------------------------------------------------------------------------

## Instalación

``` bash
git clone https://github.com/TU_ENLACE/noteflow.git
cd noteflow
npm install
npx expo start
```
