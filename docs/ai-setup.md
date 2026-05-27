# Configuración de herramientas de IA en NoteFlow

La IA formó parte del proceso de desarrollo de NoteFlow, pero no como sustituto del programador, sino como una herramienta de apoyo técnico.  
Para evitar inconsistencias, errores de arquitectura o código incompatible, fue necesario configurar cada herramienta correctamente antes de empezar.

Este documento explica cómo se configuraron las herramientas de IA, qué reglas se definieron y cómo influyeron en el desarrollo del proyecto.

---

## Objetivo de la configuración

Las herramientas de IA pueden generar código muy útil, pero también pueden:

- Contradecir decisiones técnicas del proyecto  
- Usar librerías incompatibles con Expo  
- Proponer estructuras que no encajan con Expo Router  
- Ignorar el sistema de diseño  
- Romper la arquitectura del estado global  
- Generar animaciones declarativas que aumentan el parpadeo en pantallas  

Por eso, la configuración inicial fue clave para que la IA trabajara **a favor del proyecto**, no en contra.

---

# Cursor – Configuración del archivo `.cursorrules`

Cursor permite definir reglas persistentes que afectan a TODO el código que genera.  
Se creó un archivo `.cursorrules` en la raíz del proyecto con:

### ✔ Contexto del proyecto
- App Expo con TypeScript  
- Navegación con Expo Router  
- Estado global con Zustand (sin persist — la hidratación viene de la API)  
- Persistencia real con API REST en Vercel + Neon (PostgreSQL)  
- Autenticación con Firebase Auth  
- FlashList para listas  
- Reanimated para animaciones  
- Gesture Handler para gestos (swipe-to-delete)  
- Sistema de diseño propio con modo claro/oscuro  

### ✔ Reglas de estilo
- Componentes funcionales  
- Hooks personalizados cuando sea necesario  
- Tipado estricto con TypeScript  
- Nombres descriptivos y consistentes  
- Nada de `any` salvo casos muy justificados  

### ✔ Restricciones importantes
- **No usar librerías nativas no compatibles con Expo**  
- **No usar React Navigation (solo Expo Router)**  
- **No usar Context API para estado global (solo Zustand)**  
- **No usar animaciones declarativas (`entering`, `exiting`) en pantallas de detalle**  
  - Estas animaciones aumentan el parpadeo en Android  
  - Se usan en listas y cards (FadeInDown, FadeOut) donde sí funcionan bien  
  - En pantallas de detalle se usa animación imperativa para reducir flicker  

### ✔ Objetivo final
Evitar que Cursor generara código que rompiera la arquitectura o que reintrodujera problemas ya resueltos.

---

# Gemini / Claude – Configuración del sistema de instrucciones

Estas herramientas se usaron para:

- Explicar conceptos  
- Revisar decisiones técnicas  
- Generar documentación  
- Proponer alternativas de arquitectura  
- Implementar funcionalidades completas con contexto del proyecto  

Para evitar inconsistencias, se configuró un **prompt de sistema persistente** con:

### ✔ Stack técnico del proyecto
- Expo SDK 55  
- React Native 0.76  
- Expo Router  
- Zustand (sin persist — hidratación desde API en cada arranque)  
- FlashList  
- Reanimated 3  
- Gesture Handler  
- Zod  
- Firebase Auth  
- API REST propia: Next.js 16 + Neon (PostgreSQL) desplegada en Vercel  
- expo-notifications (notificaciones locales programadas)  
- expo-location (geolocalización y geocodificación inversa)  

### ✔ Convenciones del proyecto
- Estructura de carpetas fija  
- Tipos definidos en `types/`  
- Store único en `store/notesStore.ts`  
- Tema visual en `constants/theme.ts`  
- Animaciones imperativas para pantallas de detalle  
- Animaciones declarativas (FadeInDown) solo en listas  
- Nada de librerías externas no aprobadas  

### ✔ Restricciones
- No generar código que dependa de módulos nativos no soportados en Expo Go  
- No usar APIs obsoletas  
- No modificar la estructura de rutas  
- No usar animaciones declarativas en pantallas (solo en listas)  

---

# Cómo la IA ayudó realmente en el proyecto

### ✔ Resolución de errores  
Especialmente en:
- Zustand e hidratación desde API  
- FlashList  
- Expo Router  
- Reanimated + Gesture Handler  
- Módulos nativos (expo-notifications, expo-location) y su incompatibilidad con Expo Go  

### ✔ Implementación de funcionalidades
- Sistema de temas claro/oscuro con color primario azul en headers y fondos  
- Notificaciones locales programadas con picker de fecha/hora custom (sin módulos nativos)  
- Geolocalización al crear entradas con persistencia en base de datos  
- Swipe-to-delete en cards con animación de rebote  
- Animaciones de entrada escalonadas en listas  
- Icono y splash screen personalizados con fondo azul primario  

### ✔ Refactorización  
Para limpiar código, mejorar legibilidad y evitar duplicación.

### ✔ Documentación  
Ayudó a redactar partes complejas de forma clara y profesional.

### ✔ Exploración técnica  
Comparación entre librerías, decisiones de arquitectura, resolución de problemas de persistencia.

---

# Por qué NO se usan las animaciones declarativas en pantallas

### Las animaciones declarativas (`entering`, `exiting`) en pantallas provocan parpadeo  
En Android con Expo SDK 55, estas animaciones en pantallas de detalle:

- Hacen remount interno  
- No permiten sincronizar la salida con `router.back()`  
- No permiten controlar scale + translate + opacity juntos  
- Aumentan el flicker en Android  

### ✔ Por eso se decidió:
- **Usarlas en listas y cards** (FadeInDown escalonado, FadeOut al eliminar) donde funcionan correctamente  
- **NO usarlas en pantallas de detalle**  
- Usar animación imperativa con `useSharedValue` + `withTiming` en pantallas  

Esto redujo el parpadeo al mínimo posible.

---

# Arquitectura de persistencia

A diferencia de lo que podría sugerirse con Zustand, **no se usa `persist` ni AsyncStorage** para guardar el estado.  
La persistencia real funciona así:

1. Al arrancar la app, `fetchAll()` llama a la API y carga todos los datos  
2. Cada acción (crear, editar, eliminar, archivar) hace una llamada a la API inmediatamente  
3. La API guarda en Neon (PostgreSQL) en Vercel  
4. El store de Zustand actúa como caché en memoria durante la sesión  

Esto garantiza que los datos persisten entre sesiones y dispositivos, y que siempre están sincronizados con el servidor.

---

# Conclusión

La configuración de IA fue esencial para:

- Mantener coherencia técnica  
- Evitar errores comunes con módulos nativos  
- Acelerar el desarrollo de funcionalidades complejas  
- Documentar decisiones  
- Reducir el parpadeo en transiciones  
- Mantener una arquitectura limpia y estable  

Gracias a estas reglas, la IA se convirtió en una herramienta útil y controlada, no en un generador de código caótico.