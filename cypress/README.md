# Cypress E2E Testing - CRÍTICO MERN

Este directorio contiene las pruebas end-to-end (E2E) para el sistema CRÍTICO MERN usando Cypress.

## Configuración Inicial

### Variables de Entorno

Las credenciales de prueba se configuran en el archivo `cypress.env.json` (no versionado en git).

Crea el archivo `cypress.env.json` en la raíz del proyecto con el siguiente contenido:

```json
{
  "teacherEmail": "docente.test@yamycorp.com",
  "teacherPassword": "TU_PASSWORD_AQUI",
  "studentEmail": "estudiante.test@yamycorp.com",
  "studentPassword": "TU_PASSWORD_AQUI",
  "adminEmail": "admin.test@yamycorp.com",
  "adminPassword": "TU_PASSWORD_AQUI",
  "apiUrl": "https://proyecto.yamycorp.com/api"
}
```

**Importante:** 
- Reemplaza los valores de password con las credenciales reales de los usuarios de prueba
- Estos usuarios deben existir en el sistema de producción
- Usa usuarios dedicados para pruebas, no usuarios reales

### Instalación

Las dependencias ya están instaladas si ejecutaste `npm install` en la raíz del proyecto.

Si necesitas instalar manualmente:

```bash
npm install --save-dev cypress typescript @types/node mochawesome mochawesome-merge mochawesome-report-generator eslint-plugin-cypress
```

## Ejecutar Tests

### Modo Interactivo (Desarrollo)

Abre la interfaz de Cypress para ejecutar tests de forma interactiva:

```bash
npm run cypress:open
```

### Modo Headless (CI/CD)

Ejecuta todos los tests en modo headless:

```bash
npm run cypress:run
```

### Ejecutar Tests Específicos

```bash
# Ejecutar solo tests de autenticación
npx cypress run --spec "cypress/e2e/auth/**/*.cy.ts"

# Ejecutar solo tests de docente
npx cypress run --spec "cypress/e2e/teacher/**/*.cy.ts"

# Ejecutar solo tests de estudiante
npx cypress run --spec "cypress/e2e/student/**/*.cy.ts"
```

## Estructura del Proyecto

```
cypress/
├── e2e/                    # Tests E2E organizados por módulo
│   ├── auth/              # Tests de autenticación ✅ IMPLEMENTADO
│   │   ├── login.cy.ts           # Tests de login exitoso y fallido
│   │   ├── register.cy.ts        # Tests de registro de usuarios
│   │   ├── logout.cy.ts          # Tests de cierre de sesión
│   │   └── route-protection.cy.ts # Tests de protección de rutas
│   ├── teacher/           # Tests de flujo de docente (pendiente)
│   ├── student/           # Tests de flujo de estudiante (pendiente)
│   └── bias-detection/    # Tests de detección de sesgos (pendiente)
├── fixtures/              # Datos de prueba reutilizables ✅
│   ├── users.json         # Credenciales de usuarios de prueba
│   ├── courses.json       # Datos de cursos de ejemplo
│   ├── texts.json         # Textos con y sin sesgos
│   ├── questions.json     # Preguntas de ejemplo
│   └── answers.json       # Respuestas de ejemplo
├── support/               # Comandos personalizados y configuración ✅
│   ├── commands.ts        # Comandos personalizados de Cypress
│   ├── e2e.ts            # Configuración global de tests
│   └── selectors.ts       # Selectores centralizados
├── downloads/             # Archivos descargados durante tests
├── screenshots/           # Screenshots de fallos (generados automáticamente)
├── videos/               # Videos de ejecución (generados automáticamente)
├── reports/              # Reportes HTML (generados automáticamente)
└── tsconfig.json         # Configuración de TypeScript para Cypress
```

## Reportes y Artefactos

Los reportes, screenshots y videos se generan automáticamente después de cada ejecución en modo headless.

### Ubicación de Artefactos

**Durante la ejecución:**
- Screenshots: `cypress/screenshots/`
- Videos: `cypress/videos/`
- Reportes: `cypress/reports/`

**Después de organizar:**
- Artefactos organizados: `cypress/artifacts/YYYY-MM-DD/YYYY-MM-DD_HH-MM-SS/`

### Ver Reportes

Los reportes HTML se encuentran en `cypress/reports/` y se pueden abrir directamente en el navegador.

### Generar Reporte Consolidado

```bash
# Generar reporte consolidado de todos los tests
npm run cypress:report

# Generar y abrir reporte en el navegador (macOS)
npm run cypress:report:open
```

### Organizar Artefactos por Fecha

Para mantener los artefactos organizados, puedes moverlos a una estructura de carpetas por fecha:

```bash
# Organizar artefactos actuales
npm run cypress:organize
```

Esto creará una estructura como:
```
cypress/artifacts/
└── 2025-11-11/
    └── 2025-11-11_14-30-45/
        ├── screenshots/
        ├── videos/
        ├── reports/
        └── summary.json
```

### Ejecutar Tests con Organización Automática

```bash
# Ejecutar tests y organizar artefactos automáticamente
npm run cypress:run:organized
```

