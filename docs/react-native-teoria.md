# Teoría de React Native, Expo y decisiones técnicas en NoteFlow

Este documento explica los fundamentos de React Native, cómo funciona Expo, qué problemas reales aparecieron durante el desarrollo de NoteFlow y por qué se tomaron decisiones técnicas específicas.

---

# 1. Qué es React Native realmente

React Native no renderiza HTML ni usa un WebView.
Cuando escribes:

```tsx
<View>
  <Text>Hola</Text>
</View>
```

React Native no dibuja HTML. En su lugar:

- El JavaScript thread ejecuta tu lógica React.
- El UI thread nativo crea vistas reales del sistema operativo (Android/iOS).
- Ambos hilos se comunican mediante un puente (bridge) o, en arquitecturas nuevas, mediante JSI.

Esto significa:

- La app tiene rendimiento nativo real.
- Si el JS thread se bloquea, la interfaz se congela.
- Si el UI thread se bloquea, la app deja de responder visualmente.

Entender esta arquitectura fue clave para optimizar NoteFlow.

---

# 2. Expo Go vs Development Build vs Preview Build

Expo Go es ideal para prototipar, pero tiene limitaciones importantes:

- No permite módulos nativos personalizados.
- No permite ciertas APIs avanzadas como notificaciones locales completas o geolocalización.
- No permite añadir librerías nativas que no estén preinstaladas.

En proyectos reales se usa un **Development Build** o un **Preview Build**, que son binarios propios generados con EAS Build.

NoteFlow usa builds propios porque:

- Usa `@react-native-firebase` que contiene código nativo.
- Usa `expo-notifications` para notificaciones locales programadas.
- Usa `expo-location` para geolocalización.
- Usa `react-native-gesture-handler` para gestos nativos.
- Expo Go no soporta estos módulos.

Los builds se generan con:

```bash
# Para desarrollo (conectado al metro bundler)
eas build --profile development --platform android

# Para pruebas reales en dispositivo (APK independiente)
eas build --profile preview --platform android

# Para producción (AAB para Play Store)
eas build --profile production --platform android
```

La diferencia clave entre `development` y `preview`:
- **development** — necesita Metro Bundler corriendo en el ordenador. Permite hot reload.
- **preview** — APK completamente independiente. Incluye todos los módulos nativos. No necesita nada externo.

---

# 3. Metro Bundler

Metro es el empaquetador de React Native. Su función es:

- Resolver imports
- Empaquetar el código JS/TS
- Transformar JSX
- Servir el bundle durante el desarrollo

No es Webpack, no es Vite — es un bundler optimizado para React Native.

---

# 4. Navegación con Expo Router

Expo Router usa el sistema de archivos para definir rutas. En NoteFlow se implementó:

- Navegación por pestañas (Tabs)
- Rutas dinámicas para detalle: `[id].tsx`
- Un modal para crear nuevas notas
- Un grupo `(auth)` para las pantallas de login y registro
- Protección de rutas con `onAuthStateChanged`

Expo Router simplifica la navegación, pero tiene un comportamiento importante:

Cada vez que navegas a una pantalla, Expo Router hace un remount del componente.

---

# 5. FlashList y reciclaje de componentes

FlashList soluciona problemas de rendimiento de las listas:

- Reciclaje agresivo de vistas
- Mejor estimación de tamaño
- Menos re-renders

Se usa en las tres pestañas principales: Notas, Ideas y Checklists.

---

# 6. Estado global con Zustand

Zustand se eligió porque:

- No requiere providers anidados
- No provoca re-renders innecesarios
- Es más simple que Redux
- Funciona perfectamente con llamadas asíncronas a la API

El store no usa `persist` ni AsyncStorage. En cada arranque de la app, `fetchAll()` hidrata el estado desde la API. Zustand actúa como caché en memoria durante la sesión.

---

# 7. Persistencia y sincronización con el backend

NoteFlow usa un backend real para persistir todos los datos:

- **API REST:** Next.js 16 desplegado en Vercel
- **Base de datos:** PostgreSQL en Neon
- **Autenticación de peticiones:** Firebase Admin SDK verifica el token en cada request

El flujo de datos es:

