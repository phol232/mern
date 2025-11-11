# Implementation Plan - Cypress E2E Testing

- [x] 1. Configuración inicial de Cypress
  - Instalar Cypress y dependencias necesarias en el proyecto
  - Configurar TypeScript para Cypress
  - Crear estructura de directorios base
  - Configurar cypress.config.ts con URL de producción
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 1.1 Instalar dependencias de Cypress
  - Ejecutar npm install para agregar cypress, typescript, @types/node
  - Instalar mochawesome para reportes
  - Instalar eslint-plugin-cypress
  - Verificar que todas las dependencias se instalen correctamente
  - _Requirements: 1.1_

- [x] 1.2 Configurar TypeScript para Cypress
  - Crear tsconfig.json en directorio cypress/
  - Configurar tipos de Cypress
  - Habilitar resolución de módulos
  - _Requirements: 1.5_

- [x] 1.3 Crear estructura de directorios
  - Crear cypress/e2e/ con subdirectorios (auth, teacher, student, bias-detection)
  - Crear cypress/fixtures/
  - Crear cypress/support/
  - Crear cypress/downloads/
  - _Requirements: 1.1_

- [x] 1.4 Configurar cypress.config.ts
  - Definir baseUrl apuntando a https://proyecto.yamycorp.com/
  - Configurar timeouts (defaultCommandTimeout: 10000, requestTimeout: 30000)
  - Configurar screenshots y videos
  - Configurar retries (runMode: 2, openMode: 0)
  - Configurar reporter mochawesome
  - _Requirements: 1.2, 1.3_

- [x] 1.5 Configurar variables de entorno
  - Crear cypress.env.json para credenciales locales
  - Agregar cypress.env.json a .gitignore
  - Documentar variables necesarias en README
  - _Requirements: 1.4_

- [x] 2. Crear fixtures de datos de prueba
  - Crear archivo users.json con credenciales de docente y estudiante
  - Crear archivo courses.json con datos de cursos de ejemplo
  - Crear archivo texts.json con textos con y sin sesgos
  - Crear archivo questions.json con preguntas de cada tipo
  - Crear archivo answers.json con respuestas con y sin sesgos
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 2.1 Crear users.json fixture
  - Definir estructura de usuario con email, password, firstName, lastName, role
  - Agregar usuario docente de prueba
  - Agregar usuario estudiante de prueba
  - Agregar usuario admin de prueba (opcional)
  - _Requirements: 11.1_

- [x] 2.2 Crear courses.json fixture
  - Definir estructura de curso con title, description, level
  - Agregar curso básico de ejemplo
  - Agregar curso intermedio de ejemplo
  - _Requirements: 11.2_

- [x] 2.3 Crear texts.json fixture
  - Definir estructura de texto con title, content, difficulty, estimatedReadingTime
  - Agregar texto con sesgos lingüísticos detectables
  - Agregar texto neutral sin sesgos
  - Incluir expectedBiases para validación
  - _Requirements: 11.3_

- [x] 2.4 Crear questions.json fixture
  - Definir estructura de pregunta con text, type, hint, expectedAnswer
  - Agregar pregunta literal de ejemplo
  - Agregar pregunta inferencial de ejemplo
  - Agregar pregunta crítica de ejemplo
  - _Requirements: 11.4_

- [x] 2.5 Crear answers.json fixture
  - Definir estructura de respuesta con value, expectedBiasCount, expectedScore
  - Agregar respuesta con sesgos cognitivos
  - Agregar respuesta neutral sin sesgos
  - _Requirements: 11.5_


- [x] 3. Crear archivo de selectores centralizados
  - Crear cypress/support/selectors.ts
  - Definir selectores para módulo de autenticación
  - Definir selectores para módulo de cursos
  - Definir selectores para módulo de textos
  - Definir selectores para módulo de preguntas
  - Definir selectores para análisis de sesgos
  - Definir selectores para chatbot
  - Definir selectores para gestión de estudiantes
  - _Requirements: 2.4_

- [x] 4. Implementar comandos personalizados de Cypress
  - Crear cypress/support/commands.ts
  - Definir tipos TypeScript para comandos personalizados
  - Implementar comandos de autenticación
  - Implementar comandos de navegación
  - Implementar comandos de creación de datos
  - Implementar comandos de validación
  - Implementar comandos de limpieza
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 4.1 Implementar comandos de autenticación
  - Crear comando login(email, password)
  - Crear comando loginAsTeacher() usando cy.session
  - Crear comando loginAsStudent() usando cy.session
  - Crear comando logout()
  - _Requirements: 10.1_

