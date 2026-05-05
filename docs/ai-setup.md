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
- Generar animaciones declarativas que aumentan el parpadeo  

Por eso, la configuración inicial fue clave para que la IA trabajara **a favor del proyecto**, no en contra.

---

# Cursor – Configuración del archivo `.cursorrules`

Cursor permite definir reglas persistentes que afectan a TODO el código que genera.  
Se creó un archivo `.cursorrules` en la raíz del proyecto con:

### ✔ Contexto del proyecto
- App Expo con TypeScript  
- Navegación con Expo Router  
- Estado global con Zustand  
- Persistencia con AsyncStorage  
- FlashList para listas  
- Reanimated para animaciones imperativas  
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
- **No usar animaciones declarativas (`entering`, `exiting`) para pantallas**  
  - Estas animaciones aumentan el parpadeo en SDK 55  
  - Se mantienen implementadas, pero NO se usan  
  - Se usa animación imperativa para reducir flicker  

### ✔ Objetivo final
Evitar que Cursor generara código que rompiera la arquitectura o que reintrodujera problemas ya resueltos (como el flicker).

---

# Gemini / Claude – Configuración del sistema de instrucciones

Estas herramientas se usaron para:

- Explicar conceptos  
- Revisar decisiones técnicas  
- Generar documentación  
- Proponer alternativas de arquitectura  

Para evitar inconsistencias, se configuró un **prompt de sistema persistente** con:

### ✔ Stack técnico del proyecto
- Expo SDK 55  
- React Native 0.76  
- Expo Router  
- Zustand + persist  
- FlashList  
- Reanimated 3  
- Zod  
- AsyncStorage  

### ✔ Convenciones del proyecto
- Estructura de carpetas fija  
- Tipos definidos en `types/`  
- Store único en `store/notesStore.ts`  
- Tema visual en `constants/theme.ts`  
- Animaciones imperativas para pantallas  
- Nada de librerías externas no aprobadas  

### ✔ Restricciones
- No generar código que dependa de nativos no soportados  
- No usar APIs obsoletas  
- No modificar la estructura de rutas  
- No usar animaciones declarativas para pantallas (por el parpadeo)  

---

# Cómo la IA ayudó realmente en el proyecto

La IA se usó como apoyo en:

### ✔ Resolución de errores  
Especialmente en:
- Zustand + persist  
- FlashList  
- Expo Router  
- Reanimated  

### ✔ Refactorización  
Para limpiar código, mejorar legibilidad y evitar duplicación.

### ✔ Documentación  
Ayudó a redactar partes complejas de forma clara y profesional.

### ✔ Exploración técnica  
Comparación entre librerías UI, decisiones de arquitectura, etc.

---

# Por qué NO se usaron las animaciones declarativas de Reanimated

Este punto es clave y se documenta también en `react-native-teoria.md`, pero aquí queda registrado:

### Las animaciones declarativas (`entering`, `exiting`) provocan más parpadeo  
En Expo SDK 55, estas animaciones:

- Hacen remount interno  
- No permiten sincronizar salida con `router.back()`  
- No permiten controlar scale + translate + opacity juntos  
- Se rompen con FlashList  
- Aumentan el flicker en Android  

### ✔ Por eso se decidió:
- Mantenerlas implementadas (por si se usan en listas o chips)  
- **NO usarlas en pantallas de detalle**  
- Usar animación imperativa con `useSharedValue` + `withTiming`  

Esto redujo el parpadeo al mínimo posible.

---

# Conclusión

La configuración de IA fue esencial para:

- Mantener coherencia técnica  
- Evitar errores comunes  
- Acelerar el desarrollo  
- Documentar decisiones  
- Reducir el parpadeo en transiciones  
- Mantener una arquitectura limpia y estable  

Gracias a estas reglas, la IA se convirtió en una herramienta útil y controlada, no en un generador de código caótico.
