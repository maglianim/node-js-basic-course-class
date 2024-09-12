const fastify = require('fastify');
const fastifySwagger = require('@fastify/swagger');
const fastifySwaggerUi = require('@fastify/swagger-ui');
const fastifyPostgres = require("@fastify/postgres");

const booksRoutes = require('./routes/v1/books');
const healthCheck = require('./routes/v1/healthcheck');
const authRoutes = require('./routes/v1/auth');

const build = (opts={}, swaggerOpts={}, swaggerUiOpts={}, fastifyPostgresOpts={}) => {
    const app = fastify(opts);
// console.log(fastifyPostgresOpts);
    app.register(fastifySwagger, swaggerOpts);
    app.register(fastifySwaggerUi, swaggerUiOpts);
    app.register(fastifyPostgres, fastifyPostgresOpts);
    app.register(booksRoutes, { prefix: '/books' });
    app.register(healthCheck, { prefix: '/healthcheck' });

    return app;
}

const buildAuth = (opts={}, swaggerOpts={}, swaggerUiOpts={}, fastifyPostgresOpts={}) => {
    const authApp = fastify(opts);
    authApp.register(fastifySwagger, swaggerOpts);
    authApp.register(fastifySwaggerUi, swaggerUiOpts);
    authApp.register(authRoutes, { prefix: '/auth' });

    return authApp
}

module.exports = build;