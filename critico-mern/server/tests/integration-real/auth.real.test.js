// Pruebas de integración REALES para autenticación (sin mocks)

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/User');
const { connectTestDB, disconnectTestDB, clearTestDB } = require('./setup');

describe('Auth Integration Tests (REAL)', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('POST /api/auth/register', () => {
    it('registra un nuevo usuario correctamente', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('rechaza registro con email duplicado', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      };

      await request(app).post('/api/auth/register').send(userData).expect(201);
      const response = await request(app).post('/api/auth/register').send(userData).expect(409);
      expect(response.body.message).toMatch(/registrado/i);
    });

    it('rechaza registro con datos inválidos', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'invalid', password: '123', firstName: '', lastName: '' })
        .expect(422);

      expect(response.body).toHaveProperty('details');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        email: 'login@example.com',
        password: 'Password123!',
        firstName: 'Login',
        lastName: 'Test'
      });
    });

    it('inicia sesión correctamente', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@example.com', password: 'Password123!' })
        .expect(200);

      expect(response.body).toHaveProperty('token');
    });

    it('rechaza contraseña incorrecta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@example.com', password: 'Wrong123!' })
        .expect(401);

      expect(response.body.message).toMatch(/inválidas/i);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('envía instrucciones de recuperación', async () => {
      await request(app).post('/api/auth/register').send({
        email: 'recover@example.com',
        password: 'Password123!',
        firstName: 'Recover',
        lastName: 'Test'
      });

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'recover@example.com' })
        .expect(200);

      expect(response.body.message).toMatch(/instrucciones/i);
    });
  });
});
