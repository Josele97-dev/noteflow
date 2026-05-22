# NoteFlow – Definición de la idea

## Qué problema resuelve NoteFlow

NoteFlow nace para resolver un problema muy concreto: la mayoría de apps de notas mezclan todo en un mismo sitio (notas largas, ideas rápidas, tareas, listas), lo que termina generando ruido, fricción y sensación de caos.

El usuario acaba con decenas de notas sin clasificar, tareas perdidas entre texto y ninguna vista clara de qué es accionable y qué no.

NoteFlow separa claramente tres tipos de información:

- Notas de texto (contenido más largo)
- Tareas en formato checklist
- Ideas rápidas con etiquetas y color

De esta forma, cada cosa tiene su lugar y la interfaz se adapta al tipo de contenido, en lugar de forzar todo en el mismo molde.

## Usuario objetivo y uso en su día a día

El usuario objetivo es alguien que:

- Quiere organizar su vida personal o estudios sin complicarse con herramientas pesadas.
- Usa el móvil como herramienta principal de organización.
- Valora la rapidez, la claridad visual y que todo cargue al instante.

Ejemplos de uso diario:

- **Por la mañana:** revisa la pestaña de *Tareas* para ver qué checklists tiene pendientes.
- **Durante el día:** anota ideas rápidas en la pestaña de *Ideas*, usando etiquetas para agrupar temas (ej. `#app`, `#estudios`, `#negocio`).
- **Por la noche:** escribe notas más largas en la pestaña de *Notas* para reflexionar, documentar o guardar información importante.

La app está pensada para abrirla, hacer algo concreto en pocos segundos y cerrarla, sin fricción.

## Funcionalidades principales

- **Tres secciones principales:**
  - **Notas:** listado de notas de texto con título, contenido y fecha.
  - **Tareas (checklists):** listas de tareas con items marcables y barra de progreso.
  - **Ideas:** notas rápidas con etiquetas y color de fondo.

- **Detalle de cada elemento:**
  - Pantalla de detalle para Nota, Idea y Checklist.
  - Posibilidad de editar, archivar y eliminar desde el detalle con confirmación.

- **Creación de nuevo contenido:**
  - Pantalla `crear` que adapta el formulario según el tipo de nota.
  - Validación con Zod para evitar datos incompletos.

- **Autenticación:**
  - Registro e inicio de sesión con Firebase Auth.
  - Sesión persistente — el usuario no tiene que volver a iniciar sesión.
  - Cada usuario ve únicamente sus propios datos.

- **Perfil de usuario:**
  - Pantalla de perfil con nombre, email y foto.
  - Foto de perfil seleccionable desde la galería y almacenada en AWS S3.

- **Backend y persistencia en la nube:**
  - API REST con Next.js desplegada en Vercel.
  - Base de datos PostgreSQL en Neon.
  - Los datos se sincronizan en tiempo real con el servidor.

- **Archivado:**
  - Posibilidad de archivar notas, ideas y tareas.
  - Pestaña de archivados con buscador.

- **Estado global:**
  - Gestión de notas, ideas y checklists con Zustand.
  - Las acciones llaman a la API REST en vez de guardar localmente.

- **Listas de alto rendimiento:**
  - Uso de FlashList en las tres pestañas.

- **Tema visual:**
  - Soporte para modo claro y oscuro con un sistema de diseño propio.

- **UX:**
  - Feedback háptico al eliminar, archivar y completar checklists.
  - Estados vacíos cuando no hay contenido.
  - Animaciones de entrada y salida en pantallas de detalle.

## Stack técnico

- **App móvil:** Expo SDK 55, React Native, TypeScript
- **Navegación:** Expo Router
- **Estado global:** Zustand
- **Autenticación:** Firebase Auth + Firebase Admin SDK
- **Base de datos de perfiles:** Firestore
- **Backend:** Next.js desplegado en Vercel
- **Base de datos:** PostgreSQL en Neon
- **Almacenamiento de imágenes:** AWS S3
- **Validación:** Zod

## Repositorio y estructura

noteflow_55/
app/           → rutas con Expo Router
components/    → componentes reutilizables
store/         → Zustand store
lib/           → funciones de API
types/         → tipos TypeScript
constants/     → tema visual
hooks/         → hooks personalizados
docs/          → documentación

## API Backend

La API REST está desplegada en: https://noteflow-api.vercel.app/

Repositorio del backend: `noteflow-api`