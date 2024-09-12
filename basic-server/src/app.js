const fastify = require('fastify');
const fastifySwagger = require('@fastify/swagger');
const fastifySwaggerUi = require('@fastify/swagger-ui');
const fastifyPostgres = require("@fastify/postgres");
const axios = require('axios');

const booksRoutes = require('./routes/v1/books');
const healthCheck = require('./routes/v1/healthcheck');

// const AUTH_SERVER_HOST = 'http://localhost:3001';


const build = (opts={}, swaggerOpts={}, swaggerUiOpts={}, fastifyPostgresOpts={}, authOpts={}) => {
    const app = fastify(opts);

// console.log(fastifyPostgresOpts);
    app.register(fastifySwagger, swaggerOpts);
    app.register(fastifySwaggerUi, swaggerUiOpts);
    app.register(fastifyPostgres, fastifyPostgresOpts);
    app.register(booksRoutes, { prefix: '/books' });
    app.register(healthCheck, { prefix: '/healthcheck' });

    app.addHook('preHandler', async (request, reply) => {
        const { authorization } = request.headers;
        const response = await axios.post(`${authOpts.host}/auth/verify/`, {}, {
            headers: { Authorization: authorization, 'content-type': 'application/json' }
        });
        request.user = response.data
    });


    return app;
}

module.exports = build;


/*
fastify.addHook('preHandler', async (request, reply) => {
  try {
    // 1. Estrarre l'header Authorization
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return reply.code(401).send({ error: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1]; // Rimuovere "Bearer" dal token
    if (!token) {
      return reply.code(401).send({ error: 'Token is missing' });
    }

    // 2. Invia il token all'API esterna per validarlo
    const response = await axios.post('https://external-auth-service.com/verify-token', {
      token: token
    });

    // 3. Se il token è valido, continuare con l'esecuzione della richiesta
    if (response.data.valid) {
      request.user = response.data.user; // Impostare i dati utente nella richiesta se necessario
    } else {
      return reply.code(401).send({ error: 'Invalid token' });
    }

  } catch (err) {
    console.error(err);
    return reply.code(500).send({ error: 'Token validation failed' });
  }
});

*/