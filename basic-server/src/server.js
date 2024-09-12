const build = require('./app');
const env = require("./config/env");

const app = build(
    { logger: true },
    {
        openapi: {
            info: {
                title: "library API",
                description: "Library management",
                version: "0.1.0"
            },
            servers: [
                { url: 'http://localhost:3000', description: 'development server' }
            ],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                        description: 'Enter the JWT token'
                    }
                }
            },
        }
    },
    {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false,
        }
    },
    { connectionString: env.POSTGRES_DB_CONNECTION },
    { host: 'http://localhost:3001' }
);

app.listen({ port: 3000, host: "localhost" }, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
});