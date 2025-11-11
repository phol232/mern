# Design Document - Cypress E2E Testing

## Overview

Este documento describe el diseño técnico para implementar pruebas end-to-end (E2E) con Cypress en el sistema CRÍTICO MERN. La solución incluirá configuración de Cypress, estructura de tests, comandos personalizados, fixtures, y estrategias de testing para validar todos los flujos críticos del usuario.

### Objetivos del Diseño

1. Configurar Cypress para ejecutar pruebas contra el entorno de producción (https://proyecto.yamycorp.com/)
2. Crear una suite completa de tests E2E que cubra flujos de docente y estudiante
3. Implementar comandos personalizados reutilizables para simplificar la escritura de tests
4. Establecer fixtures de datos de prueba consistentes
5. Configurar reportes y captura de evidencia de fallos
6. Asegurar que los tests sean mantenibles, escalables y fáciles de ejecutar

### Alcance

**Incluye:**
- Configuración de Cypress con TypeScript
- Tests de autenticación (login, registro, logout)
- Tests de flujos completos de docente (gestión de cursos, textos, preguntas)
- Tests de flujos completos de estudiante (inscripción, lectura, evaluación)
- Tests de sistema de detección de sesgos
- Tests de chatbot tutor
- Tests de gestión de estudiantes
- Comandos personalizados y fixtures
- Configuración de reportes

**No incluye:**
- Tests de performance o carga
- Tests de seguridad o penetración
- Tests de APIs directamente (solo a través de UI)
- Tests de compatibilidad cross-browser exhaustivos


## Architecture

### Estructura de Directorios

```
critico-mern/
├── cypress/
│   ├── e2e/
│   │   ├── auth/
│   │   │   ├── login.cy.ts
│   │   │   ├── register.cy.ts
│   │   │   └── logout.cy.ts
│   │   ├── teacher/
│   │   │   ├── course-management.cy.ts
│   │   │   ├── text-generation.cy.ts
│   │   │   ├── question-creation.cy.ts
│   │   │   └── student-management.cy.ts
│   │   ├── student/
│   │   │   ├── course-enrollment.cy.ts
│   │   │   ├── text-reading.cy.ts
│   │   │   ├── question-answering.cy.ts
│   │   │   ├── bias-analysis.cy.ts
│   │   │   └── chatbot.cy.ts
│   │   └── bias-detection/
│   │       ├── text-bias-detection.cy.ts
│   │       └── answer-bias-detection.cy.ts
│   ├── fixtures/
│   │   ├── users.json
│   │   ├── courses.json
│   │   ├── texts.json
│   │   ├── questions.json
│   │   └── answers.json
│   ├── support/
│   │   ├── commands.ts
│   │   ├── e2e.ts
│   │   └── selectors.ts
│   └── downloads/
├── cypress.config.ts
└── package.json
```

### Componentes Principales

#### 1. Cypress Configuration (cypress.config.ts)
- Configuración base de Cypress
- URL del entorno de producción
- Timeouts y retries
- Configuración de screenshots y videos
- Variables de entorno

#### 2. Custom Commands (cypress/support/commands.ts)
- Comandos de autenticación (login, logout)
- Comandos de navegación
- Comandos de creación de datos
- Comandos de limpieza
- Comandos de validación

#### 3. Selectors (cypress/support/selectors.ts)
- Selectores centralizados para elementos UI
- Organizado por página/componente
- Facilita mantenimiento cuando cambia la UI

#### 4. Fixtures
- Datos de prueba reutilizables
- Usuarios de prueba por rol
- Datos de ejemplo para cursos, textos, preguntas


## Components and Interfaces

### 1. Cypress Configuration Interface

```typescript
// cypress.config.ts
interface CypressConfig {
  e2e: {
    baseUrl: string;
    specPattern: string;
    supportFile: string;
    fixturesFolder: string;
    screenshotsFolder: string;
    videosFolder: string;
    viewportWidth: number;
    viewportHeight: number;
    defaultCommandTimeout: number;
    requestTimeout: number;
    responseTimeout: number;
    video: boolean;
    screenshotOnRunFailure: boolean;
    retries: {
      runMode: number;
      openMode: number;
    };
    env: {
      apiUrl: string;
    };
  };
}
```

### 2. Custom Commands Interface

```typescript
// cypress/support/commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      // Authentication Commands
      login(email: string, password: string): Chainable<void>;
      loginAsTeacher(): Chainable<void>;
      loginAsStudent(): Chainable<void>;
      logout(): Chainable<void>;
      
      // Navigation Commands
      navigateToCourses(): Chainable<void>;
      navigateToStudentEvaluation(): Chainable<void>;
      navigateToStudentManagement(): Chainable<void>;
      
      // Data Creation Commands
      createCourse(courseData: CourseData): Chainable<string>;
      createTopic(courseId: string, topicData: TopicData): Chainable<string>;
      createText(topicId: string, textData: TextData): Chainable<string>;
      createQuestion(textId: string, questionData: QuestionData): Chainable<string>;
      enrollStudent(courseId: string): Chainable<void>;
      
      // Validation Commands
      verifyBiasAnalysis(expectedBiases: number): Chainable<void>;
      verifyCourseInList(courseName: string): Chainable<void>;
      verifyFeedbackGenerated(): Chainable<void>;
      
      // Cleanup Commands
      cleanupTestData(): Chainable<void>;
    }
  }
}
```

### 3. Fixture Data Interfaces

```typescript
// Types for fixture data
interface UserFixture {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'admin';
}

interface CourseFixture {
  title: string;
  description: string;
  level: string;
}

interface TextFixture {
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadingTime: number;
  hasBiases: boolean;
}

interface QuestionFixture {
  text: string;
  type: 'literal' | 'inferencial' | 'critica';
  hint: string;
  expectedAnswer: string;
}

interface AnswerFixture {
  value: string;
  hasBiases: boolean;
  expectedBiasCount: number;
}
```


### 4. Selector Organization

```typescript
// cypress/support/selectors.ts
export const selectors = {
  auth: {
    emailInput: '[data-cy="email-input"]',
    passwordInput: '[data-cy="password-input"]',
    loginButton: '[data-cy="login-button"]',
    registerButton: '[data-cy="register-button"]',
    logoutButton: '[data-cy="logout-button"]',
    errorMessage: '[data-cy="error-message"]',
  },
  
  courses: {
    createButton: '[data-cy="create-course-button"]',
    courseCard: '[data-cy="course-card"]',
    courseTitle: '[data-cy="course-title"]',
    courseDescription: '[data-cy="course-description"]',
    enrollButton: '[data-cy="enroll-button"]',
    courseList: '[data-cy="course-list"]',
  },
  
  texts: {
    generateButton: '[data-cy="generate-text-button"]',
    textContent: '[data-cy="text-content"]',
    biasIndicator: '[data-cy="bias-indicator"]',
    problematicWords: '[data-cy="problematic-words"]',
    regenerateButton: '[data-cy="regenerate-button"]',
  },
  
  questions: {
    createButton: '[data-cy="create-question-button"]',
    questionText: '[data-cy="question-text"]',
    questionType: '[data-cy="question-type"]',
    answerInput: '[data-cy="answer-input"]',
    submitButton: '[data-cy="submit-answer-button"]',
  },
  
  biasAnalysis: {
    analyzeButton: '[data-cy="analyze-bias-button"]',
    biasModal: '[data-cy="bias-modal"]',
    biasScore: '[data-cy="bias-score"]',
    biasLevel: '[data-cy="bias-level"]',
    biasCard: '[data-cy="bias-card"]',
    recommendations: '[data-cy="recommendations"]',
  },
  
  chatbot: {
    openButton: '[data-cy="chatbot-open-button"]',
    chatWindow: '[data-cy="chatbot-window"]',
    messageInput: '[data-cy="chatbot-message-input"]',
    sendButton: '[data-cy="chatbot-send-button"]',
    messageList: '[data-cy="chatbot-messages"]',
  },
  
  students: {
    studentList: '[data-cy="student-list"]',
    studentCard: '[data-cy="student-card"]',
    progressBar: '[data-cy="progress-bar"]',
    viewAnswersButton: '[data-cy="view-answers-button"]',
    generateFeedbackButton: '[data-cy="generate-feedback-button"]',
  },
};
```

**Nota:** Los selectores usan el atributo `data-cy` que deberá agregarse a los componentes del frontend. Si no están disponibles, se usarán selectores alternativos basados en clases CSS o texto.


## Data Models

### Test Data Structure

#### 1. Users Fixture (cypress/fixtures/users.json)

```json
{
  "teacher": {
    "email": "docente.test@yamycorp.com",
    "password": "TestPassword123!",
    "firstName": "Docente",
    "lastName": "Prueba",
    "role": "teacher"
  },
  "student": {
    "email": "estudiante.test@yamycorp.com",
    "password": "TestPassword123!",
    "firstName": "Estudiante",
    "lastName": "Prueba",
    "role": "student"
  },
  "admin": {
    "email": "admin.test@yamycorp.com",
    "password": "TestPassword123!",
    "firstName": "Admin",
    "lastName": "Prueba",
    "role": "admin"
  }
}
```

#### 2. Courses Fixture (cypress/fixtures/courses.json)

```json
{
  "basicCourse": {
    "title": "Curso de Prueba E2E - Pensamiento Crítico Básico",
    "description": "Curso creado automáticamente por Cypress para pruebas E2E",
    "level": "Básico"
  },
  "intermediateCourse": {
    "title": "Curso de Prueba E2E - Análisis Avanzado",
    "description": "Curso intermedio para validar funcionalidades complejas",
    "level": "Intermedio"
  }
}
```

#### 3. Texts Fixture (cypress/fixtures/texts.json)

```json
{
  "textWithBiases": {
    "title": "Texto con Sesgos para Pruebas",
    "content": "Todos los estudiantes siempre deben estudiar porque nunca se sabe cuándo habrá un examen. Los expertos dicen que es absolutamente necesario.",
    "difficulty": "intermediate",
    "estimatedReadingTime": 5,
    "expectedBiases": ["S-UNIV", "S-POLAR", "S-AUT"]
  },
  "textWithoutBiases": {
    "title": "Texto Neutral para Pruebas",
    "content": "El pensamiento crítico es una habilidad que se desarrolla con práctica. Algunos estudiantes encuentran útil analizar argumentos desde múltiples perspectivas.",
    "difficulty": "beginner",
    "estimatedReadingTime": 3,
    "expectedBiases": []
  }
}
```

#### 4. Questions Fixture (cypress/fixtures/questions.json)

```json
{
  "literalQuestion": {
    "text": "¿Cuál es la idea principal del texto?",
    "type": "literal",
    "hint": "Busca la oración que resume el tema central",
    "expectedAnswer": "El pensamiento crítico como habilidad desarrollable"
  },
  "inferentialQuestion": {
    "text": "¿Qué se puede inferir sobre la importancia del análisis múltiple?",
    "type": "inferencial",
    "hint": "Considera las implicaciones de ver diferentes perspectivas",
    "expectedAnswer": "Permite una comprensión más completa y objetiva"
  },
  "criticalQuestion": {
    "text": "Evalúa la validez del argumento presentado en el texto",
    "type": "critica",
    "hint": "Analiza la evidencia y la lógica del razonamiento",
    "expectedAnswer": "El argumento es sólido pero podría fortalecerse con ejemplos"
  }
}
```

#### 5. Answers Fixture (cypress/fixtures/answers.json)

```json
{
  "answerWithBiases": {
    "value": "Todos los estudiantes siempre necesitan pensar críticamente porque nunca se equivocan cuando lo hacen.",
    "expectedBiasCount": 3,
    "expectedBiases": ["S-GEN", "S-POL"],
    "expectedScore": 6.5
  },
  "answerWithoutBiases": {
    "value": "El pensamiento crítico puede ayudar a los estudiantes a analizar información de manera más efectiva en algunos contextos académicos.",
    "expectedBiasCount": 0,
    "expectedScore": 12
  }
}
```


## Error Handling

### Estrategias de Manejo de Errores

#### 1. Network Errors
- **Problema:** Fallos de red o timeouts al comunicarse con el servidor
- **Solución:** 
  - Configurar timeouts apropiados (30s para requests, 60s para responses)
  - Implementar retries automáticos (2 intentos en modo CI)
  - Capturar y loggear errores de red para debugging

#### 2. Element Not Found
- **Problema:** Elementos UI no encontrados debido a cambios en el DOM o timing
- **Solución:**
  - Usar comandos con espera implícita (cy.get con retry)
  - Implementar esperas explícitas cuando sea necesario (cy.wait)
  - Usar selectores robustos (data-cy attributes preferentemente)

#### 3. Authentication Failures
- **Problema:** Fallos de autenticación por credenciales inválidas o sesión expirada
- **Solución:**
  - Validar credenciales antes de ejecutar tests
  - Implementar re-login automático en caso de sesión expirada
  - Limpiar cookies y localStorage entre tests

#### 4. Data Inconsistency
- **Problema:** Datos de prueba inconsistentes o conflictos con datos existentes
- **Solución:**
  - Usar nombres únicos con timestamps para recursos de prueba
  - Implementar cleanup hooks (afterEach, after)
  - Validar estado inicial antes de cada test

#### 5. Flaky Tests
- **Problema:** Tests que fallan intermitentemente
- **Solución:**
  - Evitar esperas fijas (cy.wait(5000))
  - Usar assertions que esperan condiciones (cy.should)
  - Implementar retries para tests críticos
  - Aislar tests para evitar dependencias

### Error Logging Strategy

```typescript
// Interceptar y loggear errores
Cypress.on('fail', (error, runnable) => {
  // Log error details
  cy.log('Test Failed:', runnable.title);
  cy.log('Error:', error.message);
  
  // Capture additional context
  cy.screenshot(`failure-${runnable.title}`);
  
  // Re-throw to fail the test
  throw error;
});

// Interceptar requests fallidos
cy.intercept('*', (req) => {
  req.on('response', (res) => {
    if (res.statusCode >= 400) {
      cy.log(`API Error: ${req.method} ${req.url} - ${res.statusCode}`);
    }
  });
});
```


## Testing Strategy

### Test Organization

#### 1. Test Suites por Funcionalidad

**Authentication Suite (auth/)**
- Login con credenciales válidas
- Login con credenciales inválidas
- Registro de nuevo usuario
- Logout
- Protección de rutas

**Teacher Suite (teacher/)**
- Gestión de cursos (CRUD)
- Generación de textos con IA
- Detección de sesgos en textos
- Creación de preguntas
- Visualización de estudiantes
- Generación de feedback

**Student Suite (student/)**
- Visualización de cursos disponibles
- Inscripción en cursos
- Lectura de textos
- Respuesta a preguntas
- Análisis de sesgos en respuestas
- Interacción con chatbot

**Bias Detection Suite (bias-detection/)**
- Detección de sesgos lingüísticos
- Detección de sesgos cognitivos
- Cálculo de puntuación
- Generación de recomendaciones

#### 2. Test Execution Strategy

**Orden de Ejecución:**
1. Authentication tests (prerequisito para otros tests)
2. Teacher flow tests (crear datos necesarios)
3. Student flow tests (usar datos creados)
4. Bias detection tests (validar funcionalidad core)

**Paralelización:**
- Tests independientes pueden ejecutarse en paralelo
- Tests que comparten datos deben ejecutarse secuencialmente
- Usar Cypress Cloud para paralelización avanzada (opcional)

#### 3. Test Data Management

**Setup Strategy:**
```typescript
// Before each test suite
before(() => {
  // Login as appropriate user
  cy.loginAsTeacher();
  
  // Create necessary test data
  cy.fixture('courses').then((courses) => {
    cy.createCourse(courses.basicCourse).as('courseId');
  });
});

// Cleanup after tests
after(() => {
  cy.cleanupTestData();
});
```

**Isolation Strategy:**
- Cada test debe ser independiente
- No depender del estado de tests anteriores
- Crear datos necesarios en beforeEach si es necesario
- Limpiar datos en afterEach

#### 4. Assertion Strategy

**Tipos de Assertions:**

```typescript
// Visual assertions
cy.get('[data-cy="course-title"]').should('be.visible');
cy.get('[data-cy="course-title"]').should('contain', 'Pensamiento Crítico');

// State assertions
cy.url().should('include', '/app/courses');
cy.get('[data-cy="course-list"]').children().should('have.length.greaterThan', 0);

// API assertions
cy.intercept('POST', '/api/courses').as('createCourse');
cy.get('[data-cy="create-button"]').click();
cy.wait('@createCourse').its('response.statusCode').should('eq', 201);

// Content assertions
cy.get('[data-cy="bias-score"]').should('match', /\d+\/12/);
cy.get('[data-cy="bias-level"]').should('be.oneOf', ['excelente', 'bueno', 'aceptable', 'necesita_mejora', 'insuficiente']);
```


### Test Scenarios Detail

#### Scenario 1: Teacher Creates Course with Text and Questions

```typescript
describe('Teacher Course Creation Flow', () => {
  it('should create complete course with text and questions', () => {
    // 1. Login as teacher
    cy.loginAsTeacher();
    
    // 2. Navigate to courses
    cy.navigateToCourses();
    
    // 3. Create new course
    cy.get('[data-cy="create-course-button"]').click();
    cy.get('[data-cy="course-title-input"]').type('Curso E2E Test');
    cy.get('[data-cy="course-description-input"]').type('Descripción de prueba');
    cy.get('[data-cy="save-course-button"]').click();
    
    // 4. Verify course created
    cy.verifyCourseInList('Curso E2E Test');
    
    // 5. Generate text with AI
    cy.get('[data-cy="generate-text-button"]').click();
    cy.get('[data-cy="text-prompt-input"]').type('Pensamiento crítico en ingeniería');
    cy.get('[data-cy="generate-button"]').click();
    
    // 6. Wait for text generation
    cy.get('[data-cy="text-content"]', { timeout: 30000 }).should('be.visible');
    
    // 7. Verify bias detection
    cy.get('[data-cy="bias-indicator"]').should('exist');
    
    // 8. Save text
    cy.get('[data-cy="save-text-button"]').click();
    
    // 9. Create question
    cy.get('[data-cy="create-question-button"]').click();
    cy.get('[data-cy="question-text-input"]').type('¿Cuál es la idea principal?');
    cy.get('[data-cy="question-type-select"]').select('literal');
    cy.get('[data-cy="save-question-button"]').click();
    
    // 10. Verify question created
    cy.get('[data-cy="question-list"]').should('contain', '¿Cuál es la idea principal?');
  });
});
```

#### Scenario 2: Student Enrolls and Completes Evaluation

```typescript
describe('Student Evaluation Flow', () => {
  it('should enroll in course and complete evaluation with bias analysis', () => {
    // 1. Login as student
    cy.loginAsStudent();
    
    // 2. Navigate to available courses
    cy.get('[data-cy="available-courses-link"]').click();
    
    // 3. Enroll in course
    cy.get('[data-cy="course-card"]').first().within(() => {
      cy.get('[data-cy="enroll-button"]').click();
    });
    
    // 4. Verify enrollment
    cy.get('[data-cy="success-message"]').should('contain', 'Inscrito exitosamente');
    
    // 5. Navigate to evaluation
    cy.navigateToStudentEvaluation();
    
    // 6. Select course and text
    cy.get('[data-cy="course-select"]').select(0);
    cy.get('[data-cy="text-card"]').first().click();
    
    // 7. Read text
    cy.get('[data-cy="text-content"]').should('be.visible');
    
    // 8. Answer question
    cy.get('[data-cy="question-card"]').first().within(() => {
      cy.get('[data-cy="answer-input"]').type('El pensamiento crítico es fundamental para analizar información de manera objetiva.');
      cy.get('[data-cy="submit-answer-button"]').click();
    });
    
    // 9. Analyze biases
    cy.get('[data-cy="analyze-bias-button"]').click();
    
    // 10. Verify bias analysis modal
    cy.get('[data-cy="bias-modal"]').should('be.visible');
    cy.get('[data-cy="bias-score"]').should('exist');
    cy.get('[data-cy="bias-level"]').should('exist');
    cy.get('[data-cy="recommendations"]').should('exist');
  });
});
```

#### Scenario 3: Chatbot Interaction

```typescript
describe('Student Chatbot Interaction', () => {
  it('should interact with chatbot and receive contextual responses', () => {
    // 1. Login and navigate to evaluation
    cy.loginAsStudent();
    cy.navigateToStudentEvaluation();
    
    // 2. Select course and text
    cy.get('[data-cy="course-select"]').select(0);
    cy.get('[data-cy="text-card"]').first().click();
    
    // 3. Open chatbot
    cy.get('[data-cy="chatbot-open-button"]').click();
    cy.get('[data-cy="chatbot-window"]').should('be.visible');
    
    // 4. Send message
    cy.get('[data-cy="chatbot-message-input"]').type('¿Qué es el pensamiento crítico?');
    cy.get('[data-cy="chatbot-send-button"]').click();
    
    // 5. Wait for response
    cy.get('[data-cy="chatbot-messages"]', { timeout: 15000 })
      .children()
      .should('have.length.greaterThan', 1);
    
    // 6. Verify response is contextual
    cy.get('[data-cy="chatbot-messages"]')
      .last()
      .should('contain.text', 'pensamiento');
  });
});
```


## Performance Considerations

### 1. Test Execution Speed

**Optimizations:**
- Usar `cy.session()` para cachear autenticación entre tests
- Minimizar navegación innecesaria entre páginas
- Usar API calls directos para setup cuando sea posible
- Evitar esperas fijas (cy.wait con tiempo)
- Ejecutar tests en paralelo cuando sea posible

**Example: Session Caching**
```typescript
Cypress.Commands.add('loginAsTeacher', () => {
  cy.session('teacher-session', () => {
    cy.visit('/login');
    cy.fixture('users').then((users) => {
      cy.get('[data-cy="email-input"]').type(users.teacher.email);
      cy.get('[data-cy="password-input"]').type(users.teacher.password);
      cy.get('[data-cy="login-button"]').click();
      cy.url().should('include', '/app');
    });
  });
});
```

### 2. Resource Management

**Screenshots:**
- Solo capturar en fallos (screenshotOnRunFailure: true)
- Comprimir screenshots para ahorrar espacio
- Limpiar screenshots antiguos periódicamente

**Videos:**
- Deshabilitar videos en desarrollo (video: false)
- Habilitar solo en CI (video: true en CI)
- Configurar calidad de video apropiada

**Network:**
- Interceptar y mockear requests lentas cuando sea apropiado
- Usar fixtures para respuestas predecibles
- Configurar timeouts apropiados

### 3. CI/CD Integration

**GitHub Actions Example:**
```yaml
name: Cypress E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Cypress tests
        uses: cypress-io/github-action@v5
        with:
          working-directory: critico-mern
          browser: chrome
          record: true
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
          CYPRESS_BASE_URL: https://proyecto.yamycorp.com
      
      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: critico-mern/cypress/screenshots
      
      - name: Upload videos
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: cypress-videos
          path: critico-mern/cypress/videos
```


## Security Considerations

### 1. Credential Management

**Environment Variables:**
```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    env: {
      teacherEmail: process.env.CYPRESS_TEACHER_EMAIL,
      teacherPassword: process.env.CYPRESS_TEACHER_PASSWORD,
      studentEmail: process.env.CYPRESS_STUDENT_EMAIL,
      studentPassword: process.env.CYPRESS_STUDENT_PASSWORD,
    },
  },
});
```

**Best Practices:**
- Nunca commitear credenciales en el código
- Usar variables de entorno para credenciales
- Usar usuarios de prueba dedicados (no usuarios reales)
- Rotar credenciales periódicamente
- Limitar permisos de usuarios de prueba

### 2. Test Data Security

**Considerations:**
- No usar datos sensibles reales en tests
- Usar datos ficticios pero realistas
- Limpiar datos de prueba después de ejecución
- No exponer tokens o API keys en logs

### 3. Production Testing Safety

**Safeguards:**
- Usar namespace específico para datos de prueba (prefijo "E2E Test -")
- Implementar cleanup automático
- Validar que estamos en entorno correcto antes de ejecutar
- Usar cuentas de prueba aisladas

```typescript
// Validación de entorno
before(() => {
  cy.visit('/');
  cy.url().should('include', 'proyecto.yamycorp.com');
  
  // Verificar que estamos usando usuarios de prueba
  cy.fixture('users').then((users) => {
    expect(users.teacher.email).to.include('test');
    expect(users.student.email).to.include('test');
  });
});
```

## Reporting and Monitoring

### 1. Test Reports

**Mochawesome Reporter:**
```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    charts: true,
    reportPageTitle: 'CRÍTICO E2E Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
  },
});
```

### 2. Metrics to Track

**Test Execution Metrics:**
- Total tests executed
- Pass/fail rate
- Average execution time per test
- Flaky test identification
- Coverage by feature

**Quality Metrics:**
- Number of bugs found
- Time to detect issues
- Test maintenance effort
- False positive rate

### 3. Dashboard Integration

**Cypress Cloud (Optional):**
- Real-time test results
- Historical trends
- Flaky test detection
- Parallelization analytics
- Video recordings

## Maintenance Strategy

### 1. Selector Maintenance

**Strategy:**
- Prefer `data-cy` attributes (most stable)
- Fallback to semantic selectors (role, label)
- Avoid CSS classes (prone to change)
- Document selector changes in PR descriptions

### 2. Test Updates

**When to Update:**
- UI changes that affect selectors
- New features added
- API changes
- Bug fixes that require new test cases

**Update Process:**
1. Identify affected tests
2. Update selectors/logic
3. Run tests locally
4. Verify in CI
5. Update documentation

### 3. Code Quality

**Standards:**
- Use TypeScript for type safety
- Follow consistent naming conventions
- Keep tests DRY (use custom commands)
- Add comments for complex logic
- Regular code reviews

**Linting:**
```json
// .eslintrc.json for Cypress
{
  "extends": [
    "plugin:cypress/recommended"
  ],
  "plugins": ["cypress"],
  "env": {
    "cypress/globals": true
  }
}
```

## Dependencies

### Required Packages

```json
{
  "devDependencies": {
    "cypress": "^13.6.0",
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "mochawesome": "^7.1.3",
    "mochawesome-merge": "^4.3.0",
    "mochawesome-report-generator": "^6.2.0",
    "eslint-plugin-cypress": "^2.15.1"
  }
}
```

### Version Compatibility

- Node.js: >= 18.x
- Cypress: >= 13.x
- TypeScript: >= 5.x
- Browser: Chrome >= 100, Firefox >= 100, Edge >= 100

## Risks and Mitigations

### Risk 1: Flaky Tests
**Impact:** High  
**Probability:** Medium  
**Mitigation:**
- Use proper waits and assertions
- Implement retry logic
- Isolate tests properly
- Monitor and fix flaky tests immediately

### Risk 2: Production Data Corruption
**Impact:** Critical  
**Probability:** Low  
**Mitigation:**
- Use dedicated test accounts
- Implement robust cleanup
- Add safeguards to prevent accidental data deletion
- Use unique identifiers for test data

### Risk 3: Slow Test Execution
**Impact:** Medium  
**Probability:** Medium  
**Mitigation:**
- Optimize test code
- Use parallelization
- Cache authentication
- Mock slow API calls when appropriate

### Risk 4: Maintenance Burden
**Impact:** Medium  
**Probability:** High  
**Mitigation:**
- Use stable selectors (data-cy)
- Create reusable commands
- Document test structure
- Regular refactoring

### Risk 5: False Positives/Negatives
**Impact:** High  
**Probability:** Low  
**Mitigation:**
- Write clear assertions
- Validate test logic thoroughly
- Review test failures carefully
- Maintain test quality standards
