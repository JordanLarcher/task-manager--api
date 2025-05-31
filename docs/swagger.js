const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager API',
            version: '1.0.0',
            description: 'Task Manager API Documentation'
        },
        servers: [
            {
                url: 'https://task-manager-api-o5w6.onrender.com',
            },
        ],
    },
    apis: [path.join(__dirname, '../routes/*.js')],
};

module.exports = swaggerJsdoc(swaggerOptions);