### Limpiar Artefactos Antiguos

```bash
# Eliminar artefactos de más de 7 días
npm run cypress:clean:old

# Eliminar todos los artefactos
npm run cypress:clean
```

## Configuración

### cypress.config.ts

Configuración principal de Cypress:
- **baseUrl**: `https://proyecto.yamycorp.com/` (entorno de producción)
- **Timeouts**: 
  - defaultCommandTimeout: 10000ms
  - requestTimeout: 30000ms
  - responseTimeout: 30000ms
- **Retries**: 2 intentos en modo CI, 0 en modo interactivo
- **Screenshots**: Captura automática en fallos
- **Videos**: Grabación habilitada en CI, deshabilitada en desarrollo local
- **Reporter**: Mochawesome con reportes HTML y JSON
  - Reportes organizados por estado (pass/fail) y fecha
  - Screenshots embebidos en reportes
  - Gráficos y métricas de ejecución

### TypeScript

El proyecto usa TypeScript para los tests. La configuración está en `cypress/tsconfig.json`.

## Mejores Prácticas

1. **Selectores**: Usa atributos `data-cy` cuando estén disponibles
2. **Independencia**: Cada test debe ser independiente y no depender de otros
3. **Limpieza**: Limpia datos de prueba después de cada test
4. **Esperas**: Usa comandos con espera implícita, evita `cy.wait()` con tiempos fijos
5. **Fixtures**: Usa fixtures para datos de prueba consistentes
6. **Comandos personalizados**: Reutiliza lógica común en comandos personalizados

## Comandos Personalizados

Los comandos personalizados están implementados en `cypress/support/commands.ts` y simplifican la escritura de tests.

### Comandos de Autenticación

```typescript
// Login con credenciales específicas
cy.login('email@example.com', 'password');

// Login como docente (usa session caching)
cy.loginAsTeacher();

// Login como estudiante (usa session caching)
cy.loginAsStudent();

// Logout
cy.logout();
```

### Comandos de Navegación

```typescript
// Navegar a página de cursos
cy.navigateToCourses();

// Navegar a evaluación de estudiante
cy.navigateToStudentEvaluation();

// Navegar a gestión de estudiantes (docente)
cy.navigateToStudentManagement();

// Navegar a cursos disponibles (estudiante)
cy.navigateToAvailableCourses();
```

### Comandos de Creación de Datos

**Nota:** Estos comandos crean recursos via API y almacenan los IDs en aliases de Cypress.

```typescript
// Crear curso (ID almacenado en @createdCourseId)
cy.createCourse({
  title: 'Curso de Prueba',
  description: 'Descripción del curso',
  level: 'Básico'
});

// Usar el ID del curso creado
cy.get('@createdCourseId').then((courseId) => {
  // Crear tema en el curso (ID almacenado en @createdTopicId)
  cy.createTopic(courseId, {
    title: 'Tema 1',
    description: 'Descripción del tema',
    order: 1
  });
});

// Crear texto en un tema (ID almacenado en @createdTextId)
cy.get('@createdTopicId').then((topicId) => {
  cy.createText(topicId, {
    title: 'Texto de Prueba',
    content: 'Contenido del texto...',
    difficulty: 'intermediate',
    estimatedReadingTime: 5
  });
});

// Crear pregunta para un texto (ID almacenado en @createdQuestionId)
cy.get('@createdTextId').then((textId) => {
  cy.createQuestion(textId, {
    text: '¿Cuál es la idea principal?',
    type: 'literal',
    hint: 'Busca en el primer párrafo'
  });
});

// Inscribir estudiante en curso
cy.get('@createdCourseId').then((courseId) => {
  cy.enrollStudent(courseId);
});
```

### Comandos de Validación

```typescript
// Verificar análisis de sesgos (opcional: número esperado de sesgos)
cy.verifyBiasAnalysis(3); // Espera 3 sesgos
cy.verifyBiasAnalysis(0); // Espera sin sesgos
cy.verifyBiasAnalysis();  // Solo verifica que el análisis se muestre

// Verificar que curso aparece en lista
cy.verifyCourseInList('Nombre del Curso');

// Verificar que feedback fue generado
cy.verifyFeedbackGenerated();

// Verificar inscripción exitosa
cy.verifyEnrollmentSuccess();
```

### Comandos de Limpieza

```typescript
// Limpiar datos de prueba (elimina recursos con "E2E Test" o "Cypress Test" en el nombre)
cy.cleanupTestData();
```

### Ejemplo Completo

```typescript
describe('Teacher Course Creation', () => {
  beforeEach(() => {
    cy.loginAsTeacher();
  });

  afterEach(() => {
    cy.cleanupTestData();
  });

  it('should create course with text and question', () => {
    // Crear curso
    cy.createCourse({
      title: 'E2E Test - Pensamiento Crítico',
      description: 'Curso de prueba automatizada',
      level: 'Básico'
    });

    // Verificar en UI
    cy.navigateToCourses();
    cy.verifyCourseInList('E2E Test - Pensamiento Crítico');

    // Crear tema, texto y pregunta
    cy.get('@createdCourseId').then((courseId) => {
      cy.createTopic(courseId, { title: 'Tema 1' });
      
      cy.get('@createdTopicId').then((topicId) => {
        cy.createText(topicId, {
          title: 'Texto de Prueba',
          content: 'Contenido del texto...'
        });
        
        cy.get('@createdTextId').then((textId) => {
          cy.createQuestion(textId, {
            text: '¿Cuál es la idea principal?',
            type: 'literal'
          });
        });
      });
    });
  });
});
```

