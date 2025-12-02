// filepath: d:\TallerProyectos2\mern\critico-mern\server\tests\integration-real\courses.real.test.js
// Pruebas de integración REALES para cursos (sin mocks)

const request = require('supertest');
const app = require('../../src/app');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('./setup');

describe('Courses Integration Tests (REAL)', () => {
  let teacherToken;
  let studentToken;
  let teacherId;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    // Crear profesor
    const teacherRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'teacher@example.com',
        password: 'Password123!',
        firstName: 'Teacher',
        lastName: 'Test',
        role: 'teacher'
      });
    teacherToken = teacherRes.body.token;
    teacherId = teacherRes.body.user._id;

    // Crear estudiante
    const studentRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'student@example.com',
        password: 'Password123!',
        firstName: 'Student',
        lastName: 'Test',
        role: 'student'
      });
    studentToken = studentRes.body.token;
  });

  describe('POST /api/courses', () => {
    it('permite a profesores crear cursos', async () => {
      const courseData = {
        title: 'Pensamiento Crítico 101',
        description: 'Curso introductorio de pensamiento crítico'
      };

      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send(courseData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe(courseData.title);
      expect(response.body.owner).toBe(teacherId);
    });

    it('rechaza creación de cursos por estudiantes', async () => {
      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Curso No Autorizado',
          description: 'No debería crearse'
        })
        .expect(403);

      expect(response.body.message).toMatch(/autorizado|permiso/i);
    });

    it('rechaza creación sin autenticación', async () => {
      await request(app)
        .post('/api/courses')
        .send({
          title: 'Curso Sin Auth',
          description: 'No debería crearse'
        })
        .expect(401);
    });
  });

  describe('GET /api/courses/mine', () => {
    it('retorna cursos del usuario autenticado', async () => {
      // Crear un curso primero
      await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          title: 'Mi Curso',
          description: 'Descripción del curso'
        });

      const response = await request(app)
        .get('/api/courses/mine')
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      expect(response.body[0].title).toBe('Mi Curso');
    });
  });
});
