const fastify = require("fastify");

const healthCheck = async(fastify) => {
    fastify.get('/', async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
        const rows = await client.query("Select NOW()");
        reply.code(200).send(rows.rows[0].now);
    }
    catch{
        reply.code(500).send("broken you should refactor in GO!!");

    }
})
};

module.exports = healthCheck;