- [x] 4.2 Implementar comandos de navegación
  - Crear comando navigateToCourses()
  - Crear comando navigateToStudentEvaluation()
  - Crear comando navigateToStudentManagement()
  - Crear comando navigateToAvailableCourses()
  - _Requirements: 10.4_

- [x] 4.3 Implementar comandos de creación de datos
  - Crear comando createCourse(courseData) que retorna courseId
  - Crear comando createTopic(courseId, topicData) que retorna topicId
  - Crear comando createText(topicId, textData) que retorna textId
  - Crear comando createQuestion(textId, questionData) que retorna questionId
  - Crear comando enrollStudent(courseId)
  - _Requirements: 10.2, 10.3_

- [x] 4.4 Implementar comandos de validación
  - Crear comando verifyBiasAnalysis(expectedBiases)
  - Crear comando verifyCourseInList(courseName)
  - Crear comando verifyFeedbackGenerated()
  - Crear comando verifyEnrollmentSuccess()
  - _Requirements: 10.4_

- [x] 4.5 Implementar comandos de limpieza
  - Crear comando cleanupTestData() que elimina datos creados en tests
  - Implementar lógica para identificar y eliminar recursos de prueba
  - Agregar manejo de errores en cleanup
  - _Requirements: 10.5_

- [x] 5. Implementar tests de autenticación
  - Crear cypress/e2e/auth/login.cy.ts
  - Crear cypress/e2e/auth/register.cy.ts
  - Crear cypress/e2e/auth/logout.cy.ts
  - Implementar test de login exitoso
  - Implementar test de login con credenciales inválidas
  - Implementar test de registro de nuevo usuario
  - Implementar test de logout
  - Implementar test de protección de rutas
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5.1 Crear test de login exitoso
  - Visitar página de login
  - Ingresar credenciales válidas de docente
  - Hacer click en botón de login
  - Verificar redirección a /app
  - Verificar que token se guarde en localStorage
  - _Requirements: 3.1_

- [x] 5.2 Crear test de login con credenciales inválidas
  - Visitar página de login
  - Ingresar credenciales incorrectas
  - Hacer click en botón de login
  - Verificar que se muestre mensaje de error
  - Verificar que no se redirija
  - _Requirements: 3.2_

- [x] 5.3 Crear test de registro
  - Visitar página de registro
  - Completar formulario con datos válidos
  - Hacer click en botón de registro
  - Verificar que cuenta se cree exitosamente
  - Verificar redirección a dashboard
  - _Requirements: 3.3_

- [x] 5.4 Crear test de logout
  - Login como usuario
  - Hacer click en botón de logout
  - Verificar redirección a /login
  - Verificar que token se elimine de localStorage
  - _Requirements: 3.4_

- [x] 5.5 Crear test de protección de rutas
  - Intentar acceder a /app sin autenticación
  - Verificar redirección a /login
  - Intentar acceder a /app/courses sin autenticación
  - Verificar redirección a /login
  - _Requirements: 3.5_


- [x] 6. Implementar tests de flujo de docente
  - Crear cypress/e2e/teacher/course-management.cy.ts
  - Crear cypress/e2e/teacher/text-generation.cy.ts
  - Crear cypress/e2e/teacher/question-creation.cy.ts
  - Crear cypress/e2e/teacher/student-management.cy.ts
  - Implementar tests de gestión de cursos
  - Implementar tests de generación de textos con IA
  - Implementar tests de creación de preguntas
  - Implementar tests de visualización de estudiantes
  - Implementar tests de generación de feedback
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6.1 Implementar tests de gestión de cursos
  - Test: crear curso nuevo con título y descripción
  - Test: editar curso existente
  - Test: eliminar curso
  - Test: visualizar lista de cursos del docente
  - Test: ver detalles de un curso específico
  - _Requirements: 4.1_

- [x] 6.2 Implementar tests de generación de textos
  - Test: generar texto con IA usando prompt
  - Test: verificar detección de sesgos en texto generado
  - Test: visualizar palabras problemáticas
  - Test: regenerar texto con corrección de sesgos
  - Test: guardar texto aprobado en curso
  - _Requirements: 4.2_

