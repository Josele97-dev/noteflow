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

## Funcionalidades principales de esta primera versión

- Tres secciones principales:
  - **Notas:** listado de notas de texto con título, contenido y fecha.
  - **Tareas (checklists):** listas de tareas con items marcables y barra de progreso.
  - **Ideas:** notas rápidas con etiquetas y color de fondo.

- Detalle de cada elemento:
  - Pantalla de detalle para Nota, Idea y Checklist.
  - Posibilidad de eliminar desde el detalle con confirmación.

- Creación de nuevo contenido:
  - Pantalla `crear` que adapta el formulario según el tipo de nota.
  - Validación con Zod para evitar datos incompletos.

- Estado global:
  - Gestión de notas, ideas y checklists con Zustand.
  - Persistencia con AsyncStorage para que los datos se mantengan al cerrar la app.

- Listas de alto rendimiento:
  - Uso de FlashList en las tres pestañas para evitar problemas de rendimiento con muchas notas.

- Tema visual:
  - Soporte para modo claro y oscuro con un sistema de diseño propio.

- UX:
  - Feedback háptico al eliminar y al completar checklists.
  - Estados vacíos cuando no hay contenido.

## Funcionalidades opcionales para futuras versiones

- **Búsqueda global:** campo de búsqueda en cada pestaña que filtre en tiempo real.
- **Archivado de notas:** en lugar de eliminar definitivamente, permitir archivar y tener una pestaña de “Archivadas”.
- **Sincronización en la nube:** backup entre dispositivos.
- **Recordatorios y notificaciones:** asociar fechas a notas o tareas.
- **Etiquetas globales:** vista por etiquetas para ver todo lo relacionado con un tema.
- **Filtros avanzados:** por fecha, tipo, estado de completado, etc.
- **Modo enfoque:** vista simplificada para centrarse solo en una lista o nota.

## Repositorio y estructura inicial

El proyecto se creó con:

- `npx create-expo-app@latest noteflow --template blank-typescript`

Estructura base:

- `app/` – rutas con Expo Router (tabs, detalle, modal de nueva nota)
- `components/` – componentes reutilizables (tarjetas, layouts, etc.)
- `store/` – Zustand store para notas, ideas y checklists
- `types/` – tipos TypeScript para las distintas notas
- `constants/` – tema visual, colores, tipografía
- `docs/` – documentación del proyecto