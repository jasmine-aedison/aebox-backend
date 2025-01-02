const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      openapi: '3.0.0',
      title: 'API Documentation',
      description: 'API documentation for the project.',
      version: '1.0.0',
    },
    host: 'localhost:5001',
    basePath: '/',
  },
  apis: ['./routes/*.js'], // Points to controller files for JSDoc comments
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