- [x] 6.3 Implementar tests de creación de preguntas
  - Test: crear pregunta tipo literal
  - Test: crear pregunta tipo inferencial
  - Test: crear pregunta tipo crítica
  - Test: editar pregunta existente
  - Test: eliminar pregunta
  - _Requirements: 4.3_

- [x] 6.4 Implementar tests de visualización de estudiantes
  - Test: ver lista de estudiantes inscritos en curso
  - Test: ver progreso de estudiante específico
  - Test: filtrar estudiantes por curso
  - Test: ver respuestas de estudiante
  - _Requirements: 4.4, 8.1, 8.2, 8.3, 8.4_

- [x] 6.5 Implementar tests de generación de feedback
  - Test: generar feedback con IA para respuesta de estudiante
  - Test: verificar que feedback se muestre al estudiante
  - Test: generar feedback para múltiples respuestas
  - _Requirements: 4.5, 8.5_

- [x] 7. Implementar tests de flujo de estudiante
  - Crear cypress/e2e/student/course-enrollment.cy.ts
  - Crear cypress/e2e/student/text-reading.cy.ts
  - Crear cypress/e2e/student/question-answering.cy.ts
  - Crear cypress/e2e/student/bias-analysis.cy.ts
  - Implementar tests de inscripción en cursos
  - Implementar tests de lectura de textos
  - Implementar tests de respuesta a preguntas
  - Implementar tests de análisis de sesgos en respuestas
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 7.1 Implementar tests de inscripción
  - Test: visualizar cursos disponibles
  - Test: inscribirse en curso
  - Test: verificar que curso aparezca en "Mis Cursos"
  - Test: ver contenido del curso inscrito
  - _Requirements: 5.1, 5.2_

- [x] 7.2 Implementar tests de lectura de textos
  - Test: seleccionar curso inscrito
  - Test: ver lista de textos del curso
  - Test: abrir y leer texto completo
  - Test: verificar que contenido se muestre correctamente
  - _Requirements: 5.3_

- [x] 7.3 Implementar tests de respuesta a preguntas
  - Test: ver preguntas asociadas a un texto
  - Test: responder pregunta literal
  - Test: responder pregunta inferencial
  - Test: responder pregunta crítica
  - Test: verificar que respuesta se guarde
  - _Requirements: 5.4_

- [x] 7.4 Implementar tests de análisis de sesgos
  - Test: hacer click en botón "Analizar Sesgos"
  - Test: verificar que modal de análisis se abra
  - Test: verificar que se muestre puntuación (0-12)
  - Test: verificar que se muestre nivel (excelente/bueno/etc)
  - Test: verificar que se muestren sesgos detectados con tarjetas
  - Test: verificar que se muestren sugerencias de mejora
  - Test: verificar que se muestren recomendaciones académicas
  - _Requirements: 5.5_


- [x] 8. Implementar tests de sistema de detección de sesgos
  - Crear cypress/e2e/bias-detection/text-bias-detection.cy.ts
  - Crear cypress/e2e/bias-detection/answer-bias-detection.cy.ts
  - Implementar tests de detección de sesgos lingüísticos
  - Implementar tests de detección de sesgos cognitivos
  - Implementar tests de cálculo de puntuación
  - Implementar tests de generación de sugerencias
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 8.1 Implementar tests de sesgos lingüísticos
  - Test: detectar cuantificadores universales (S-UNIV)
  - Test: detectar polarización (S-POLAR)
  - Test: detectar generalización (S-GEN)
  - Test: detectar causalidad simple (S-CAUSA)
  - Test: detectar autoridad implícita (S-AUT)
  - Test: detectar lenguaje emocional (S-EMO)
  - Test: detectar confirmación (S-CONFIRMA)
  - Test: detectar efecto halo (S-ESTRELLA)
  - _Requirements: 6.1_

- [x] 8.2 Implementar tests de sesgos cognitivos
  - Test: detectar generalización excesiva en respuesta
  - Test: detectar polarización en respuesta
  - Test: detectar causalidad simplificada en respuesta
  - Test: detectar lectura parcial en respuesta
  - Test: detectar inferencia débil en respuesta
  - Test: detectar crítica superficial en respuesta
  - Test: detectar aplicación limitada en respuesta
  - Test: detectar desalineación de respuesta
  - _Requirements: 6.2_

