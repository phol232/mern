# Documentación API Backend - Sistema Crítico

## Información General

**Base URL:** `http://localhost:4000/api`

**Autenticación:** La mayoría de endpoints requieren autenticación mediante Bearer Token en el header:
```
Authorization: Bearer <token>
```

**Roles de Usuario:**
- `student`: Estudiante
- `teacher`: Profesor
- `admin`: Administrador

---

## 1. AUTENTICACIÓN (`/auth`)

### 1.1 Registro de Usuario
**Endpoint:** `POST /api/auth/register`

**Descripción:** Registra un nuevo usuario en el sistema.

**Body (JSON):**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "firstName": "Nombre",
  "lastName": "Apellido",
  "role": "student",
  "courseIds": ["courseId1", "courseId2"]
}
```

**Validaciones:**
- `email`: Debe ser un email válido
- `password`: Mínimo 8 caracteres
- `firstName`: Requerido
- `lastName`: Requerido
- `role`: Opcional, valores: `student`, `teacher`, `admin`

**Respuesta Exitosa (201):**
```json
{
  "user": {
    "_id": "userId",
    "email": "usuario@ejemplo.com",
    "firstName": "Nombre",
    "lastName": "Apellido",
    "role": "student",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_aqui"
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "estudiante@test.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "student"
}
```

### 1.2 Inicio de Sesión
**Endpoint:** `POST /api/auth/login`

**Body (JSON):**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "user": {
    "_id": "userId",
    "email": "usuario@ejemplo.com",
    "firstName": "Nombre",
    "lastName": "Apellido",
    "role": "student"
  },
  "token": "jwt_token_aqui"
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "estudiante@test.com",
  "password": "password123"
}
```

### 1.3 Recuperar Contraseña
**Endpoint:** `POST /api/auth/forgot-password`

**Body (JSON):**
```json
{
  "email": "usuario@ejemplo.com"
}
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Instrucciones enviadas",
  "token": "recovery_token"
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "estudiante@test.com"
}
```

---

## 2. CURSOS (`/courses`)

### 2.1 Obtener Cursos Disponibles (Estudiantes)
**Endpoint:** `GET /api/courses/available`
**Autenticación:** Requerida (role: `student`)

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": "courseId",
    "title": "Taller de Proyectos 2",
    "description": "Descripción del curso",
    "level": "Intermedio",
    "progress": 75,
    "dueSoon": false
  }
]
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/courses/available
Authorization: Bearer <token>
```

### 2.2 Obtener Cursos Inscritos (Estudiantes)
**Endpoint:** `GET /api/courses/enrolled`
**Autenticación:** Requerida (role: `student`)

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": "courseId",
    "title": "Curso Inscrito",
    "description": "Descripción del curso",
    "enrolledAt": "2024-01-01T00:00:00.000Z",
    "progress": 60,
    "lastAccess": "2024-01-15T10:30:00.000Z"
  }
]
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/courses/enrolled
Authorization: Bearer <token>
```

### 2.3 Obtener Mis Cursos
**Endpoint:** `GET /api/courses/mine`
**Autenticación:** Requerida

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": "courseId",
    "title": "Mi Curso",
    "description": "Descripción",
    "createdBy": "userId",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/courses/mine
Authorization: Bearer <token>
```

### 2.4 Obtener Curso por ID
**Endpoint:** `GET /api/courses/:courseId`
**Autenticación:** Requerida

**Parámetros:**
- `courseId`: ID del curso

**Ejemplo Postman:**
```
GET http://localhost:5000/api/courses/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
```

### 2.5 Crear Curso
**Endpoint:** `POST /api/courses`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Body (JSON):**
```json
{
  "title": "Nuevo Curso",
  "description": "Descripción del curso",
  "reminders": [
    {
      "dueDate": "2024-12-31T23:59:59.000Z",
      "type": "due_soon"
    }
  ]
}
```

**Respuesta Exitosa (201):**
```json
{
  "_id": "courseId",
  "title": "Nuevo Curso",
  "description": "Descripción del curso",
  "createdBy": "userId",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Taller de Escritura Crítica",
  "description": "Curso para desarrollar habilidades de pensamiento crítico"
}
```

### 2.6 Actualizar Curso
**Endpoint:** `PATCH /api/courses/:courseId`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Body (JSON):**
```json
{
  "title": "Título Actualizado",
  "description": "Nueva descripción"
}
```

**Respuesta Exitosa (200):**
```json
{
  "_id": "courseId",
  "title": "Título Actualizado",
  "description": "Nueva descripción",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Ejemplo Postman:**
```
PATCH http://localhost:5000/api/courses/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Curso Actualizado",
  "description": "Descripción modificada"
}
```

### 2.7 Eliminar Curso
**Endpoint:** `DELETE /api/courses/:courseId`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Respuesta Exitosa (200):**
```json
{
  "message": "Curso eliminado exitosamente"
}
```

**Ejemplo Postman:**
```
DELETE http://localhost:5000/api/courses/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
```

### 2.8 Obtener Estudiantes del Curso
**Endpoint:** `GET /api/courses/:courseId/students`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": "studentId",
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@test.com",
    "enrolledAt": "2024-01-01T00:00:00.000Z",
    "progress": 75
  }
]
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/courses/64a1b2c3d4e5f6789012345/students
Authorization: Bearer <token>
```

### 2.9 Obtener Progreso de Estudiante en Textos
**Endpoint:** `GET /api/courses/:courseId/student/:studentId/texts-progress`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Respuesta Exitosa (200):**
```json
{
  "studentId": "64a1b2c3d4e5f6789012345",
  "courseId": "64a1b2c3d4e5f6789012346",
  "textsProgress": [
    {
      "textId": "64a1b2c3d4e5f6789012347",
      "title": "Texto 1",
      "completed": true,
      "score": 85,
      "completedAt": "2024-01-10T15:30:00.000Z"
    }
  ]
}
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/courses/64a1b2c3d4e5f6789012345/student/64a1b2c3d4e5f6789012346/texts-progress
Authorization: Bearer <token>
```

---

## 3. TEMAS (`/topics`)

### 3.1 Obtener Temas por Curso
**Endpoint:** `GET /api/topics/course/:courseId`
**Autenticación:** Requerida

**Parámetros:**
- `courseId`: ID del curso

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": "topicId",
    "title": "Introducción al Pensamiento Crítico",
    "description": "Descripción del tema",
    "course": "courseId",
    "order": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/topics/course/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
```

