const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Critico MERN API',
      version: '1.0.0',
      description: 'API para la plataforma de pensamiento crítico Critico MERN',
      contact: {
        name: 'API Support',
        email: 'support@critico.com'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            details: {
              type: 'object'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      },
      {
        cookieAuth: []
      }
    ]
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../controllers/*.js')
  ]
};

const swaggerSpec = swaggerJsdoc(options);

// Debug: mostrar cuántas rutas se encontraron
if (process.env.NODE_ENV !== 'production') {
  const paths = Object.keys(swaggerSpec.paths || {});
  console.log(`📚 Swagger encontró ${paths.length} rutas documentadas`);
}

module.exports = swaggerSpec;
