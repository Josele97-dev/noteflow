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

# 2. Expo Go vs Development Build

Expo Go es ideal para prototipar, pero tiene limitaciones:

- No permite módulos nativos personalizados.
- No permite ciertas APIs avanzadas.
- No permite añadir librerías nativas que no estén preinstaladas.

En proyectos reales se usa un **Development Build**, que es un binario propio generado con EAS Build.

NoteFlow usa un Development Build porque:

- Usa `@react-native-firebase` que contiene código nativo.
- Usa `expo-image-picker` que requiere permisos nativos.
- Expo Go no soporta estos módulos.

El build se genera con:
```bash
eas build --profile development --platform android
```

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

FlashList soluciona problemas de rendimiento:

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

En versiones anteriores usaba `persist` con AsyncStorage. Actualmente el estado se sincroniza con el backend en vez de persistir localmente.

---

# 7. Persistencia y sincronización con el backend

NoteFlow pasó de persistencia local con AsyncStorage a sincronización con un backend real:

- **Antes:** los datos se guardaban en el dispositivo con AsyncStorage
- **Ahora:** los datos se guardan en PostgreSQL (Neon) a través de una API REST

Esto permite:

- Sincronización entre dispositivos
- Datos seguros aunque se desinstale la app
- Cada usuario ve solo sus propios datos

---

# 8. Autenticación con Firebase Auth

Firebase Auth gestiona la identidad del usuario:

- Registro con email y contraseña
- Inicio de sesión persistente
- Token de identidad para autenticar peticiones al backend

El backend usa Firebase Admin SDK para verificar los tokens y filtrar los datos por usuario.

---

# 9. Almacenamiento de imágenes con AWS S3

Las imágenes de perfil se guardan en AWS S3:

- La app pide al backend una Presigned URL
- La app sube la imagen directamente a S3
- La URL pública se guarda en Firestore
- El componente `Image` renderiza la imagen desde la URL de S3

---

# 10. Sistema de diseño y modo oscuro

- Paleta de colores propia en `constants/theme.ts`
- Tipografía consistente
- Espaciados base
- `useColorScheme` para modo oscuro/claro

---

# 11. Conclusión técnica

NoteFlow demuestra entendimiento de:

- React Native y arquitectura nativa
- Expo Router y navegación por archivos
- Reanimated para animaciones imperativas
- FlashList para listas de alto rendimiento
- Zustand para estado global
- Firebase Auth para autenticación
- API REST con Next.js y PostgreSQL
- AWS S3 para almacenamiento de assets
- Development Build con EAS

Las decisiones técnicas fueron basadas en pruebas reales y búsqueda de rendimiento y fluidez.