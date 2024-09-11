const fastify = require('fastify');

const booksRoutes = async (fastify) => {
    fastify.get('/', async (request, reply) => {
        reply.send({hello: 'matrix is dead.'})
    });
};

module.exports = booksRoutes;