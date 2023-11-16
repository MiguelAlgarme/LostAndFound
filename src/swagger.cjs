const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LOST AND FOUND DOCUMENTATION',
      version: '1.0',
      description: 'App for finding lost possessions of users in USC',
    },
  },
  apis: ['./dist/*.js'],
};



const deets = swaggerJsdoc(options);

module.exports = deets;