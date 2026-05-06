# Teoría de React Native, Expo y decisiones técnicas en NoteFlow

Este documento explica los fundamentos de React Native, cómo funciona Expo, qué problemas reales aparecieron durante el desarrollo de NoteFlow (incluyendo el parpadeo en transiciones) y por qué se tomaron decisiones técnicas específicas, como el uso de animaciones imperativas en lugar de animaciones declarativas.

---

# 1. Qué es React Native realmente

React Native no renderiza HTML ni usa un WebView.  
Cuando escribes:

```tsx
<View>
  <Text>Hola</Text>
</View>
```

React Native no dibuja HTML.
En su lugar:

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

En proyectos reales se usa un Development Build, que es un binario propio generado con EAS Build.

NoteFlow funciona perfectamente en Expo Go porque:

- No usa módulos nativos personalizados.
- Todas las librerías son compatibles con Expo.

---

# 3. Metro Bundler

Metro es el empaquetador de React Native.
Su función es:

- Resolver imports
- Empaquetar el código JS/TS
- Transformar JSX
- Servir el bundle durante el desarrollo

No es Webpack, no es Vite:
es un bundler optimizado para React Native.

---

# 4. Navegación con Expo Router

Expo Router usa el sistema de archivos para definir rutas.
En NoteFlow se implementó:

- Navegación por pestañas (Tabs)
- Rutas dinámicas para detalle: [id].tsx
- Un modal para crear nuevas notas

Expo Router simplifica la navegación, pero tiene un comportamiento importante:

👉 Cada vez que navegas a una pantalla, Expo Router hace un remount del componente.

Esto es relevante para el siguiente punto: el parpadeo.

---

# 5. FlashList y reciclaje de componentes

FlashList soluciona problemas de rendimiento:

- Reciclaje agresivo de vistas  
- Mejor estimación de tamaño  
- Menos re-renders  

Se usa en:

- Notas  
- Ideas  
- Checklists  

---

# 6. Estado global con Zustand

Zustand se eligió porque:

- No requiere providers anidados  
- No provoca re-renders innecesarios  
- Es más simple que Redux  
- Funciona perfecto con persistencia  

---

# 7. Persistencia con AsyncStorage

Permite:

- Guardar datos en el dispositivo  
- Rehidratar el estado al abrir la app  
- Mantener notas, ideas y tareas  

---

# 8. Sistema de diseño y modo oscuro

- Paleta de colores propia  
- Tipografía consistente  
- Espaciados base  
- useColorScheme para modo oscuro/claro  

---

# 9. Conclusión técnica

NoteFlow demuestra entendimiento de:

- React Native  
- Expo Router  
- Reanimated  
- FlashList  
- Zustand  
- Persistencia  
- Arquitectura móvil  

Las decisiones técnicas fueron basadas en pruebas reales y búsqueda de rendimiento y fluidez.
