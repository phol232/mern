# 📚 DOCUMENTACIÓN COMPLETA DEL SISTEMA - CRÍTICO MERN

**Fecha de actualización:** 4 de octubre de 2025  
**Versión:** 2.0  
**Stack tecnológico:** MongoDB, Express, React, Node.js (MERN)

---

## 📋 ÍNDICE

1. [Descripción General del Sistema](#1-descripción-general-del-sistema)
2. [Roles y Permisos](#2-roles-y-permisos)
3. [Módulos del Sistema](#3-módulos-del-sistema)
4. [Sistema de Detección de Sesgos](#4-sistema-de-detección-de-sesgos)
5. [Integración con IA (CORA)](#5-integración-con-ia-cora)
6. [Flujos de Usuario](#6-flujos-de-usuario)
7. [API Endpoints](#7-api-endpoints)
8. [Modelos de Datos](#8-modelos-de-datos)
9. [Características Técnicas](#9-características-técnicas)

---

## 1. DESCRIPCIÓN GENERAL DEL SISTEMA

**CRÍTICO** es una plataforma educativa diseñada para desarrollar y evaluar el pensamiento crítico en estudiantes mediante:
- Generación de textos académicos con detección automática de sesgos
- Evaluación de comprensión lectora con múltiples niveles cognitivos
- Análisis de sesgos en respuestas de estudiantes
- Feedback automatizado con inteligencia artificial
- Chatbot tutor personalizado

### Objetivo Principal
Ayudar a estudiantes a identificar y evitar sesgos cognitivos en su razonamiento académico, mejorando su capacidad de análisis crítico.

---

## 2. ROLES Y PERMISOS

### 👨‍🏫 **DOCENTE (Teacher)**
**Capacidades:**
- ✅ Gestión completa de cursos (crear, editar, eliminar)
- ✅ Generación de textos académicos con detección de sesgos
- ✅ Creación y gestión de preguntas (literal, inferencial, crítica)
- ✅ Revisión de respuestas de estudiantes
- ✅ Generación de feedback con IA
- ✅ Visualización de estadísticas del curso
- ✅ Gestión de estudiantes matriculados
- ✅ Exportación de reportes

**Restricciones:**
- ❌ NO puede ver el análisis de sesgos de respuestas individuales de estudiantes
- ❌ Solo ve el feedback generado por IA, no los sesgos detectados

### 👨‍🎓 **ESTUDIANTE (Student)**
**Capacidades:**
- ✅ Visualización de cursos disponibles
- ✅ Inscripción en cursos
- ✅ Lectura de textos académicos
- ✅ Respuesta a preguntas de evaluación
- ✅ **NUEVO:** Análisis de sesgos en sus propias respuestas
- ✅ Recepción de feedback de IA
- ✅ Chatbot tutor personalizado
- ✅ Seguimiento de progreso personal

**Restricciones:**
- ❌ NO puede ver estadísticas de otros estudiantes
- ❌ NO puede crear ni modificar contenido del curso
- ❌ Solo ve análisis de sus propias respuestas

### 🔐 **ADMINISTRADOR (Admin)**
**Capacidades:**
- ✅ Todas las capacidades de Docente
- ✅ Gestión de usuarios (crear, editar, eliminar)
- ✅ Acceso a logs de auditoría
- ✅ Configuración global del sistema
- ✅ Estadísticas globales

---

## 3. MÓDULOS DEL SISTEMA

### 📖 **3.1 Gestión de Cursos**
**Ubicación:** `/cursos`

**Funcionalidades:**
- **Crear curso:** Título, descripción, nivel académico
- **Editar curso:** Modificar información y contenido
- **Eliminar curso:** Con confirmación de seguridad
- **Gestionar estudiantes:** Ver lista, agregar, eliminar
- **Estadísticas:** Progreso, tasas de finalización, promedios

**Flujo típico:**
1. Docente crea curso nuevo
2. Añade textos académicos
3. Crea preguntas asociadas
4. Estudiantes se inscriben
5. Docente monitorea progreso

---

### 📝 **3.2 Generación de Textos Académicos**
**Ubicación:** `/generar-texto`

#### **Opción A: Generación Simple**
**Funcionalidades:**
- Ingreso de prompt/tema
- Selección de nivel académico (básico, intermedio, avanzado)
- Generación con IA (CORA)
- **Detección automática de sesgos cognitivos**
- Visualización de palabras problemáticas
- Opciones de regeneración

**Sesgos detectados:**
1. **[S-UNIV]** - Cuantificadores universales (`todos`, `cada`, `ninguno`)
2. **[S-POLAR]** - Polarización extrema (`siempre`, `nunca`, `jamás`)
3. **[S-GEN]** - Generalizaciones sin fundamento
4. **[S-CAUSA]** - Causalidad sin evidencia
5. **[S-AUT]** - Apelación a autoridad sin citar
6. **[S-EMO]** - Lenguaje emocional excesivo
7. **[S-CONFIRMA]** - Sesgo de confirmación
8. **[S-ESTRELLA]** - Efecto halo

**Salida del módulo:**
```json
{
  "contenido": "Texto generado...",
  "palabrasProblematicas": [
    {
      "palabra": "todos",
      "posiciones": [12, 45],
      "contexto": "...todos los estudiantes...",
      "sugerencia": "Usar: 'la mayoría de los estudiantes'"
    }
  ],
  "sesgosDetectados": 3,
  "nivel": "necesita_mejora"
}
```

#### **Opción B: Generación con Revisión**
**Funcionalidades adicionales:**
- Todo lo de Generación Simple
- **Sistema de revisión iterativa**
- **Corrección automática de sesgos**
- Hasta 3 iteraciones de mejora
- Comparación versión original vs. corregida

**Flujo de revisión:**
1. Genera texto inicial
2. Detecta sesgos (lista palabras problemáticas)
3. Envía a CORA instrucciones de corrección
4. CORA regenera evitando sesgos
5. Valida nueva versión
6. Repite hasta texto sin sesgos (máx. 3 iteraciones)

---

### ❓ **3.3 Gestión de Preguntas**
**Ubicación:** Dentro de cada texto del curso

**Tipos de preguntas:**
1. **Literal** - Comprensión directa del texto
2. **Inferencial** - Deducciones e interpretaciones
3. **Crítica** - Análisis y evaluación del argumento

**Campos de cada pregunta:**
- Enunciado/prompt
- Tipo (literal/inferencial/crítica)
- Explicación/hint para estudiante
- Respuesta esperada (para docente)
- Puntuación

**Flujo de creación:**
```
Docente → Selecciona texto → Crear pregunta → 
Define tipo → Escribe enunciado → Añade hint → 
Guarda → Pregunta disponible para estudiantes
```

---

### 📊 **3.4 Evaluación de Estudiantes**
**Ubicación:** `/evaluacion` (estudiantes)

#### **Para Estudiantes:**
**Funcionalidades:**
1. Ver lista de cursos inscritos
2. Seleccionar curso
3. Ver texto completo
4. Responder preguntas de comprensión
5. **NUEVO:** Botón "Analizar Sesgos" en cada respuesta
6. Botón "Generar Feedback con IA"
7. Ver historial de respuestas

**Flujo de análisis de sesgos:**
```
Estudiante responde pregunta →
Click "Enviar Respuesta" →
Aparecen 2 botones:
  1. 🔍 "Analizar Sesgos" (naranja)
  2. 🤖 "Generar Feedback con IA" (azul)
→ Click "Analizar Sesgos" →
Modal se abre mostrando:
  - Puntuación académica (0-12)
  - Nivel (excelente/bueno/aceptable/necesita_mejora/insuficiente)
  - Lista de sesgos detectados con tarjetas
  - Sugerencias de mejora
  - Recomendaciones académicas
```

#### **Para Docentes:**
**Funcionalidades:**
1. Ver todas las respuestas de estudiantes
2. Revisar manualmente
3. Generar feedback con IA
4. **NO pueden ver** análisis de sesgos individuales
5. Ver estadísticas agregadas

---

### 🤖 **3.5 Chatbot Tutor Personal**
**Ubicación:** Botón flotante en evaluación

**Funcionalidades:**
- Responde preguntas sobre el texto actual
- Da pistas sobre las preguntas
- Explica conceptos del contenido
- Contexto automático del curso y texto
- Historial de conversación persistente

**Características:**
- 🟢 Siempre visible mientras el estudiante estudia
- 🧠 Contexto inteligente (sabe qué texto estás leyendo)
- 💬 Respuestas personalizadas según el nivel
- 📝 No da respuestas directas, guía al razonamiento

---

### 👥 **3.6 Gestión de Estudiantes**
**Ubicación:** `/estudiantes` (docentes)

**Funcionalidades:**
- Ver lista completa de estudiantes
- Filtrar por curso
- Ver progreso individual
- Ver respuestas detalladas
- Generar reportes por estudiante
- Eliminar estudiantes del curso

**Métricas por estudiante:**
- Preguntas respondidas
- Promedio de puntuación
- Tiempo invertido
- Tasa de finalización
- Sesgos frecuentes (agregado, no detalle)

---

## 4. SISTEMA DE DETECCIÓN DE SESGOS

### 🔍 **4.1 Detección en Textos Generados**

#### **Sesgos Lingüísticos (8 tipos):**

| Código | Nombre | Palabras clave | Severidad |
|--------|--------|----------------|-----------|
| **[S-UNIV]** | Cuantificadores Universales | todos, todas, cada, ninguno, ninguna | Alta |
| **[S-POLAR]** | Polarización | siempre, nunca, jamás, absolutamente | Alta |
| **[S-GEN]** | Generalización | generalmente, típicamente, normalmente | Media |
| **[S-CAUSA]** | Causalidad Simple | porque, por lo tanto, consecuentemente | Media |
| **[S-AUT]** | Autoridad | expertos dicen, estudios muestran (sin cita) | Media |
| **[S-EMO]** | Lenguaje Emocional | increíble, terrible, desastroso | Baja |
| **[S-CONFIRMA]** | Confirmación | obviamente, claramente, evidentemente | Media |
| **[S-ESTRELLA]** | Efecto Halo | mejor, peor, superior, inferior | Baja |

#### **Sistema de Puntuación:**
- **0 sesgos:** 10/10 - Excelente
- **1-2 sesgos:** 8/10 - Bueno
- **3-4 sesgos:** 6/10 - Aceptable
- **5-6 sesgos:** 4/10 - Necesita mejora
- **7+ sesgos:** 2/10 - Insuficiente

#### **Proceso de detección:**
1. Análisis con regex mejorados (`\b` word boundaries)
2. Validación de contexto
3. Post-procesamiento para evitar corrupciones
4. Corrección de concordancia gramatical
5. Generación de lista de palabras problemáticas

---

### 🎓 **4.2 Detección en Respuestas de Estudiantes**

#### **Sesgos Cognitivos Académicos (8 tipos):**

| Código | Nombre | Descripción | Peso |
|--------|--------|-------------|------|
| **[S-GEN]** | Generalización Excesiva | Conclusiones amplias sin evidencia suficiente | 2.0 |
| **[S-POL]** | Polarización | Pensamiento blanco/negro sin matices | 1.5 |
| **[S-CAU]** | Causalidad Simplificada | Relaciones causa-efecto sin considerar factores | 2.0 |
| **[S-LECT]** | Lectura Parcial | Ignora partes del texto que contradicen su punto | 2.5 |
| **[S-INF]** | Inferencia Débil | Conclusiones sin fundamento en el texto | 2.5 |
| **[S-CRIT]** | Crítica Superficial | Rechaza ideas sin análisis profundo | 1.5 |
| **[S-APL]** | Aplicación Limitada | No conecta conceptos con contextos reales | 1.0 |
| **[S-FOCO]** | Desalineación | Responde algo diferente a lo preguntado | 3.0 |

#### **Sistema de Puntuación Académica:**
- **Puntuación:** 0-12 puntos
- **Fórmula:** 12 - (suma de pesos de sesgos detectados)
- **Niveles:**
  - **12 puntos:** Excelente
  - **10-11 puntos:** Bueno
  - **8-9 puntos:** Aceptable
  - **6-7 puntos:** Necesita mejora
  - **<6 puntos:** Insuficiente

#### **Recomendaciones Generadas:**
1. **Específicas por sesgo:** Cómo evitar ese sesgo particular
2. **Técnicas de mejora:** Estrategias concretas de pensamiento crítico
3. **Ejemplos:** Cómo reformular la respuesta

#### **Endpoint:**
```
POST /api/biases/analyze-student-answer/:attemptId
Authorization: Bearer <token>

Response:
{
  "attemptId": "...",
  "questionId": "...",
  "score": 7.5,
  "maxScore": 12,
  "nivel": "necesita_mejora",
  "mensaje": "Tu respuesta muestra algunos sesgos que limitan...",
  "biases": [
    {
      "type": "generalizacion_excesiva",
      "tag": "[S-GEN]",
      "severity": "media",
      "description": "Estableces una conclusión general...",
      "location": "En tu afirmación sobre...",
      "suggestion": "Usa expresiones como 'en algunos casos'...",
      "impact": "Debilita tu argumento al ser fácilmente refutable"
    }
  ],
  "recomendaciones": [
    "Busca evidencia específica del texto antes de generalizar",
    "Considera casos excepcionales o contextos diferentes",
    "Usa cuantificadores más precisos (algunos, varios, la mayoría)"
  ]
}
```

---

## 5. INTEGRACIÓN CON IA (CORA)

### 🤖 **5.1 Agente CORA (Digital Ocean)**

**Capacidades del agente:**
- Generación de textos académicos
- Corrección de sesgos en textos
- Generación de feedback para estudiantes
- Respuestas del chatbot tutor
- Análisis contextual de documentos

**System Prompt incluye:**
- Instrucciones de detección de sesgos
- Guías de feedback constructivo
- Técnicas de pensamiento crítico
- Niveles de Bloom
- Estándares académicos

**Ver documentación completa:** `CORA-AGENT-CAPABILITIES.md`

---

### 📡 **5.2 Servicios IA del Backend**

#### **A) cora.service.js**
**Funciones principales:**
- `generateText(prompt, academicLevel)` - Genera texto académico
- `reviewAndImproveText(text, biases)` - Corrige sesgos detectados
- `generateFeedback(data)` - Genera feedback con análisis de sesgos
- `getChatResponse(messages, context)` - Chatbot respuestas

#### **B) bias.service.js**
**Funciones principales:**
- `detectBiasesInText(content)` - Detecta sesgos lingüísticos
- `analyzeStudentAnswer(answer, question, context)` - Analiza sesgos cognitivos
- `generateStudentRecommendations(biases)` - Genera recomendaciones
- `getProblematicWords(text)` - Extrae palabras problemáticas

---

## 6. FLUJOS DE USUARIO

### 📚 **6.1 Flujo Completo del Docente**

```
1. LOGIN como docente
   ↓
2. Dashboard → Ver mis cursos
   ↓
3. "Crear Nuevo Curso"
   → Ingresa título, descripción, nivel
   ↓
4. "Generar Texto Académico"
   → Ingresa tema
   → Sistema genera + detecta sesgos
   → Opción: Regenerar con corrección automática
   → Guarda texto en curso
   ↓
5. "Crear Preguntas"
   → Para cada texto:
     - Pregunta literal (nivel 1)
     - Pregunta inferencial (nivel 2)
     - Pregunta crítica (nivel 3)
   ↓
6. Estudiantes se inscriben y responden
   ↓
7. "Ver Respuestas de Estudiantes"
   → Genera feedback con IA (incluye análisis de sesgos en prompt)
   → Estudiante recibe feedback
   ↓
8. "Ver Estadísticas"
   → Progreso del curso
   → Sesgos más comunes (agregado)
   → Tasa de finalización
```

---

### 🎓 **6.2 Flujo Completo del Estudiante**

```
1. LOGIN como estudiante
   ↓
2. Dashboard → "Cursos Disponibles"
   ↓
3. "Inscribirse en Curso"
   ↓
4. "Ver Contenido del Curso"
   → Lista de textos
   ↓
5. Selecciona texto → Lee contenido
   ↓
6. "Responder Preguntas"
   → Ve pregunta tipo LITERAL
   → Escribe respuesta
   → Click "Enviar Respuesta"
   ↓
7. Aparecen 2 botones:
   
   OPCIÓN A: "🔍 Analizar Sesgos"
   → Click
   → Modal abre mostrando:
     ✓ Puntuación: 7.5/12
     ✓ Nivel: Necesita mejora
     ✓ 2 sesgos detectados:
       - [S-GEN] Generalización excesiva
       - [S-CAU] Causalidad simplificada
     ✓ Sugerencias específicas
     ✓ Recomendaciones académicas
   → Estudiante lee y mejora su respuesta
   → Puede reenviar respuesta corregida
   
   OPCIÓN B: "🤖 Generar Feedback con IA"
   → Click
   → CORA genera feedback (usando análisis de sesgos interno)
   → Estudiante lee feedback
   ↓
8. Continúa con siguiente pregunta
   ↓
9. (Opcional) Click en Chatbot flotante
   → Hace preguntas sobre el texto
   → Recibe explicaciones contextuales
   → Chatbot NO da respuestas directas
   ↓
10. Completa todas las preguntas del texto
    ↓
11. Ve su progreso en dashboard
```

---

### 🔄 **6.3 Flujo de Análisis de Sesgos (Estudiante)**

```
┌─────────────────────────────────────┐
│  Estudiante responde pregunta       │
│  "Los métodos científicos siempre   │
│   producen resultados objetivos"    │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Click "Enviar Respuesta"           │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Backend guarda en DB:              │
│  QuestionAttempt {                  │
│    answers: [{value: "..."}],       │
│    student: userId,                 │
│    question: questionId             │
│  }                                  │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Frontend muestra 2 botones:        │
│  1. 🔍 Analizar Sesgos (naranja)    │
│  2. 🤖 Generar Feedback IA (azul)   │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Estudiante click "Analizar Sesgos" │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Frontend: handleAnalyzeBias()      │
│  POST /api/biases/                  │
│    analyze-student-answer/:attemptId│
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Backend: bias.controller.js        │
│  1. Busca QuestionAttempt           │
│  2. Extrae respuesta:               │
│     attempt.answers[0].value        │
│  3. Verifica permisos (solo dueño)  │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  bias.service.analyzeStudentAnswer()│
│  Detecta 8 tipos de sesgos:         │
│  - Generalización [S-GEN]           │
│  - Polarización [S-POL]             │
│  - Causalidad simple [S-CAU]        │
│  - Lectura parcial [S-LECT]         │
│  - Inferencia débil [S-INF]         │
│  - Crítica superficial [S-CRIT]     │
│  - Aplicación limitada [S-APL]      │
│  - Desalineación [S-FOCO]           │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Calcula puntuación:                │
│  12 - (suma de pesos)               │
│  Ejemplo: 12 - 4.5 = 7.5/12         │
│  Nivel: "necesita_mejora"           │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Genera recomendaciones:            │
│  - Específicas por sesgo            │
│  - Técnicas de mejora               │
│  - Estrategias académicas           │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Retorna JSON al frontend           │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Frontend: setBiasAnalysis(data)    │
│  setShowBiasModal(true)             │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Modal se renderiza mostrando:      │
│  ┌─────────────────────────────┐    │
│  │ 🔍 Análisis de Sesgos       │    │
│  │                             │    │
│  │ 📊 Puntuación: 7.5/12       │    │
│  │    NECESITA MEJORA          │    │
│  │                             │    │
│  │ ⚠️ 2 Aspectos a Mejorar:    │    │
│  │                             │    │
│  │ [S-GEN] GENERALIZACIÓN      │    │
│  │ "Usas 'siempre' sin evidencia"│  │
│  │ 💡 Sugerencia: Usa "en algunos│  │
│  │    casos" o "frecuentemente" │   │
│  │                             │    │
│  │ [S-CAU] CAUSALIDAD SIMPLE   │    │
│  │ "Asumes causa-efecto directa"│   │
│  │ 💡 Sugerencia: Considera otros│  │
│  │    factores que influyen     │   │
│  │                             │    │
│  │ 🎯 Recomendaciones:         │    │
│  │ • Busca evidencia del texto │    │
│  │ • Considera casos excepcionales│ │
│  │ • Usa cuantificadores precisos│ │
│  │                             │    │
│  │ [✅ Entendido]              │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

---

## 7. API ENDPOINTS

### 🔐 **Autenticación**
```
POST   /api/auth/register          - Registro de usuario
POST   /api/auth/login             - Login (retorna JWT)
GET    /api/auth/verify            - Verificar token
POST   /api/auth/refresh           - Refrescar token
```

### 📚 **Cursos**
```
GET    /api/courses                - Listar cursos (filtrado por rol)
POST   /api/courses                - Crear curso (docente)
GET    /api/courses/:id            - Obtener curso específico
PUT    /api/courses/:id            - Actualizar curso (docente)
DELETE /api/courses/:id            - Eliminar curso (docente)
GET    /api/courses/:id/stats      - Estadísticas del curso
```

### 📝 **Textos**
```
GET    /api/texts                  - Listar textos
POST   /api/texts                  - Crear texto (docente)
GET    /api/texts/:id              - Obtener texto específico
PUT    /api/texts/:id              - Actualizar texto (docente)
DELETE /api/texts/:id              - Eliminar texto (docente)
POST   /api/texts/generate         - Generar texto con IA
POST   /api/texts/generate-with-review - Generar + revisar sesgos
```

### ❓ **Preguntas**
```
GET    /api/questions              - Listar preguntas
POST   /api/questions              - Crear pregunta (docente)
GET    /api/questions/:id          - Obtener pregunta
PUT    /api/questions/:id          - Actualizar pregunta (docente)
DELETE /api/questions/:id          - Eliminar pregunta (docente)
GET    /api/questions/text/:textId - Preguntas de un texto
```

### 📊 **Respuestas (Attempts)**
```
GET    /api/attempts               - Listar intentos del usuario
POST   /api/attempts               - Crear respuesta
GET    /api/attempts/:id           - Obtener respuesta específica
PUT    /api/attempts/:id           - Actualizar respuesta
POST   /api/attempts/:id/feedback  - Generar feedback con IA
GET    /api/attempts/question/:qId - Intentos de una pregunta
```

### 🔍 **Sesgos (NUEVO)**
```
POST   /api/biases/analyze         - Analizar texto por sesgos
POST   /api/biases/analyze-content - Analizar contenido directo
GET    /api/biases                 - Listar sesgos detectados
GET    /api/biases/:id             - Obtener sesgo específico
PUT    /api/biases/:id/resolve     - Marcar sesgo como resuelto

✨ NUEVO ENDPOINT:
POST   /api/biases/analyze-student-answer/:attemptId
       - Analiza sesgos cognitivos en respuesta de estudiante
       - Solo accesible por el estudiante dueño o docente
       - Retorna puntuación académica 0-12
       - Lista de sesgos detectados con sugerencias
       - Recomendaciones de mejora
```

### 🤖 **Chatbot**
```
POST   /api/chatbot/message        - Enviar mensaje al chatbot
GET    /api/chatbot/history        - Historial de conversación
DELETE /api/chatbot/history        - Limpiar historial
```

### 👥 **Estudiantes**
```
GET    /api/students               - Listar estudiantes (docente)
GET    /api/students/:id           - Perfil de estudiante
GET    /api/students/:id/progress  - Progreso del estudiante
GET    /api/students/course/:courseId - Estudiantes de un curso
```

### 📈 **Progreso**
```
GET    /api/progress/:userId       - Progreso de un usuario
GET    /api/progress/course/:courseId - Progreso en un curso
PUT    /api/progress/:userId       - Actualizar progreso
```

### 📋 **Inscripciones**
```
POST   /api/enrollments            - Inscribirse en curso
GET    /api/enrollments/user/:userId - Cursos del usuario
DELETE /api/enrollments/:id        - Cancelar inscripción
```

---

## 8. MODELOS DE DATOS

### 📊 **8.1 User (Usuario)**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String, // 'student' | 'teacher' | 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

### 📚 **8.2 Course (Curso)**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  teacher: ObjectId (ref: User),
  academicLevel: String, // 'basico' | 'intermedio' | 'avanzado'
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 📝 **8.3 Text (Texto Académico)**
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  course: ObjectId (ref: Course),
  academicLevel: String,
  biasAnalysis: {
    detected: Boolean,
    count: Number,
    types: [String],
    severity: String
  },
  palabrasProblematicas: [{
    palabra: String,
    posiciones: [Number],
    contexto: String,
    sugerencia: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### ❓ **8.4 Question (Pregunta)**
```javascript
{
  _id: ObjectId,
  text: ObjectId (ref: Text),
  course: ObjectId (ref: Course),
  prompt: String, // Enunciado de la pregunta
  tipo: String, // 'literal' | 'inferencial' | 'critica'
  skill: String, // Habilidad cognitiva evaluada
  hint: String, // Pista para el estudiante
  expectedAnswer: String, // Respuesta esperada (solo docente)
  points: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 📊 **8.5 QuestionAttempt (Respuesta del Estudiante)**
```javascript
{
  _id: ObjectId,
  student: ObjectId (ref: User),
  question: ObjectId (ref: Question),
  text: ObjectId (ref: Text),
  answers: [{
    value: Mixed, // Respuesta del estudiante
    isCorrect: Boolean
  }],
  score: Number,
  timeSpentSeconds: Number,
  completedAt: Date,
  autoFeedback: String, // Feedback generado por IA
  feedback: String, // Feedback manual del docente
  feedbackGeneratedAt: Date,
  requiresReview: Boolean,
  
  // ✨ NUEVO: Análisis de sesgos
  biasAnalysis: {
    score: Number,           // 0-12
    maxScore: Number,        // 12
    nivel: String,           // 'excelente' | 'bueno' | 'aceptable' | 'necesita_mejora' | 'insuficiente'
    biasesDetected: Number,  // Cantidad de sesgos
    analyzedAt: Date
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### 🔍 **8.6 Bias (Sesgo Detectado)**
```javascript
{
  _id: ObjectId,
  text: ObjectId (ref: Text),
  type: String, // Tipo de sesgo detectado
  description: String,
  location: String, // Dónde se encontró en el texto
  severity: String, // 'baja' | 'media' | 'alta'
  suggestion: String, // Sugerencia de corrección
  resolved: Boolean,
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 📈 **8.7 Progress (Progreso)**
```javascript
{
  _id: ObjectId,
  student: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  text: ObjectId (ref: Text),
  questionsCompleted: Number,
  questionsTotal: Number,
  averageScore: Number,
  timeSpent: Number, // segundos
  lastAccess: Date,
  completed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 📋 **8.8 Enrollment (Inscripción)**
```javascript
{
  _id: ObjectId,
  student: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  enrolledAt: Date,
  status: String, // 'active' | 'completed' | 'dropped'
  completionPercentage: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 📝 **8.9 AuditLog (Log de Auditoría)**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  action: String, // 'create' | 'update' | 'delete' | 'login'
  entity: String, // 'course' | 'text' | 'question' | etc.
  entityId: ObjectId,
  changes: Object, // Cambios realizados
  ipAddress: String,
  userAgent: String,
  createdAt: Date
}
```

---

## 9. CARACTERÍSTICAS TÉCNICAS

### 🏗️ **Arquitectura**
```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   React     │ ───▶ │   Express   │ ───▶ │   MongoDB   │
│  (Frontend) │ HTTP │  (Backend)  │ ───▶ │  (Database) │
└─────────────┘      └─────────────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  CORA (IA)  │
                     │ DigitalOcean│
                     └─────────────┘
```

### 🔧 **Stack Tecnológico**
**Frontend:**
- React 18
- React Router DOM
- Axios
- CSS Modules
- Vite

**Backend:**
- Node.js 18+
- Express 4
- Mongoose 7
- JWT (jsonwebtoken)
- bcryptjs
- dotenv

**Base de Datos:**
- MongoDB 6+
- Índices optimizados
- Agregaciones para estadísticas

**IA:**
- CORA Agent (DigitalOcean)
- GPT-based model
- Context-aware prompts

### 🔐 **Seguridad**
- Autenticación JWT con refresh tokens
- Passwords hasheados con bcrypt (10 rounds)
- Validación de permisos por rol
- Sanitización de inputs
- Rate limiting en endpoints sensibles
- CORS configurado
- Helmet para headers de seguridad

### ⚡ **Optimizaciones**
- Paginación en listados grandes
- Índices en MongoDB para queries frecuentes
- Lazy loading de componentes React
- Debouncing en búsquedas
- Caching de respuestas IA (próximamente)
- Compresión de respuestas HTTP

### 🐳 **Despliegue**
- Docker Compose para desarrollo
- Variables de entorno para configuración
- Logs estructurados
- Health checks
- Backups automáticos de BD

---

## 📊 MÉTRICAS Y ESTADÍSTICAS

### **Para Docentes:**
- Total de estudiantes inscritos
- Tasa de finalización del curso
- Promedio de puntuación por pregunta
- Tiempo promedio por texto
- Sesgos más comunes (agregado, sin identificar estudiantes)
- Preguntas con mayor dificultad

### **Para Estudiantes:**
- Progreso personal (%)
- Puntuaciones por texto
- Historial de feedback
- Análisis de sesgos propios (privado)
- Tiempo invertido
- Insignias/logros (próximamente)

---

## 🚀 PRÓXIMAS FUNCIONALIDADES

### **En Desarrollo:**
- [ ] Dashboard de sesgos agregados para docentes
- [ ] Exportación de reportes en PDF
- [ ] Sistema de insignias y gamificación
- [ ] Notificaciones en tiempo real
- [ ] Comparación de versiones de textos
- [ ] Editor de textos con sugerencias en vivo

### **Planificado:**
- [ ] Integración con otras plataformas educativas (LMS)
- [ ] API pública para integraciones
- [ ] App móvil (React Native)
- [ ] Análisis de sentimiento en respuestas
- [ ] Recomendaciones personalizadas de contenido
- [ ] Foros de discusión por curso

---

## 📞 SOPORTE Y CONTACTO

**Repositorio:** [GitHub - critico-mern]  
**Documentación técnica:** Ver carpeta `/docs`  
**Issues:** Reportar en GitHub Issues  
**Email:** soporte@critico-edu.com

---

## 📄 LICENCIA

Copyright © 2025 - Sistema CRÍTICO MERN  
Todos los derechos reservados.

---

**Última actualización:** 4 de octubre de 2025  
**Versión del documento:** 2.0  
**Autor:** Equipo de Desarrollo CRÍTICO
