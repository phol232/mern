// filepath: d:\TallerProyectos2\mern\critico-mern\server\jest.integration.config.js
// Configuración de Jest para pruebas de integración REALES (sin mocks)

const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname),
  testEnvironment: 'node',
  testMatch: ['**/tests/integration-real/**/*.test.js'],
  testTimeout: 30000,
  setupFilesAfterEnv: [],
  // NO usamos mocks - conexión real a MongoDB
  collectCoverage: false,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true
};
