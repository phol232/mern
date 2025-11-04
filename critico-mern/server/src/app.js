const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const courseRoutes = require('./routes/course.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');
const biasRoutes = require('./routes/bias.routes');
const attemptRoutes = require('./routes/attempt.routes');

const app = express();

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Critico API Docs'
}));

app.use('/api', routes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/biases', biasRoutes);
app.use('/api/attempts', attemptRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: '¡Todo funciona correctamente!' });
});

app.use((req, res, next) => {
  next(createError(404, 'Recurso no encontrado'));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Error interno del servidor',
    details: err.errors || undefined
  });
});

module.exports = app;