## Tests Implementados

### ✅ Módulo de Autenticación (auth/)

#### login.cy.ts
- ✅ Login exitoso con credenciales de docente
- ✅ Login exitoso con credenciales de estudiante
- ✅ Persistencia de autenticación después de recargar página
- ✅ Error con credenciales inválidas
- ✅ Error con campo de email vacío
- ✅ Error con campo de password vacío
- ✅ Error con email mal formado

#### register.cy.ts
- ✅ Registro exitoso de nuevo usuario estudiante
- ✅ Registro exitoso de nuevo usuario docente
- ✅ Error al registrar con email existente
- ✅ Error con formato de email inválido
- ✅ Error con contraseña débil
- ✅ Error con campos requeridos vacíos
- ✅ Navegación entre registro y login

#### logout.cy.ts
- ✅ Logout exitoso de docente
- ✅ Logout exitoso de estudiante
- ✅ Limpieza de datos de sesión al cerrar sesión
- ✅ Limpieza de cookies al cerrar sesión
- ✅ Interacción con botón de logout en navegación
- ✅ Logout desde diferentes páginas
- ✅ Bloqueo de acceso a rutas protegidas después de logout
- ✅ Requerimiento de re-login después de logout

#### route-protection.cy.ts
- ✅ Redirección a login al acceder /app sin autenticación
- ✅ Redirección a login al acceder /app/courses sin autenticación
- ✅ Redirección a login al acceder /app/students sin autenticación
- ✅ Redirección a login al acceder /app/student-evaluation sin autenticación
- ✅ Acceso permitido a rutas protegidas con autenticación
- ✅ Redirección con token inválido
- ✅ Acceso permitido a rutas públicas (/login, /register)
- ✅ Protección de rutas al acceder directamente via URL
- ✅ Navegación entre rutas protegidas manteniendo autenticación
- ✅ Protección al usar botón "atrás" del navegador

**Total: 40+ test cases implementados para autenticación**

## Fixtures

Los fixtures están disponibles en `cypress/fixtures/`:
- ✅ `users.json` - Credenciales de usuarios (docente, estudiante, admin)
- ✅ `courses.json` - Datos de cursos de ejemplo
- ✅ `texts.json` - Textos con y sin sesgos
- ✅ `questions.json` - Preguntas de ejemplo (literal, inferencial, crítica)
- ✅ `answers.json` - Respuestas de ejemplo con diferentes niveles de sesgos

## Troubleshooting

### Error: Cannot find module 'cypress'

Ejecuta `npm install` en la raíz del proyecto.

### Tests fallan por timeout

Aumenta los timeouts en `cypress.config.ts` si la red es lenta.

### No se pueden encontrar elementos

Verifica que los selectores sean correctos. Si el frontend no tiene atributos `data-cy`, usa selectores alternativos.

### Credenciales inválidas

Verifica que `cypress.env.json` tenga las credenciales correctas y que los usuarios existan en el sistema.

### Videos no se graban en desarrollo local

Esto es intencional. Los videos solo se graban en CI para ahorrar espacio. Si necesitas videos localmente, modifica `cypress.config.ts` y cambia `video: process.env.CI ? true : false` a `video: true`.

### Artefactos ocupan mucho espacio

Ejecuta `npm run cypress:clean:old` para eliminar artefactos de más de 7 días, o `npm run cypress:clean` para eliminar todos los artefactos.

## Quick Reference

### Comandos más usados

```bash
# Desarrollo
npm run cypress:open                    # Abrir Cypress UI
npm run cypress:run                     # Ejecutar todos los tests

# Reportes
npm run cypress:report                  # Generar reporte consolidado
npm run cypress:report:open             # Generar y abrir reporte

# Organización
npm run cypress:run:organized           # Ejecutar y organizar automáticamente
npm run cypress:organize                # Organizar artefactos existentes

# Limpieza
npm run cypress:clean                   # Eliminar todos los artefactos
npm run cypress:clean:old               # Eliminar artefactos antiguos (>7 días)
```

### Estructura de Artefactos Organizados

```
cypress/artifacts/
└── YYYY-MM-DD/                        # Fecha de ejecución
    └── YYYY-MM-DD_HH-MM-SS/          # Timestamp de ejecución
        ├── screenshots/               # Screenshots de fallos
        ├── videos/                    # Videos de ejecución
        ├── reports/                   # Reportes HTML y JSON
        └── summary.json              # Resumen de la ejecución
```

## Recursos

- [Documentación de Cypress](https://docs.cypress.io/)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [TypeScript Support](https://docs.cypress.io/guides/tooling/typescript-support)
- [Mochawesome Reporter](https://github.com/adamgruber/mochawesome)
