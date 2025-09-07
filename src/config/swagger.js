
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Service API',
            version: '1.0.0',
            description: 'API documentation for the User Service',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                CreateUser: {
                    type: 'object',
                    required: ['name', 'email'],
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The user\'s full name.'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'The user\'s unique email address.'
                        },
                        age: {
                            type: 'integer',
                            description: 'The user\'s age (optional).'
                        }
                    },
                    example: {
                        name: 'Jane Doe',
                        email: 'jane.doe@example.com',
                        age: 28
                    }
                },
                UpdateUser: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The user\'s new full name.'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'The user\'s new unique email address.'
                        },
                        age: {
                            type: 'integer',
                            description: 'The user\'s new age.'
                        }
                    },
                    example: {
                        name: 'Jane A. Doe',
                        age: 29
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'The auto-generated unique ID of the user.'
                        },
                        name: {
                            type: 'string',
                            description: 'The user\'s full name.'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'The user\'s unique email address.'
                        },
                        age: {
                            type: 'integer',
                            description: 'The user\'s age.'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'The timestamp of when the user was created.'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'The timestamp of when the user was last updated.'
                        }
                    },
                    example: {
                        _id: '60d21b4667d0d8992e610c85',
                        name: 'Jane Doe',
                        email: 'jane.doe@example.com',
                        age: 28,
                        createdAt: '2023-10-27T10:00:00.000Z',
                        updatedAt: '2023-10-27T10:00:00.000Z'
                    }
                },
                UserResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        data: {
                            type: 'object',
                            properties: {
                                user: {
                                    $ref: '#/components/schemas/User'
                                }
                            }
                        }
                    }
                },
                UserListResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            example: 'success'
                        },
                        results: {
                            type: 'integer',
                            description: 'The number of users returned in the current page.',
                            example: 2
                        },
                        data: {
                            type: 'object',
                            properties: {
                                users: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/User'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
