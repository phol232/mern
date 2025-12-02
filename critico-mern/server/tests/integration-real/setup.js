// filepath: d:\TallerProyectos2\mern\critico-mern\server\tests\integration-real\setup.js
// Setup para pruebas de integración REALES (sin mocks)

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const mongoose = require('mongoose');

// URI para tests: usa localhost en lugar de 'mongo' (para ejecutar fuera de Docker)
const MONGO_TEST_URI = process.env.MONGO_TEST_URI || 
  'mongodb://root:root@localhost:27017/critico_test?authSource=admin';

const connectTestDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_TEST_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Conectado a MongoDB Test');
  }
};

const disconnectTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

const clearTestDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await connectTestDB();
  }
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    try {
      await collections[key].deleteMany({});
    } catch (error) {
      console.warn(`No se pudo limpiar ${key}:`, error.message);
    }
  }
};

module.exports = {
  connectTestDB,
  disconnectTestDB,
  clearTestDB,
  MONGO_TEST_URI
};