- [x] 8.3 Implementar tests de cálculo de puntuación
  - Test: verificar puntuación 12/12 para respuesta sin sesgos
  - Test: verificar puntuación correcta con 1-2 sesgos
  - Test: verificar puntuación correcta con 3+ sesgos
  - Test: verificar nivel "excelente" para puntuación 12
  - Test: verificar nivel "necesita_mejora" para puntuación baja
  - _Requirements: 6.2, 6.3_

- [x] 8.4 Implementar tests de sugerencias
  - Test: verificar que cada sesgo tenga sugerencia específica
  - Test: verificar que sugerencias incluyan contexto
  - Test: verificar que sugerencias incluyan alternativas
  - _Requirements: 6.3, 6.5_

- [x] 9. Implementar tests de chatbot tutor
  - Crear cypress/e2e/student/chatbot.cy.ts
  - Implementar test de apertura de chatbot
  - Implementar test de envío de mensaje
  - Implementar test de recepción de respuesta contextual
  - Implementar test de persistencia de historial
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 9.1 Implementar test de apertura de chatbot
  - Login como estudiante
  - Navegar a página de evaluación
  - Hacer click en botón flotante de chatbot
  - Verificar que ventana de chatbot se abra
  - _Requirements: 7.1_

- [x] 9.2 Implementar test de envío de mensaje
  - Abrir chatbot
  - Escribir mensaje en input
  - Hacer click en botón enviar
  - Verificar que mensaje aparezca en historial
  - _Requirements: 7.2_

- [x] 9.3 Implementar test de respuesta contextual
  - Enviar pregunta sobre el texto actual
  - Esperar respuesta del chatbot (timeout 15s)
  - Verificar que respuesta esté relacionada con el texto
  - Verificar que respuesta no dé respuesta directa
  - _Requirements: 7.3, 7.4_

- [x] 9.4 Implementar test de persistencia de historial
  - Enviar varios mensajes al chatbot
  - Cerrar ventana de chatbot
  - Reabrir chatbot
  - Verificar que historial de conversación persista
  - _Requirements: 7.5_

- [x] 10. Implementar tests de validación de datos
  - Crear cypress/e2e/validation/form-validation.cy.ts
  - Implementar tests de validación de formularios
  - Implementar tests de manejo de errores
  - Implementar tests de permisos
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 10.1 Implementar tests de validación de formularios
  - Test: intentar crear curso sin título
  - Test: intentar crear curso sin descripción
  - Test: verificar mensajes de validación apropiados
  - Test: intentar enviar respuesta vacía
  - _Requirements: 9.1, 9.2_

- [x] 10.2 Implementar tests de manejo de errores
  - Test: intentar acceder a recurso inexistente (404)
  - Test: verificar mensaje de error apropiado
  - Test: simular error de API y verificar mensaje al usuario
  - _Requirements: 9.3, 9.5_

- [x] 10.3 Implementar tests de permisos
  - Test: estudiante intenta acceder a gestión de cursos
  - Test: verificar que sistema deniegue acceso
  - Test: estudiante intenta crear curso
  - Test: verificar que operación sea rechazada
  - _Requirements: 9.4_


- [x] 11. Configurar reportes y captura de evidencia
  - Configurar mochawesome reporter en cypress.config.ts
  - Configurar captura automática de screenshots en fallos
  - Configurar grabación de videos
  - Crear script para generar reporte HTML consolidado
  - Configurar organización de artefactos por fecha
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 11.1 Configurar mochawesome reporter
  - Agregar configuración de reporter en cypress.config.ts
  - Configurar reportDir, overwrite, html, json
  - Configurar charts y embeddedScreenshots
  - Configurar reportPageTitle personalizado
  - _Requirements: 12.1, 12.4_

- [x] 11.2 Configurar captura de screenshots
  - Habilitar screenshotOnRunFailure en config
  - Configurar carpeta de screenshots
  - Configurar formato y calidad de screenshots
  - _Requirements: 12.2_

- [x] 11.3 Configurar grabación de videos
  - Configurar video: true para CI, false para desarrollo
  - Configurar carpeta de videos
  - Configurar compresión de videos
  - _Requirements: 12.3_

- [x] 11.4 Crear script de reporte consolidado
  - Crear script para mergear reportes JSON de mochawesome
  - Crear script para generar HTML final
  - Agregar scripts a package.json
  - _Requirements: 12.1, 12.4_

- [x] 11.5 Configurar organización de artefactos
  - Crear estructura de carpetas por fecha de ejecución
  - Implementar limpieza automática de artefactos antiguos
  - Documentar ubicación de reportes en README
  - _Requirements: 12.5_