### 3.2 Crear Tema
**Endpoint:** `POST /api/topics/course/:courseId`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Body (JSON):**
```json
{
  "title": "Nuevo Tema",
  "description": "Descripción del tema",
  "order": 1
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/topics/course/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Análisis de Argumentos",
  "description": "Aprende a identificar y evaluar argumentos",
  "order": 2
}
```

### 3.3 Actualizar Tema
**Endpoint:** `PATCH /api/topics/:topicId`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Body (JSON):**
```json
{
  "title": "Tema Actualizado",
  "description": "Nueva descripción",
  "order": 3
}
```

**Respuesta Exitosa (200):**
```json
{
  "_id": "topicId",
  "title": "Tema Actualizado",
  "description": "Nueva descripción",
  "order": 3,
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Ejemplo Postman:**
```
PATCH http://localhost:5000/api/topics/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Pensamiento Crítico Avanzado",
  "description": "Descripción actualizada del tema"
}
```

### 3.4 Eliminar Tema
**Endpoint:** `DELETE /api/topics/:topicId`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Respuesta Exitosa (200):**
```json
{
  "message": "Tema eliminado exitosamente"
}
```

**Ejemplo Postman:**
```
DELETE http://localhost:5000/api/topics/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
```

---

## 4. TEXTOS (`/texts`)

### 4.1 Obtener Textos por Tema
**Endpoint:** `GET /api/texts/topic/:topicId`
**Autenticación:** Requerida

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": "textId",
    "title": "Texto de Ejemplo",
    "content": "Contenido del texto...",
    "topic": "topicId",
    "difficulty": "intermediate",
    "estimatedReadingTime": 10
  }
]
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/texts/topic/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
```

