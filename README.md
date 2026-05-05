# 📱 NoteFlow

Gestor de notas moderno y minimalista construido con **Expo**, **React
Native**, **Zustand**, **FlashList** y **Expo Router**.\
Diseñado para ser rápido, fluido y extremadamente claro, con animaciones
suaves y persistencia local.

------------------------------------------------------------------------

## ✨ Descripción

NoteFlow organiza la información en tres tipos de contenido:

-   📝 **Notas** --- texto libre\
-   ☑️ **Checklists** --- listas de tareas\
-   💡 **Ideas** --- notas rápidas con etiquetas y color

------------------------------------------------------------------------

## ✨ Características principales

### 🧩 Tipos de contenido

#### 📝 Notas

-   Título, contenido y fecha\
-   Vista de detalle\
-   Eliminación con confirmación\
-   Feedback háptico

#### ☑️ Checklists

-   Items marcables\
-   Barra de progreso\
-   Vibración al completar tareas

#### 💡 Ideas

-   Etiquetas dinámicas\
-   Color personalizado\
-   Organización visual rápida

------------------------------------------------------------------------

## ⚡ Rendimiento

-   FlashList en todas las pantallas\
-   Optimización para +50 elementos sin pérdida de FPS\
-   Re-render controlado

------------------------------------------------------------------------

## 🎨 UI / UX

-   Tema claro y oscuro automático\
-   Sistema de tokens en `constants/theme.ts`\
-   Animaciones imperativas con Reanimated\
-   Interacciones con feedback háptico

------------------------------------------------------------------------

## 🧠 Estado global

-   Zustand como store principal\
-   Persistencia con AsyncStorage\
-   Rehidratación automática

------------------------------------------------------------------------

## 🧭 Navegación

-   Expo Router\
-   Tabs como navegación principal\
-   Rutas dinámicas `[id].tsx`\
-   Pantalla modal para creación

------------------------------------------------------------------------

## 📘 Documentación

-   `idea.md` → concepto del proyecto\
-   `project-management.md` → organización en Trello\
-   `ai-setup.md` → herramientas de IA\
-   `react-native-teoria.md` → teoría de animaciones y rendimiento

------------------------------------------------------------------------

## 📌 Tablero de Trello

👉 https://trello.com/TU_ENLACE_AQUI

------------------------------------------------------------------------

## 🎞️ Animaciones

Se utilizan animaciones imperativas con Reanimated:

-   useSharedValue\
-   useAnimatedStyle\
-   withTiming

### Beneficios:

-   Control total de entrada/salida\
-   Evita parpadeo en Android\
-   Mejor rendimiento con listas largas

------------------------------------------------------------------------

## 🛠️ Tecnologías

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

## 📦 Instalación

``` bash
git clone https://github.com/TU_ENLACE/noteflow.git
cd noteflow
npm install
npx expo start
```

------------------------------------------------------------------------


## 📝 Licencia

Proyecto académico --- uso libre educativo.
