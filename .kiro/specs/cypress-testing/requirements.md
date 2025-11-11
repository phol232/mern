# Requirements Document - Cypress E2E Testing

## Introduction

Este documento define los requisitos para implementar pruebas end-to-end (E2E) con Cypress en el sistema CRÍTICO MERN. El sistema es una plataforma educativa que desarrolla y evalúa el pensamiento crítico en estudiantes mediante generación de textos académicos con detección automática de sesgos, evaluación de comprensión lectora, y feedback automatizado con inteligencia artificial.

La implementación de Cypress permitirá validar todas las funcionalidades del sistema desde la perspectiva del usuario, asegurando que los flujos completos funcionen correctamente en el entorno de producción (https://proyecto.yamycorp.com/).

## Glossary

- **Sistema_Cypress**: Framework de testing E2E que ejecuta pruebas automatizadas en el navegador
- **Sistema_CRÍTICO**: Plataforma educativa para desarrollo de pensamiento crítico
- **Usuario_Docente**: Usuario con rol "teacher" que gestiona cursos y contenido
- **Usuario_Estudiante**: Usuario con rol "student" que consume contenido y responde evaluaciones
- **Sesgo_Cognitivo**: Patrón de razonamiento que desvía el pensamiento crítico objetivo
- **Texto_Académico**: Contenido educativo generado o creado para un curso
- **Pregunta_Evaluación**: Ítem de evaluación de tipo literal, inferencial o crítica
- **Intento_Respuesta**: Registro de respuesta de estudiante a una pregunta (QuestionAttempt)
- **Análisis_Sesgos**: Evaluación automática de sesgos en textos o respuestas
- **Chatbot_Tutor**: Asistente de IA que responde preguntas sobre el contenido del curso
- **Curso**: Contenedor de temas y textos académicos creado por docente
- **Tema**: Agrupación de textos dentro de un curso (Topic)
- **Inscripción**: Relación entre estudiante y curso (Enrollment)

## Requirements

### Requirement 1

**User Story:** Como desarrollador del sistema, quiero configurar Cypress en el proyecto MERN, para que pueda ejecutar pruebas E2E automatizadas contra el entorno de producción.

#### Acceptance Criteria

1. WHEN el desarrollador instala las dependencias de Cypress, THE Sistema_Cypress SHALL estar disponible en el proyecto con todos los paquetes necesarios
2. WHEN el desarrollador configura Cypress, THE Sistema_Cypress SHALL apuntar a la URL base "https://proyecto.yamycorp.com/"
3. WHEN el desarrollador ejecuta el comando de pruebas, THE Sistema_Cypress SHALL iniciar y estar listo para ejecutar specs
4. WHEN el desarrollador configura variables de entorno, THE Sistema_Cypress SHALL tener acceso a credenciales de usuarios de prueba sin exponerlas en el código
5. WHERE el proyecto usa TypeScript, THE Sistema_Cypress SHALL tener soporte completo de tipos y autocompletado

### Requirement 2

**User Story:** Como desarrollador, quiero documentar todas las funcionalidades del sistema en un archivo de referencia, para que los tests de Cypress cubran todos los flujos críticos del usuario.

#### Acceptance Criteria

1. THE Sistema_Cypress SHALL tener un documento que liste todas las páginas y rutas del sistema
2. THE Sistema_Cypress SHALL tener un documento que describa los flujos de Usuario_Docente con sus pasos específicos
3. THE Sistema_Cypress SHALL tener un documento que describa los flujos de Usuario_Estudiante con sus pasos específicos
4. THE Sistema_Cypress SHALL tener un documento que identifique los elementos UI críticos para interacción en cada página
5. THE Sistema_Cypress SHALL tener un documento que liste todos los endpoints API relevantes para validación

### Requirement 3

**User Story:** Como desarrollador, quiero implementar pruebas de autenticación, para que valide que usuarios pueden iniciar sesión y registrarse correctamente.

#### Acceptance Criteria

1. WHEN un usuario válido ingresa credenciales correctas, THE Sistema_Cypress SHALL verificar que el login sea exitoso y redirija al dashboard
2. WHEN un usuario ingresa credenciales incorrectas, THE Sistema_Cypress SHALL verificar que se muestre un mensaje de error apropiado
3. WHEN un nuevo usuario completa el formulario de registro, THE Sistema_Cypress SHALL verificar que la cuenta se cree exitosamente
4. WHEN un usuario cierra sesión, THE Sistema_Cypress SHALL verificar que sea redirigido a la página de login
5. WHEN un usuario no autenticado intenta acceder a rutas protegidas, THE Sistema_Cypress SHALL verificar que sea redirigido al login

### Requirement 4

**User Story:** Como desarrollador, quiero implementar pruebas del flujo completo de Usuario_Docente, para que valide la gestión de cursos, textos y preguntas.

#### Acceptance Criteria

1. WHEN Usuario_Docente crea un Curso nuevo, THE Sistema_Cypress SHALL verificar que el curso aparezca en la lista de cursos del docente
2. WHEN Usuario_Docente genera un Texto_Académico con IA, THE Sistema_Cypress SHALL verificar que el texto se genere con detección de sesgos
3. WHEN Usuario_Docente crea Pregunta_Evaluación para un texto, THE Sistema_Cypress SHALL verificar que la pregunta se guarde correctamente con su tipo
4. WHEN Usuario_Docente visualiza estudiantes inscritos, THE Sistema_Cypress SHALL verificar que la lista de estudiantes se muestre con su progreso
5. WHEN Usuario_Docente genera feedback con IA para una respuesta, THE Sistema_Cypress SHALL verificar que el feedback se genere y se muestre al estudiante

### Requirement 5

**User Story:** Como desarrollador, quiero implementar pruebas del flujo completo de Usuario_Estudiante, para que valide la inscripción, lectura y evaluación en cursos.

#### Acceptance Criteria

1. WHEN Usuario_Estudiante visualiza cursos disponibles, THE Sistema_Cypress SHALL verificar que se muestren cursos no inscritos
2. WHEN Usuario_Estudiante se inscribe en un Curso, THE Sistema_Cypress SHALL verificar que la Inscripción se registre y el curso aparezca en "Mis Cursos"
3. WHEN Usuario_Estudiante lee un Texto_Académico, THE Sistema_Cypress SHALL verificar que el contenido completo se muestre correctamente
4. WHEN Usuario_Estudiante responde una Pregunta_Evaluación, THE Sistema_Cypress SHALL verificar que el Intento_Respuesta se guarde exitosamente
5. WHEN Usuario_Estudiante solicita Análisis_Sesgos de su respuesta, THE Sistema_Cypress SHALL verificar que el análisis se muestre con puntuación y recomendaciones

### Requirement 6

**User Story:** Como desarrollador, quiero implementar pruebas del sistema de detección de sesgos, para que valide que el análisis funcione correctamente tanto en textos como en respuestas.

#### Acceptance Criteria

1. WHEN el sistema analiza un Texto_Académico con sesgos lingüísticos, THE Sistema_Cypress SHALL verificar que detecte los 8 tipos de sesgos definidos
2. WHEN el sistema analiza un Intento_Respuesta con sesgos cognitivos, THE Sistema_Cypress SHALL verificar que calcule la puntuación académica (0-12)
3. WHEN el sistema detecta sesgos en una respuesta, THE Sistema_Cypress SHALL verificar que muestre sugerencias específicas de mejora
4. WHEN el sistema genera texto con revisión automática, THE Sistema_Cypress SHALL verificar que corrija sesgos en iteraciones sucesivas
5. WHEN el sistema muestra palabras problemáticas, THE Sistema_Cypress SHALL verificar que incluya contexto y sugerencias de reemplazo

### Requirement 7

**User Story:** Como desarrollador, quiero implementar pruebas del Chatbot_Tutor, para que valide que los estudiantes puedan interactuar correctamente con el asistente de IA.

#### Acceptance Criteria

1. WHEN Usuario_Estudiante abre el Chatbot_Tutor en una página de evaluación, THE Sistema_Cypress SHALL verificar que el chatbot se muestre correctamente
2. WHEN Usuario_Estudiante envía un mensaje al Chatbot_Tutor, THE Sistema_Cypress SHALL verificar que reciba una respuesta contextual
3. WHEN el Chatbot_Tutor responde, THE Sistema_Cypress SHALL verificar que la respuesta esté relacionada con el Texto_Académico actual
4. WHEN Usuario_Estudiante solicita pistas sobre una pregunta, THE Sistema_Cypress SHALL verificar que el chatbot guíe sin dar respuestas directas
5. WHEN Usuario_Estudiante cierra y reabre el chatbot, THE Sistema_Cypress SHALL verificar que el historial de conversación persista

### Requirement 8

**User Story:** Como desarrollador, quiero implementar pruebas de gestión de estudiantes, para que valide que los docentes puedan monitorear el progreso correctamente.

#### Acceptance Criteria

1. WHEN Usuario_Docente accede a la gestión de estudiantes, THE Sistema_Cypress SHALL verificar que se muestre la lista completa de estudiantes del curso
2. WHEN Usuario_Docente visualiza el progreso de un estudiante, THE Sistema_Cypress SHALL verificar que se muestren métricas de textos completados
3. WHEN Usuario_Docente filtra estudiantes por curso, THE Sistema_Cypress SHALL verificar que solo se muestren estudiantes inscritos en ese curso
4. WHEN Usuario_Docente visualiza respuestas de un estudiante, THE Sistema_Cypress SHALL verificar que se muestren todos los Intento_Respuesta
5. WHEN Usuario_Docente genera feedback para múltiples respuestas, THE Sistema_Cypress SHALL verificar que el feedback se genere para cada una

### Requirement 9

**User Story:** Como desarrollador, quiero implementar pruebas de validación de datos, para que verifique que el sistema maneje correctamente entradas inválidas y casos edge.

#### Acceptance Criteria

1. WHEN un usuario ingresa datos inválidos en un formulario, THE Sistema_Cypress SHALL verificar que se muestren mensajes de validación apropiados
2. WHEN un usuario intenta crear un Curso sin título, THE Sistema_Cypress SHALL verificar que el sistema rechace la operación
3. WHEN un usuario intenta acceder a un recurso inexistente, THE Sistema_Cypress SHALL verificar que se muestre un error 404 o mensaje apropiado
4. WHEN un usuario intenta realizar una acción sin permisos, THE Sistema_Cypress SHALL verificar que el sistema deniegue el acceso
5. WHEN el sistema recibe respuestas de API con errores, THE Sistema_Cypress SHALL verificar que se muestren mensajes de error al usuario

### Requirement 10

**User Story:** Como desarrollador, quiero implementar comandos personalizados de Cypress, para que simplifique la escritura de tests y mejore la reutilización de código.

#### Acceptance Criteria

1. THE Sistema_Cypress SHALL tener un comando personalizado para login que acepte rol de usuario
2. THE Sistema_Cypress SHALL tener un comando personalizado para crear un Curso completo con datos de prueba
3. THE Sistema_Cypress SHALL tener un comando personalizado para inscribir un estudiante en un curso
4. THE Sistema_Cypress SHALL tener un comando personalizado para navegar a secciones específicas del sistema
5. THE Sistema_Cypress SHALL tener un comando personalizado para limpiar datos de prueba después de cada test

### Requirement 11

**User Story:** Como desarrollador, quiero implementar fixtures de datos de prueba, para que los tests sean consistentes y reproducibles.

#### Acceptance Criteria

1. THE Sistema_Cypress SHALL tener fixtures con credenciales de usuarios de prueba para cada rol
2. THE Sistema_Cypress SHALL tener fixtures con datos de Curso de ejemplo para creación rápida
3. THE Sistema_Cypress SHALL tener fixtures con Texto_Académico de ejemplo con y sin sesgos
4. THE Sistema_Cypress SHALL tener fixtures con Pregunta_Evaluación de ejemplo para cada tipo
5. THE Sistema_Cypress SHALL tener fixtures con respuestas de estudiante de ejemplo con diferentes niveles de sesgos

### Requirement 12

**User Story:** Como desarrollador, quiero configurar reportes de pruebas, para que pueda visualizar resultados y capturas de pantalla de fallos.

#### Acceptance Criteria

1. WHEN las pruebas de Cypress se ejecutan, THE Sistema_Cypress SHALL generar reportes en formato HTML
2. WHEN una prueba falla, THE Sistema_Cypress SHALL capturar screenshots automáticamente del estado de fallo
3. WHEN una prueba falla, THE Sistema_Cypress SHALL grabar video de la ejecución completa del test
4. THE Sistema_Cypress SHALL generar reportes con métricas de tiempo de ejecución por test
5. THE Sistema_Cypress SHALL organizar reportes y artefactos en directorios estructurados por fecha de ejecución
