const build = require('./auth-app');
const env = require("./config/env");

const AUTH_SRV_PORT = 3001;

const app = build(
    { logger: true },
    {
        openapi: {
            info: {
                title: "Auth API",
                description: "Authentication server",
                version: "0.1.0"
            },
            servers: [
                { url: 'http://localhost:3001', description: 'auth server' }
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
    { connectionString: env.POSTGRES_DB_CONNECTION },
    { secret: env.JWT_SECRET }
);

app.listen({ port: AUTH_SRV_PORT, host: "localhost" }, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
});