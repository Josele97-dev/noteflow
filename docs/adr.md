# ¿Por qué usar Expo Managed Workflow y no React Native CLI?

NoteFlow es una aplicación móvil que necesita acceso a APIs nativas como notificaciones push, geolocalización y permisos del dispositivo. Al iniciar el proyecto se debía elegir entre Expo Managed Workflow y React Native CLI (bare workflow) como base del desarrollo.

Se eligió Expo Managed Workflow por varias razones. La primera es la velocidad de desarrollo: Expo abstrae toda la configuración nativa de iOS y Android, eliminando la necesidad de mantener carpetas /ios y /android manualmente, lo que reduce significativamente el tiempo de setup. Todas las APIs nativas que NoteFlow necesita (expo-notifications, expo-location, expo-haptics) están disponibles como paquetes oficiales de Expo, bien mantenidos y con documentación clara, por lo que no existe ninguna funcionalidad que requiera salir del ecosistema gestionado.

Otro factor determinante fue la capacidad de publicar actualizaciones over-the-air sin pasar por revisión de App Store o Google Play, lo que agiliza el ciclo de iteración considerablemente. Además, Expo Application Services permite generar builds de producción para ambas plataformas desde CI/CD sin necesidad de máquinas macOS dedicadas.

El principal inconveniente es el menor control sobre el código nativo. Si en el futuro NoteFlow necesitara un módulo nativo personalizado no soportado por Expo, sería necesario migrar al bare workflow, lo que conlleva un coste adicional. Sin embargo, dado el alcance actual del proyecto, este riesgo se considera asumible frente a los beneficios obtenidos.

# ¿Por qué usar Zustand en lugar de Context API o Redux?

NoteFlow necesita un sistema de gestión de estado global para sincronizar notas, tareas e ideas entre pantallas, manejar estados de carga y error, y mantener los datos consistentes durante la navegación. Se evaluaron tres opciones: Context API nativa de React, Redux Toolkit y Zustand.

La Context API fue descartada porque genera re-renders innecesarios en todos los componentes que consumen el contexto, aunque el dato concreto que les interesa no haya cambiado. Para una aplicación con listas largas y actualizaciones frecuentes como NoteFlow, esto supone un problema de rendimiento real y difícil de mitigar sin añadir complejidad adicional.

Redux Toolkit fue descartado por su verbosidad. Requiere definir slices, actions, reducers y selectores por separado, lo que añade una cantidad significativa de código repetitivo para un proyecto de esta escala sin aportar beneficios proporcionales.

Se eligió Zustand porque ofrece una API minimalista donde el store completo se define en un único archivo con tipado TypeScript directo y sin boilerplate. Las suscripciones son granulares, lo que significa que los componentes solo se re-renderizan cuando el dato exacto que consumen cambia. No requiere envolver la aplicación en ningún provider adicional y es compatible con async/await de forma nativa, lo que encaja perfectamente con las llamadas asíncronas a la API de Vercel. El resultado es un store centralizado, completamente tipado, que cubre toda la lógica de datos de la aplicación en menos de 200 líneas.

# ¿Por qué almacenar las notas en PostgreSQL y los archivos en AWS S3 en lugar de usar Firebase para todo?

NoteFlow necesita persistir tres tipos de datos: contenido estructurado como notas, tareas e ideas; autenticación de usuarios; y archivos multimedia. Firebase ofrece una solución integrada que cubre los tres casos con Auth, Firestore y Storage. Se evaluó si usar Firebase para todo o combinar servicios especializados según el caso de uso.

La decisión fue usar Firebase únicamente para autenticación y datos de perfil de usuario, PostgreSQL en Neon para el contenido principal y AWS S3 para el almacenamiento de archivos.

Firebase Auth se mantiene porque ofrece autenticación robusta con email y contraseña, gestión de sesiones y un SDK oficial para React Native bien integrado que ya estaba funcionando desde el inicio del proyecto.

Firestore fue descartado como base de datos principal por dos motivos fundamentales. El primero es que su modelo de datos NoSQL dificulta las consultas complejas con filtros combinados, ordenación y búsqueda por múltiples campos simultáneamente, operaciones que son habituales en una aplicación de notas. El segundo es el modelo de precios, que escala por número de lecturas y escrituras y puede dispararse con listas que se recargan frecuentemente.

Neon es PostgreSQL serverless, compatible con el entorno serverless de Vercel, con tiempos de arranque mínimos y un plan gratuito generoso para desarrollo. PostgreSQL permite relaciones, índices y consultas SQL expresivas que se adaptan de forma natural a la estructura de datos de NoteFlow.

AWS S3 se eligió para el almacenamiento de media por ser el estándar de la industria para objetos estáticos, con alta disponibilidad y fácil integración con la API desplegada en Vercel mediante el SDK oficial de AWS. Firebase Storage presenta un modelo de precios menos predecible a escala y añadiría una dependencia adicional a Firebase que se prefirió evitar.

El principal inconveniente de esta arquitectura es la mayor complejidad operativa al gestionar tres servicios en lugar de uno, y la necesidad de mantener sincronizado el UID de Firebase Auth con el identificador de usuario en PostgreSQL. Sin embargo, la ganancia en flexibilidad, rendimiento y precios predecibles justifica esta decisión.
