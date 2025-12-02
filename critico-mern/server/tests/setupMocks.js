// filepath: d:\TallerProyectos2\mern\critico-mern\server\tests\setupMocks.js
// Este archivo se carga ANTES de los tests para configurar los mocks

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';

jest.mock('supertest', () => require('./support/apiClient'));
jest.mock('helmet', () => () => (req, res, next) => next());
jest.mock('cors', () => () => (req, res, next) => next());
jest.mock('cookie-parser', () => () => (req, res, next) => next());
jest.mock('morgan', () => () => (req, res, next) => next());
