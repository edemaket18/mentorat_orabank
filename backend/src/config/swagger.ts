import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Mentorat Orabank Togo',
      version: '1.0.0',
      description: 'API pour la plateforme de mentorat des stagiaires',
      contact: {
        name: 'Support alpha080API',
        email: 'supportalpha080API@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Serveur de développement'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts']
};

export const specs = swaggerJsdoc(options);
