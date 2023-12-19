const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

//A copy of this is in server.cjs, so that one worked but this didn't. But just don't delete this in case.
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentation',
      version: '1.0.0',
      description: 'Lost and Found App for the students of USC',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
      },
    ],
  },
  apis: [path.resolve(__dirname, 'server', 'server.cjs'), path.resolve(__dirname, 'server', 'swagger.cjs')],
};
const spec = swaggerJsdoc(options);


module.exports = spec;
