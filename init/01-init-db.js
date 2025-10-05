// ============================================
// Script de Inicialización de MongoDB
// Base de datos: critico
// Colecciones: users, courses, texts, questions
// ============================================

// Cambiar a la base de datos 'critico'
db = db.getSiblingDB('critico');

print('📦 Iniciando creación de base de datos CRÍTICO...');

// ============================================
// 1. CREAR COLECCIONES
// ============================================
print('📋 Creando colecciones...');

db.createCollection('users');
db.createCollection('courses');
db.createCollection('texts');
db.createCollection('questions');
db.createCollection('questionattempts');
db.createCollection('enrollments');
db.createCollection('biases');
db.createCollection('progress');
db.createCollection('auditlogs');

print('✅ Colecciones creadas');

// ============================================
// 2. CREAR ÍNDICES
// ============================================
print('🔍 Creando índices...');

// Índices en users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Índices en courses
db.courses.createIndex({ teacher: 1 });
db.courses.createIndex({ isActive: 1 });

// Índices en texts
db.texts.createIndex({ course: 1 });

// Índices en questions
db.questions.createIndex({ text: 1 });
db.questions.createIndex({ course: 1 });

// Índices en questionattempts
db.questionattempts.createIndex({ student: 1, question: 1, createdAt: -1 });
db.questionattempts.createIndex({ student: 1 });

// Índices en enrollments
db.enrollments.createIndex({ student: 1, course: 1 }, { unique: true });

print('✅ Índices creados');

// ============================================
// 3. INSERTAR DATOS DE EJEMPLO (OPCIONAL)
// ============================================
print('👤 Insertando usuarios de ejemplo...');

// Usuario Administrador
db.users.insertOne({
  name: 'Administrador Sistema',
  email: 'admin@critico.com',
  password: '$2a$10$Xj8xYrZxPzE5JN7K.wXhKO5WBaYn8OHKUf0YxHiJqQB.kR3vBW4mu', // password: admin123
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
});

// Usuario Docente
db.users.insertOne({
  name: 'Profesor Carlos Talavera',
  email: 'docente@critico.com',
  password: '$2a$10$Xj8xYrZxPzE5JN7K.wXhKO5WBaYn8OHKUf0YxHiJqQB.kR3vBW4mu', // password: admin123
  role: 'teacher',
  createdAt: new Date(),
  updatedAt: new Date()
});

// Usuario Estudiante
db.users.insertOne({
  name: 'Estudiante María López',
  email: 'estudiante@critico.com',
  password: '$2a$10$Xj8xYrZxPzE5JN7K.wXhKO5WBaYn8OHKUf0YxHiJqQB.kR3vBW4mu', // password: admin123
  role: 'student',
  createdAt: new Date(),
  updatedAt: new Date()
});

print('✅ Usuarios creados');
print('');
print('📊 CREDENCIALES DE ACCESO:');
print('===========================');
print('👤 Admin:');
print('   Email: admin@critico.com');
print('   Password: admin123');
print('');
print('👨‍🏫 Docente:');
print('   Email: docente@critico.com');
print('   Password: admin123');
print('');
print('👨‍🎓 Estudiante:');
print('   Email: estudiante@critico.com');
print('   Password: admin123');
print('');
print('✅ Base de datos CRÍTICO inicializada correctamente');
print('🌐 Mongo Express: http://localhost:8081 (admin/admin)');
