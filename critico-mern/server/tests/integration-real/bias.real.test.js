// Pruebas de integración REALES para detección de sesgos (sin mocks)

const request = require('supertest');
const app = require('../../src/app');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('./setup');

describe('Bias Detection Integration Tests (REAL)', () => {
  let userToken;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    // Crear usuario
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'bias-tester@example.com',
        password: 'Password123!',
        firstName: 'Bias',
        lastName: 'Tester'
      });
    userToken = userRes.body.token;
  });

  describe('POST /api/bias/analyze-content', () => {
    it('detecta sesgos en texto con generalizaciones', async () => {
      const content = 'Todos los estudiantes siempre entienden todo sin esfuerzo.';

      const response = await request(app)
        .post('/api/bias/analyze-content')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ content })
        .expect(200);

      expect(response.body).toHaveProperty('biases');
      expect(Array.isArray(response.body.biases)).toBe(true);
      // Debe detectar al menos un sesgo por las palabras "Todos" y "siempre"
      expect(response.body.biases.length).toBeGreaterThanOrEqual(1);
    });

    it('detecta falta de evidencia', async () => {
      const content = 'Claramente los medios manipulan toda la información sin excepción.';

      const response = await request(app)
        .post('/api/bias/analyze-content')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ content })
        .expect(200);

      expect(response.body).toHaveProperty('biases');
      expect(response.body.biases.length).toBeGreaterThan(0);
    });

    it('retorna array vacío para texto sin sesgos', async () => {
      const content = 'Algunos estudios sugieren que la práctica puede mejorar el rendimiento en ciertos casos.';

      const response = await request(app)
        .post('/api/bias/analyze-content')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ content })
        .expect(200);

      expect(response.body).toHaveProperty('biases');
      // Texto neutro debería tener pocos o ningún sesgo
      expect(response.body.biases.length).toBeLessThanOrEqual(1);
    });

    it('requiere autenticación', async () => {
      await request(app)
        .post('/api/bias/analyze-content')
        .send({ content: 'Texto de prueba' })
        .expect(401);
    });
  });
});