- [x] 12. Agregar atributos data-cy al frontend
  - Identificar componentes críticos que necesitan selectores
  - Agregar data-cy a formularios de autenticación
  - Agregar data-cy a componentes de cursos
  - Agregar data-cy a componentes de textos
  - Agregar data-cy a componentes de preguntas
  - Agregar data-cy a componentes de análisis de sesgos
  - Agregar data-cy a componentes de chatbot
  - Agregar data-cy a componentes de gestión de estudiantes
  - _Requirements: 2.4_

- [x] 12.1 Agregar data-cy a autenticación
  - Agregar data-cy="email-input" a input de email
  - Agregar data-cy="password-input" a input de password
  - Agregar data-cy="login-button" a botón de login
  - Agregar data-cy="register-button" a botón de registro
  - Agregar data-cy="logout-button" a botón de logout
  - Agregar data-cy="error-message" a mensajes de error
  - _Requirements: 2.4_

- [x] 12.2 Agregar data-cy a cursos
  - Agregar data-cy="create-course-button" a botón crear curso
  - Agregar data-cy="course-card" a tarjetas de curso
  - Agregar data-cy="course-title" a títulos de curso
  - Agregar data-cy="enroll-button" a botón de inscripción
  - Agregar data-cy="course-list" a lista de cursos
  - _Requirements: 2.4_

- [x] 12.3 Agregar data-cy a textos y preguntas
  - Agregar data-cy="generate-text-button" a botón generar texto
  - Agregar data-cy="text-content" a contenido de texto
  - Agregar data-cy="bias-indicator" a indicador de sesgos
  - Agregar data-cy="create-question-button" a botón crear pregunta
  - Agregar data-cy="answer-input" a input de respuesta
  - Agregar data-cy="submit-answer-button" a botón enviar respuesta
  - _Requirements: 2.4_

- [x] 12.4 Agregar data-cy a análisis de sesgos
  - Agregar data-cy="analyze-bias-button" a botón analizar sesgos
  - Agregar data-cy="bias-modal" a modal de análisis
  - Agregar data-cy="bias-score" a puntuación
  - Agregar data-cy="bias-level" a nivel
  - Agregar data-cy="bias-card" a tarjetas de sesgo
  - Agregar data-cy="recommendations" a recomendaciones
  - _Requirements: 2.4_

- [x] 12.5 Agregar data-cy a chatbot
  - Agregar data-cy="chatbot-open-button" a botón abrir chatbot
  - Agregar data-cy="chatbot-window" a ventana de chatbot
  - Agregar data-cy="chatbot-message-input" a input de mensaje
  - Agregar data-cy="chatbot-send-button" a botón enviar
  - Agregar data-cy="chatbot-messages" a lista de mensajes
  - _Requirements: 2.4_

- [ ] 13. Documentación y scripts
  - Crear README.md para Cypress con instrucciones de uso
  - Documentar estructura de tests
  - Documentar comandos personalizados
  - Documentar fixtures disponibles
  - Agregar scripts npm para ejecutar tests
  - Documentar configuración de variables de entorno
  - _Requirements: 1.4, 2.1, 2.2, 2.3_

- [ ] 13.1 Crear README de Cypress
  - Documentar cómo instalar dependencias
  - Documentar cómo configurar variables de entorno
  - Documentar cómo ejecutar tests localmente
  - Documentar cómo ejecutar tests en modo headless
  - Documentar cómo ver reportes
  - _Requirements: 2.1_

- [ ] 13.2 Documentar comandos personalizados
  - Listar todos los comandos disponibles
  - Documentar parámetros de cada comando
  - Incluir ejemplos de uso
  - _Requirements: 2.2_

- [ ] 13.3 Agregar scripts npm
  - Agregar script "cypress:open" para modo interactivo
  - Agregar script "cypress:run" para modo headless
  - Agregar script "cypress:report" para generar reportes
  - Agregar script "cypress:clean" para limpiar artefactos
  - _Requirements: 2.3_

- [ ] 14. Configuración de CI/CD (opcional)
  - Crear workflow de GitHub Actions para Cypress
  - Configurar ejecución automática en push/PR
  - Configurar upload de artefactos (screenshots, videos)
  - Configurar notificaciones de resultados
  - _Requirements: 12.1, 12.2, 12.3_
