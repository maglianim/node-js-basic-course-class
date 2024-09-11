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
            ]
        }
    },
    {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: 'full',
            deepLinking: false,
        }
    },
    { connectionString: env.POSTGRES_DB_CONNECTION }
);

app.listen({ port: 3000, host: "localhost" }, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
});