### 4.2 Obtener Recomendaciones de Textos
**Endpoint:** `GET /api/texts/topic/:topicId/recommendations`
**Autenticación:** Requerida

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": "textId",
    "title": "Texto Recomendado",
    "difficulty": "beginner",
    "estimatedReadingTime": 8,
    "recommendationScore": 0.95
  }
]
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/texts/topic/64a1b2c3d4e5f6789012345/recommendations
Authorization: Bearer <token>
```

### 4.3 Obtener Estado del Lector
**Endpoint:** `GET /api/texts/:textId/reader`
**Autenticación:** Requerida

**Respuesta Exitosa (200):**
```json
{
  "textId": "64a1b2c3d4e5f6789012345",
  "userId": "64a1b2c3d4e5f6789012346",
  "progress": 75,
  "lastPosition": 1250,
  "timeSpent": 480,
  "completed": false
}
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/texts/64a1b2c3d4e5f6789012345/reader
Authorization: Bearer <token>
```

### 4.4 Vista Previa de Texto con IA
**Endpoint:** `POST /api/texts/preview/:topicId`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Body (JSON):**
```json
{
  "prompt": "Genera un texto sobre pensamiento crítico",
  "difficulty": "intermediate",
  "length": "medium"
}
```

**Respuesta Exitosa (200):**
```json
{
  "title": "Pensamiento Crítico: Fundamentos",
  "content": "El pensamiento crítico es una habilidad fundamental...",
  "difficulty": "intermediate",
  "estimatedReadingTime": 12
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/texts/preview/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Genera un texto sobre análisis de argumentos",
  "difficulty": "beginner",
  "length": "short"
}
```

### 4.5 Guardar Texto Aprobado
**Endpoint:** `POST /api/texts/save/:topicId`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Body (JSON):**
```json
{
  "title": "Texto Aprobado",
  "content": "Contenido del texto generado...",
  "difficulty": "intermediate",
  "estimatedReadingTime": 12
}
```

**Respuesta Exitosa (201):**
```json
{
  "_id": "newTextId",
  "title": "Texto Aprobado",
  "content": "Contenido del texto generado...",
  "topic": "topicId",
  "difficulty": "intermediate",
  "estimatedReadingTime": 12,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/texts/save/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Análisis de Argumentos",
  "content": "Un argumento es una serie de afirmaciones...",
  "difficulty": "beginner",
  "estimatedReadingTime": 8
}
```

### 4.6 Crear Texto
**Endpoint:** `POST /api/texts`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Body (JSON):**
```json
{
  "title": "Nuevo Texto",
  "content": "Contenido del texto...",
  "topic": "topicId",
  "difficulty": "intermediate",
  "estimatedReadingTime": 15
}
```

**Respuesta Exitosa (201):**
```json
{
  "_id": "newTextId",
  "title": "Nuevo Texto",
  "content": "Contenido del texto...",
  "topic": "topicId",
  "difficulty": "intermediate",
  "estimatedReadingTime": 15,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/texts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Falacias Lógicas",
  "content": "Las falacias lógicas son errores en el razonamiento...",
  "topic": "64a1b2c3d4e5f6789012345",
  "difficulty": "advanced",
  "estimatedReadingTime": 20
}
```

### 4.7 Actualizar Texto
**Endpoint:** `PATCH /api/texts/:textId`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Body (JSON):**
```json
{
  "title": "Título Actualizado",
  "content": "Contenido actualizado...",
  "difficulty": "advanced"
}
```

**Respuesta Exitosa (200):**
```json
{
  "_id": "textId",
  "title": "Título Actualizado",
  "content": "Contenido actualizado...",
  "difficulty": "advanced",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Ejemplo Postman:**
```
PATCH http://localhost:5000/api/texts/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Pensamiento Crítico Avanzado",
  "content": "Contenido mejorado del texto..."
}
```

### 4.8 Eliminar Texto
**Endpoint:** `DELETE /api/texts/:textId`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Respuesta Exitosa (200):**
```json
{
  "message": "Texto eliminado exitosamente"
}
```

**Ejemplo Postman:**
```
DELETE http://localhost:5000/api/texts/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
```

### 4.9 Regenerar Texto
**Endpoint:** `POST /api/texts/:textId/regenerate`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Body (JSON):**
```json
{
  "prompt": "Regenera este texto con mayor profundidad",
  "difficulty": "advanced"
}
```

**Respuesta Exitosa (200):**
```json
{
  "_id": "textId",
  "title": "Texto Regenerado",
  "content": "Nuevo contenido generado...",
  "difficulty": "advanced",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/texts/64a1b2c3d4e5f6789012345/regenerate
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Mejora este texto añadiendo más ejemplos",
  "difficulty": "intermediate"
}
```

---

## 5. PREGUNTAS (`/questions`)

### 5.1 Obtener Preguntas por Texto
**Endpoint:** `GET /api/questions/text/:textId`
**Autenticación:** Requerida

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": "questionId",
    "text": "¿Cuál es la idea principal del texto?",
    "type": "open",
    "textId": "textId",
    "order": 1
  }
]
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/questions/text/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
```

### 5.2 Enviar Respuestas
**Endpoint:** `POST /api/questions/text/:textId/submit`
**Autenticación:** Requerida

**Body (JSON):**
```json
{
  "answers": [
    {
      "questionId": "questionId",
      "answer": "Mi respuesta aquí..."
    }
  ]
}
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Respuestas enviadas exitosamente",
  "submissionId": "64a1b2c3d4e5f6789012345",
  "score": 85,
  "feedback": "Excelente análisis del texto"
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/questions/text/64a1b2c3d4e5f6789012345/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": [
    {
      "questionId": "64a1b2c3d4e5f6789012346",
      "answer": "La idea principal del texto es explicar los fundamentos del pensamiento crítico y su importancia en la toma de decisiones."
    }
  ]
}
```

### 5.3 Vista Previa de Preguntas con IA
**Endpoint:** `POST /api/questions/preview/:textId`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Body (JSON):**
```json
{
  "prompt": "Genera preguntas de comprensión para este texto",
  "questionCount": 3,
  "difficulty": "intermediate"
}
```

**Respuesta Exitosa (200):**
```json
{
  "questions": [
    {
      "text": "¿Cuál es la idea principal del texto?",
      "type": "open",
      "order": 1
    }
  ]
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/questions/preview/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Genera preguntas de análisis crítico",
  "questionCount": 5,
  "difficulty": "advanced"
}
```

### 5.4 Guardar Preguntas Aprobadas
**Endpoint:** `POST /api/questions/save/:textId`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Body (JSON):**
```json
{
  "questions": [
    {
      "text": "¿Cuál es la idea principal del texto?",
      "type": "open",
      "order": 1
    }
  ]
}
```

**Respuesta Exitosa (201):**
```json
{
  "message": "Preguntas guardadas exitosamente",
  "questions": [
    {
      "_id": "questionId",
      "text": "¿Cuál es la idea principal del texto?",
      "type": "open",
      "textId": "textId",
      "order": 1
    }
  ]
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/questions/save/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
Content-Type: application/json

{
  "questions": [
    {
      "text": "Analiza los argumentos presentados en el texto",
      "type": "open",
      "order": 1
    }
  ]
}
```

### 5.5 Crear Pregunta
**Endpoint:** `POST /api/questions`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Body (JSON):**
```json
{
  "text": "Nueva pregunta",
  "type": "open",
  "textId": "textId",
  "order": 1
}
```

**Respuesta Exitosa (201):**
```json
{
  "_id": "questionId",
  "text": "Nueva pregunta",
  "type": "open",
  "textId": "textId",
  "order": 1,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "¿Qué falacias lógicas puedes identificar en el texto?",
  "type": "open",
  "textId": "64a1b2c3d4e5f6789012345",
  "order": 2
}
```

### 5.6 Actualizar Pregunta
**Endpoint:** `PATCH /api/questions/:questionId`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Body (JSON):**
```json
{
  "text": "Pregunta actualizada",
  "order": 2
}
```

**Respuesta Exitosa (200):**
```json
{
  "_id": "questionId",
  "text": "Pregunta actualizada",
  "order": 2,
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Ejemplo Postman:**
```
PATCH http://localhost:5000/api/questions/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "¿Cuáles son las fortalezas y debilidades de los argumentos presentados?"
}
```

### 5.7 Eliminar Pregunta
**Endpoint:** `DELETE /api/questions/:questionId`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Respuesta Exitosa (200):**
```json
{
  "message": "Pregunta eliminada exitosamente"
}
```

**Ejemplo Postman:**
```
DELETE http://localhost:5000/api/questions/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
```

### 5.8 Eliminar Todas las Preguntas de un Texto
**Endpoint:** `DELETE /api/questions/text/:textId`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Respuesta Exitosa (200):**
```json
{
  "message": "Todas las preguntas del texto eliminadas exitosamente",
  "deletedCount": 5
}
```

**Ejemplo Postman:**
```
DELETE http://localhost:5000/api/questions/text/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
```

### 5.9 Generar Retroalimentación Automática
**Endpoint:** `POST /api/questions/attempt/:attemptId/feedback`
**Autenticación:** Requerida

**Body (JSON):**
```json
{
  "generateFeedback": true,
  "includeScore": true
}
```

**Respuesta Exitosa (200):**
```json
{
  "feedback": "Excelente análisis del texto. Has identificado correctamente los puntos clave.",
  "score": 88,
  "suggestions": ["Considera profundizar en el análisis de las fuentes"]
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/questions/attempt/64a1b2c3d4e5f6789012345/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "generateFeedback": true,
  "includeScore": true
}
```

---

## 6. ANÁLISIS DE SESGOS (`/bias`)

### 6.1 Analizar Contenido Directo
**Endpoint:** `POST /api/bias/analyze-content`
**Autenticación:** Requerida

**Body (JSON):**
```json
{
  "content": "Texto a analizar para detectar sesgos...",
  "analysisType": "linguistic"
}
```

**Respuesta Exitosa (200):**
```json
{
  "biases": [
    {
      "type": "universal_quantifiers",
      "severity": "medium",
      "description": "Uso de cuantificadores universales",
      "suggestions": ["Evitar palabras como 'todos', 'siempre', 'nunca'"]
    }
  ],
  "score": 75,
  "summary": "El texto presenta algunos sesgos menores"
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/bias/analyze-content
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Todos los estudiantes siempre deben estudiar mucho para nunca fallar en los exámenes.",
  "analysisType": "linguistic"
}
```

### 6.2 Analizar Texto Guardado
**Endpoint:** `POST /api/bias/analyze-text/:textId`
**Autenticación:** Requerida

**Body (JSON):**
```json
{
  "analysisType": "comprehensive"
}
```

**Respuesta Exitosa (200):**
```json
{
  "textId": "64a1b2c3d4e5f6789012345",
  "biases": [
    {
      "type": "confirmation_bias",
      "severity": "high",
      "description": "Sesgo de confirmación detectado",
      "suggestions": ["Considerar perspectivas alternativas"]
    }
  ],
  "score": 65
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/bias/analyze-text/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
Content-Type: application/json

{
  "analysisType": "comprehensive"
}
```

### 6.3 Analizar Respuesta de Estudiante
**Endpoint:** `POST /api/bias/analyze-student-answer/:attemptId`
**Autenticación:** Requerida

**Body (JSON):**
```json
{
  "questionId": "64a1b2c3d4e5f6789012345",
  "answer": "Respuesta del estudiante a analizar"
}
```

**Respuesta Exitosa (200):**
```json
{
  "attemptId": "64a1b2c3d4e5f6789012345",
  "questionId": "64a1b2c3d4e5f6789012346",
  "biases": [
    {
      "type": "anchoring_bias",
      "severity": "medium",
      "description": "Sesgo de anclaje en la respuesta"
    }
  ],
  "score": 78
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/bias/analyze-student-answer/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionId": "64a1b2c3d4e5f6789012346",
  "answer": "Creo que la respuesta es obvia porque siempre he pensado así"
}
```

### 6.4 Guardar Análisis de Estudiante
**Endpoint:** `POST /api/bias/save-student-analysis/:attemptId`
**Autenticación:** Requerida

**Body (JSON):**
```json
{
  "biases": [
    {
      "type": "confirmation_bias",
      "severity": "medium",
      "description": "Análisis guardado"
    }
  ],
  "score": 80
}
```

**Respuesta Exitosa (201):**
```json
{
  "message": "Análisis guardado exitosamente",
  "analysisId": "64a1b2c3d4e5f6789012345"
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/bias/save-student-analysis/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
Content-Type: application/json

{
  "biases": [
    {
      "type": "availability_heuristic",
      "severity": "low",
      "description": "Uso de heurística de disponibilidad"
    }
  ],
  "score": 85
}
```

### 6.5 Analizar Intento (Método Legacy)
**Endpoint:** `POST /api/bias/analyze-attempt/:attemptId`
**Autenticación:** Requerida

**Respuesta Exitosa (200):**
```json
{
  "attemptId": "64a1b2c3d4e5f6789012345",
  "overallScore": 75,
  "biases": [
    {
      "questionId": "64a1b2c3d4e5f6789012346",
      "biases": ["confirmation_bias"],
      "score": 70
    }
  ]
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/bias/analyze-attempt/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
```

### 6.6 Obtener Sesgos Guardados
**Endpoint:** `GET /api/bias/:relatedTo/:relatedId`
**Autenticación:** Requerida

**Parámetros:**
- `relatedTo`: Tipo de entidad (`text`, `attempt`, etc.)
- `relatedId`: ID de la entidad

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": "biasId",
    "type": "confirmation_bias",
    "severity": "medium",
    "description": "Sesgo de confirmación detectado",
    "resolved": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/bias/text/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
```

### 6.7 Marcar Sesgo como Resuelto
**Endpoint:** `PATCH /api/bias/:biasId/resolve`
**Autenticación:** Requerida

**Body (JSON):**
```json
{
  "resolved": true,
  "resolution": "Sesgo corregido mediante revisión"
}
```

**Respuesta Exitosa (200):**
```json
{
  "_id": "biasId",
  "resolved": true,
  "resolution": "Sesgo corregido mediante revisión",
  "resolvedAt": "2024-01-15T10:30:00.000Z"
}
```

**Ejemplo Postman:**
```
PATCH http://localhost:5000/api/bias/64a1b2c3d4e5f6789012345/resolve
Authorization: Bearer <token>
Content-Type: application/json

{
  "resolved": true,
  "resolution": "Estudiante corrigió su perspectiva tras feedback"
}
```

### 6.8 Estadísticas de Sesgos del Curso
**Endpoint:** `GET /api/bias/course/:courseId/statistics`
**Autenticación:** Requerida

**Respuesta Exitosa (200):**
```json
{
  "courseId": "64a1b2c3d4e5f6789012345",
  "totalBiases": 45,
  "resolvedBiases": 32,
  "biasesByType": {
    "confirmation_bias": 15,
    "anchoring_bias": 12,
    "availability_heuristic": 8
  },
  "averageScore": 78
}
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/bias/course/64a1b2c3d4e5f6789012345/statistics
Authorization: Bearer <token>
```

### 6.9 Resumen de Tema
**Endpoint:** `GET /api/bias/topic/:topicId/summary`
**Autenticación:** Requerida

**Respuesta Exitosa (200):**
```json
{
  "topicId": "64a1b2c3d4e5f6789012345",
  "topicName": "Pensamiento Crítico",
  "totalTexts": 8,
  "textsWithBiases": 5,
  "commonBiases": ["confirmation_bias", "anchoring_bias"],
  "averageBiasScore": 72
}
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/bias/topic/64a1b2c3d4e5f6789012345/summary
Authorization: Bearer <token>
```

---

## 7. PROGRESO (`/progress`)

### 7.1 Obtener Progreso de Estudiante
**Endpoint:** `GET /api/progress/student/:studentId`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Respuesta Exitosa (200):**
```json
{
  "studentId": "studentId",
  "courses": [
    {
      "courseId": "courseId",
      "courseName": "Taller de Proyectos 2",
      "progress": 75,
      "completedTexts": 8,
      "totalTexts": 12
    }
  ]
}
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/progress/student/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
```

### 7.2 Obtener Métricas del Curso
**Endpoint:** `GET /api/progress/course/:courseId/metrics`
**Autenticación:** Requerida (role: `teacher` o `admin`)

**Respuesta Exitosa (200):**
```json
{
  "courseId": "64a1b2c3d4e5f6789012345",
  "courseName": "Taller de Proyectos 2",
  "totalStudents": 25,
  "activeStudents": 22,
  "averageProgress": 68,
  "completionRate": 45,
  "totalTexts": 12,
  "averageScore": 78
}
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/progress/course/64a1b2c3d4e5f6789012345/metrics
Authorization: Bearer <token>
```

---

## 8. ADMINISTRACIÓN (`/admin`)

### 8.1 Actualizar Rol de Usuario
**Endpoint:** `PATCH /api/admin/users/:userId/role`
**Autenticación:** Requerida (role: `admin`)

**Body (JSON):**
```json
{
  "role": "teacher"
}
```

**Respuesta Exitosa (200):**
```json
{
  "_id": "64a1b2c3d4e5f6789012345",
  "name": "Juan Pérez",
  "email": "juan.perez@example.com",
  "role": "teacher",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Ejemplo Postman:**
```
PATCH http://localhost:5000/api/admin/users/64a1b2c3d4e5f6789012345/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "teacher"
}
```

### 8.2 Listar Logs de Auditoría
**Endpoint:** `GET /api/admin/audit-logs`
**Autenticación:** Requerida (role: `admin`)

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012345",
    "action": "USER_ROLE_UPDATED",
    "userId": "64a1b2c3d4e5f6789012346",
    "adminId": "64a1b2c3d4e5f6789012347",
    "details": {
      "oldRole": "student",
      "newRole": "teacher"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
]
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/admin/audit-logs
Authorization: Bearer <token>
```

---

## 9. INSCRIPCIONES (`/enrollments`)

### 9.1 Inscribir Estudiante
**Endpoint:** `POST /api/enrollments`
**Autenticación:** Requerida

**Body (JSON):**
```json
{
  "studentId": "64a1b2c3d4e5f6789012345",
  "courseId": "64a1b2c3d4e5f6789012346"
}
```

**Respuesta Exitosa (201):**
```json
{
  "_id": "64a1b2c3d4e5f6789012347",
  "studentId": "64a1b2c3d4e5f6789012345",
  "courseId": "64a1b2c3d4e5f6789012346",
  "enrolledAt": "2024-01-15T10:30:00.000Z",
  "lastAccess": "2024-01-15T10:30:00.000Z"
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/enrollments
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "64a1b2c3d4e5f6789012345",
  "courseId": "64a1b2c3d4e5f6789012346"
}
```

### 9.2 Obtener Inscripciones de Estudiante
**Endpoint:** `GET /api/enrollments/student/:studentId`
**Autenticación:** Requerida

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012347",
    "courseId": "64a1b2c3d4e5f6789012346",
    "courseName": "Taller de Proyectos 2",
    "enrolledAt": "2024-01-15T10:30:00.000Z",
    "lastAccess": "2024-01-15T10:30:00.000Z"
  }
]
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/enrollments/student/64a1b2c3d4e5f6789012345
Authorization: Bearer <token>
```

### 9.3 Obtener Progreso de Estudiante
**Endpoint:** `GET /api/enrollments/student/:studentId/progress`
**Autenticación:** Requerida

**Respuesta Exitosa (200):**
```json
{
  "studentId": "64a1b2c3d4e5f6789012345",
  "totalCourses": 3,
  "completedCourses": 1,
  "inProgressCourses": 2,
  "overallProgress": 65,
  "courses": [
    {
      "courseId": "64a1b2c3d4e5f6789012346",
      "courseName": "Taller de Proyectos 2",
      "progress": 75,
      "completedTexts": 8,
      "totalTexts": 12
    }
  ]
}
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/enrollments/student/64a1b2c3d4e5f6789012345/progress
Authorization: Bearer <token>
```

### 9.4 Verificar Inscripción
**Endpoint:** `GET /api/enrollments/check/:studentId/:courseId`
**Autenticación:** Requerida

**Respuesta Exitosa (200):**
```json
{
  "enrolled": true,
  "enrollmentId": "64a1b2c3d4e5f6789012347",
  "enrolledAt": "2024-01-15T10:30:00.000Z"
}
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/enrollments/check/64a1b2c3d4e5f6789012345/64a1b2c3d4e5f6789012346
Authorization: Bearer <token>
```

### 9.5 Actualizar Último Acceso
**Endpoint:** `PUT /api/enrollments/:enrollmentId/access`
**Autenticación:** Requerida

**Respuesta Exitosa (200):**
```json
{
  "_id": "64a1b2c3d4e5f6789012347",
  "lastAccess": "2024-01-15T10:30:00.000Z"
}
```

**Ejemplo Postman:**
```
PUT http://localhost:5000/api/enrollments/64a1b2c3d4e5f6789012347/access
Authorization: Bearer <token>
```

### 9.6 Desinscribir Estudiante
**Endpoint:** `DELETE /api/enrollments/student/:studentId/course/:courseId`
**Autenticación:** Requerida

**Respuesta Exitosa (200):**
```json
{
  "message": "Estudiante desinscrito exitosamente"
}
```

**Ejemplo Postman:**
```
DELETE http://localhost:5000/api/enrollments/student/64a1b2c3d4e5f6789012345/course/64a1b2c3d4e5f6789012346
Authorization: Bearer <token>
```

---

## 10. INTENTOS (`/attempts`)

### 10.1 Guardar Intentos
**Endpoint:** `POST /api/attempts`
**Autenticación:** Requerida

**Body (JSON):**
```json
{
  "textId": "64a1b2c3d4e5f6789012345",
  "answers": [
    {
      "questionId": "64a1b2c3d4e5f6789012346",
      "answer": "Mi respuesta detallada sobre el tema..."
    }
  ]
}
```

**Respuesta Exitosa (201):**
```json
{
  "_id": "64a1b2c3d4e5f6789012347",
  "textId": "64a1b2c3d4e5f6789012345",
  "studentId": "64a1b2c3d4e5f6789012348",
  "answers": [
    {
      "questionId": "64a1b2c3d4e5f6789012346",
      "answer": "Mi respuesta detallada sobre el tema...",
      "score": 85
    }
  ],
  "submittedAt": "2024-01-15T10:30:00.000Z"
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/attempts
Authorization: Bearer <token>
Content-Type: application/json

{
  "textId": "64a1b2c3d4e5f6789012345",
  "answers": [
    {
      "questionId": "64a1b2c3d4e5f6789012346",
      "answer": "Mi respuesta detallada sobre el tema..."
    }
  ]
}
```

### 10.2 Enviar Intentos (Alias)
**Endpoint:** `POST /api/attempts/submit`
**Autenticación:** Requerida

**Body (JSON):**
```json
{
  "textId": "64a1b2c3d4e5f6789012345",
  "answers": [
    {
      "questionId": "64a1b2c3d4e5f6789012346",
      "answer": "Mi respuesta detallada sobre el tema..."
    }
  ]
}
```

**Respuesta Exitosa (201):**
```json
{
  "_id": "64a1b2c3d4e5f6789012347",
  "textId": "64a1b2c3d4e5f6789012345",
  "studentId": "64a1b2c3d4e5f6789012348",
  "answers": [
    {
      "questionId": "64a1b2c3d4e5f6789012346",
      "answer": "Mi respuesta detallada sobre el tema...",
      "score": 85
    }
  ],
  "submittedAt": "2024-01-15T10:30:00.000Z"
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/attempts/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "textId": "64a1b2c3d4e5f6789012345",
  "answers": [
    {
      "questionId": "64a1b2c3d4e5f6789012346",
      "answer": "Mi respuesta detallada sobre el tema..."
    }
  ]
}
```

### 10.3 Obtener Intentos de Estudiante
**Endpoint:** `GET /api/attempts/text/:textId/student/:studentId`
**Autenticación:** Requerida

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012347",
    "textId": "64a1b2c3d4e5f6789012345",
    "studentId": "64a1b2c3d4e5f6789012348",
    "answers": [
      {
        "questionId": "64a1b2c3d4e5f6789012346",
        "answer": "Mi respuesta detallada sobre el tema...",
        "score": 85
      }
    ],
    "submittedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/attempts/text/64a1b2c3d4e5f6789012345/student/64a1b2c3d4e5f6789012348
Authorization: Bearer <token>
```

### 10.4 Obtener Historial de Estudiante
**Endpoint:** `GET /api/attempts/student/:studentId`
**Autenticación:** Requerida

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": "64a1b2c3d4e5f6789012347",
    "textId": "64a1b2c3d4e5f6789012345",
    "textTitle": "Introducción al Pensamiento Crítico",
    "courseId": "64a1b2c3d4e5f6789012349",
    "courseName": "Taller de Proyectos 2",
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "averageScore": 85
  }
]
```

**Ejemplo Postman:**
```
GET http://localhost:5000/api/attempts/student/64a1b2c3d4e5f6789012348
Authorization: Bearer <token>
```

### 10.5 Actualizar Retroalimentación de Intento
**Endpoint:** `PUT /api/attempts/:attemptId/feedback`
**Autenticación:** Requerida

**Body (JSON):**
```json
{
  "feedback": "Excelente análisis del tema. Considera profundizar en los aspectos éticos.",
  "score": 90
}
```

**Respuesta Exitosa (200):**
```json
{
  "_id": "64a1b2c3d4e5f6789012347",
  "feedback": "Excelente análisis del tema. Considera profundizar en los aspectos éticos.",
  "score": 90,
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Ejemplo Postman:**
```
PUT http://localhost:5000/api/attempts/64a1b2c3d4e5f6789012347/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "feedback": "Excelente análisis del tema. Considera profundizar en los aspectos éticos.",
  "score": 90
}
```

---

## 11. CHATBOT (`/chatbot`)

### 11.1 Chat con Tutor
**Endpoint:** `POST /api/chatbot/tutor`
**Autenticación:** Requerida

**Body (JSON):**
```json
{
  "message": "¿Puedes ayudarme a entender este concepto?",
  "context": {
    "textId": "textId",
    "courseId": "courseId"
  }
}
```

**Respuesta Exitosa (200):**
```json
{
  "response": "Por supuesto, te ayudo a entender el concepto...",
  "suggestions": [
    "¿Quieres que profundice en algún aspecto específico?",
    "¿Te gustaría ver ejemplos prácticos?"
  ]
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/chatbot/tutor
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "¿Puedes ayudarme a entender este concepto?",
  "context": {
    "textId": "64a1b2c3d4e5f6789012345",
    "courseId": "64a1b2c3d4e5f6789012346"
  }
}
```

### 11.2 Chat con Tutor (Prueba)
**Endpoint:** `POST /api/chatbot/tutor-test`
**Autenticación:** Requerida

**Body (JSON):**
```json
{
  "message": "¿Cómo puedo mejorar mi pensamiento crítico?",
  "context": {
    "textId": "64a1b2c3d4e5f6789012345",
    "courseId": "64a1b2c3d4e5f6789012346"
  }
}
```

**Respuesta Exitosa (200):**
```json
{
  "response": "Para mejorar tu pensamiento crítico, te recomiendo...",
  "suggestions": [
    "¿Te gustaría practicar con ejercicios específicos?",
    "¿Quieres que analicemos un caso práctico?"
  ],
  "testMode": true
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/chatbot/tutor-test
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "¿Cómo puedo mejorar mi pensamiento crítico?",
  "context": {
    "textId": "64a1b2c3d4e5f6789012345",
    "courseId": "64a1b2c3d4e5f6789012346"
  }
}
```

### 11.3 Obtener Sugerencias Rápidas
**Endpoint:** `POST /api/chatbot/suggestions`
**Autenticación:** Requerida

**Body (JSON):**
```json
{
  "context": {
    "textId": "64a1b2c3d4e5f6789012345",
    "courseId": "64a1b2c3d4e5f6789012346",
    "currentTopic": "Sesgos Cognitivos"
  }
}
```

**Respuesta Exitosa (200):**
```json
{
  "suggestions": [
    "¿Qué tipos de sesgos cognitivos existen?",
    "¿Cómo puedo identificar sesgos en mi razonamiento?",
    "¿Cuáles son ejemplos prácticos de sesgos cognitivos?",
    "¿Cómo afectan los sesgos a la toma de decisiones?"
  ]
}
```

**Ejemplo Postman:**
```
POST http://localhost:5000/api/chatbot/suggestions
Authorization: Bearer <token>
Content-Type: application/json

{
  "context": {
    "textId": "64a1b2c3d4e5f6789012345",
    "courseId": "64a1b2c3d4e5f6789012346",
    "currentTopic": "Sesgos Cognitivos"
  }
}
```

---

## Códigos de Estado HTTP

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Solicitud incorrecta
- **401**: No autorizado (token inválido o faltante)
- **403**: Prohibido (permisos insuficientes)
- **404**: Recurso no encontrado
- **409**: Conflicto (ej: email ya registrado)
- **422**: Error de validación
- **500**: Error interno del servidor

## Ejemplos de Errores

### Error de Validación (422)
```json
{
  "message": "Error de validación",
  "errors": [
    {
      "field": "email",
      "message": "Correo inválido"
    }
  ]
}
```

### Error de Autenticación (401)
```json
{
  "message": "Token inválido o expirado"
}
```

### Error de Permisos (403)
```json
{
  "message": "No tienes permisos para realizar esta acción"
}
```

---

## Configuración de Postman

### Variables de Entorno
Crea las siguientes variables en Postman:

- `baseUrl`: `http://localhost:5000/api`
- `token`: `<tu_jwt_token_aqui>`

### Headers Globales
```
Content-Type: application/json
Authorization: Bearer {{token}}
```

### Flujo de Pruebas Recomendado

1. **Registro/Login**: Obtener token de autenticación
2. **Crear Curso**: Como teacher/admin
3. **Crear Tema**: Asociado al curso
4. **Crear Texto**: Asociado al tema
5. **Crear Preguntas**: Asociadas al texto
6. **Inscribir Estudiante**: Al curso
7. **Enviar Respuestas**: Como estudiante
8. **Analizar Sesgos**: En las respuestas
9. **Revisar Progreso**: Como teacher/admin

---

*Documentación generada para el Sistema Crítico - Backend API v1.0*