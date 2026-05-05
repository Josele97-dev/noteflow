# Gestión del proyecto – Project Management

## Enfoque general

Antes de escribir código, organicé el proyecto como si fuera un desarrollo real.  
El objetivo era tener una visión clara del trabajo, dividirlo en tareas pequeñas y avanzar de forma ordenada sin improvisar.

Para ello utilicé **Trello** como herramienta principal de gestión.

---

## Enlace al tablero de Trello

El tablero completo del proyecto puede consultarse aquí:

https://trello.com/b/I1L4Exy8/noteflow

Este enlace también está incluido en el README del repositorio para facilitar el acceso desde fuera de la carpeta de documentación.

---

## Estructura del tablero

El tablero contiene cinco columnas que representan el flujo completo de trabajo:

- **Backlog**  
  Todas las ideas, funcionalidades y tareas que podrían hacerse. No están priorizadas.

- **Todo**  
  Tareas seleccionadas para la siguiente iteración. Aquí solo entra trabajo claro y listo para empezar.

- **In Progress**  
  Tareas en desarrollo activo.

- **Review**  
  Tareas terminadas pero pendientes de revisión, pruebas o ajustes finales.

- **Done**  
  Trabajo completado y verificado.

---

## Tarjetas y subtareas

Cada funcionalidad principal de NoteFlow tiene su propia tarjeta.  
Ejemplos:

- Crear estructura inicial del proyecto  
- Implementar navegación con Expo Router  
- Crear Zustand store  
- Implementar persistencia con AsyncStorage  
- Crear pantallas de detalle  
- Añadir animaciones con Reanimated  
- Resolver parpadeo en transiciones  
- Implementar FlashList en las tres pestañas  
- Crear formulario con Zod  
- Añadir Haptics  

Cada tarjeta se divide en subtareas técnicas concretas para evitar ambigüedad.  
Esto permitió avanzar de forma constante y medir el progreso real.

---

## Flujo de trabajo

El flujo fue:

1. Seleccionar tareas del Backlog → Todo  
2. Mover a In Progress al empezar  
3. Pasar a Review cuando la funcionalidad estaba implementada  
4. Probar en dispositivo real y simulador  
5. Mover a Done cuando todo funcionaba sin errores  

Este sistema evitó perder tiempo, permitió detectar dependencias entre tareas y mantuvo el proyecto ordenado.

---

## Documentación en el repositorio

El enlace al tablero de Trello está incluido en:

- README.md  
- docs/project-management.md (este archivo)

Esto permite que cualquier persona que revise el proyecto pueda ver cómo se organizó el trabajo desde el inicio.

---

## Reflexión final

La organización previa fue clave para que el desarrollo avanzara sin bloqueos.  
Gracias al tablero pude:

- Priorizar correctamente  
- Evitar tareas duplicadas  
- Mantener una visión clara del proyecto  
- Controlar el progreso real  
- Documentar cada fase del desarrollo  

Este enfoque permitió que NoteFlow se desarrollara como un proyecto profesional, no como un conjunto de archivos sueltos.