1. Al arrancar, `fetchAll()` carga todos los datos del usuario desde la API
2. Cada acción (crear, editar, eliminar, archivar) llama a la API inmediatamente
3. La API guarda en PostgreSQL
4. Zustand actualiza el estado local para reflejar el cambio sin recargar

Esto permite sincronización entre dispositivos y que los datos persistan aunque se desinstale la app.

---

# 8. Módulos nativos y permisos

Para acceder a hardware como GPS o notificaciones, se necesitan módulos nativos que actúan de puente entre JavaScript y el sistema operativo.

El sistema operativo requiere que el usuario conceda permisos explícitos. En NoteFlow:

- **expo-notifications** — pide permiso para enviar notificaciones. Si se concede, permite programar notificaciones locales que se lanzan aunque la app esté cerrada.
- **expo-location** — pide permiso de ubicación en primer plano. Si se concede, captura las coordenadas GPS y las convierte en dirección legible mediante geocodificación inversa.

Estos módulos no funcionan en Expo Go — requieren un build propio (preview o production).

---

# 9. Animaciones con Reanimated y Gesture Handler

Reanimated mueve las animaciones al UI thread nativo, evitando que el JS thread las bloquee.

En NoteFlow se usan dos tipos de animaciones:

**Animaciones declarativas (listas):**
```tsx
<Animated.View entering={FadeInDown.delay(index * 60).springify()} exiting={FadeOut}>
  <NoteCard />
</Animated.View>
```
Cada card aparece con un efecto de entrada escalonado. Funciona bien en listas porque cada item se monta independientemente.

**Animaciones imperativas (pantallas de detalle):**
```tsx
const opacity = useSharedValue(0);
opacity.value = withTiming(1, { duration: 300 });
```
Se usan en pantallas de detalle porque las animaciones declarativas provocan parpadeo (flicker) en Android al hacer remount de pantallas completas.

**Swipe-to-delete con Gesture Handler:**
```tsx
const pan = Gesture.Pan()
  .onUpdate((e) => { if (e.translationX < 0) translateX.value = e.translationX; })
  .onEnd(() => {
    if (translateX.value < -80) runOnJS(onDelete)();
    else translateX.value = withSpring(0);
  });
```
Deslizar una card a la izquierda más de 80px la elimina. Si no se llega al umbral, vuelve a su posición con rebote natural. Requiere `GestureHandlerRootView` envolviendo toda la app en el layout raíz.

---

# 10. Autenticación con Firebase Auth

Firebase Auth gestiona la identidad del usuario:

- Registro con email y contraseña
- Inicio de sesión persistente
- Token de identidad para autenticar peticiones al backend

El backend usa Firebase Admin SDK para verificar los tokens y filtrar los datos por usuario.

---

# 11. Almacenamiento de imágenes con AWS S3

Las imágenes de perfil se guardan en AWS S3:

- La app pide al backend una Presigned URL
- La app sube la imagen directamente a S3
- La URL pública se guarda en Firestore
- El componente `Image` renderiza la imagen desde la URL de S3

---

# 12. Sistema de diseño y modo oscuro

- Paleta de colores propia en `constants/theme.ts`
- Tipografía y espaciados consistentes
- `useColorScheme` para detectar modo oscuro/claro
- En modo claro: headers y navegación usan el color primario azul (`#0A4D9C`)
- En modo oscuro: headers usan el color de card para integrarse con el fondo oscuro
- El fondo en modo claro usa un azul muy suave (`#EBF1FB`) para evitar el efecto "demasiado blanco"

---

# 13. Conclusión técnica

NoteFlow demuestra entendimiento de:

- React Native y arquitectura nativa (JS thread / UI thread)
- Expo Router y navegación por archivos
- Reanimated para animaciones declarativas en listas e imperativas en pantallas
- Gesture Handler para gestos nativos a 60 FPS
- FlashList para listas de alto rendimiento
- Zustand para estado global sin persist
- Firebase Auth para autenticación
- API REST con Next.js y PostgreSQL en Neon
- AWS S3 para almacenamiento de assets
- expo-notifications para notificaciones locales programadas
- expo-location para geolocalización y geocodificación inversa
- EAS Build (development, preview, production) y sus diferencias

Las decisiones técnicas fueron basadas en pruebas reales en dispositivo Android y búsqueda de rendimiento y fluidez.