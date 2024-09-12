const fastify = require('fastify');
const { createUser, login } = require("../../services/auth");
// const { readBooksOpts, readBookOpts, createBookOpts, deleteBookOpts, updateBookOpts } = require("../../schemas/books");
const { createUserOpts } = require("../../schemas/auth");
const authRoutes = async (fastify) => {
    
    
    // fastify.post('/:id', async (request, reply) => {
    //     reply.send(1);
    //     // try {
    //     //     /* const row = await readBookById(fastify.pg, request.params.id);
    //     //     if (!row) {
    //     //         reply.code(404).send('row not found');
    //     //     }
    //     //     reply.send(await readBookById(fastify.pg, request.params.id)) */
    //     // }
    //     // catch (e) {
    //     //     reply.code(500).send("Internal error reading book");
    //     // }
    // });

    fastify.post('/login/', async(request, reply) => {
        try {
            const { username, password } = request.body;
            const params = {
                username, password
            };     
            const ret = await login(fastify.pg, fastify.jwt, params);
            console.log('=====> LOGIN >>>>', ret);
            if (!ret) {
                reply.code(401).send("Bad login");
            }
            reply.code(200).send(ret);
        }
        catch (e) {
            console.log(e);
            reply.code(500).send("Internal error creating user");
        }
    })

    fastify.post('/signup/', createUserOpts, async (request, reply) => {
        try {
            const { username, password, role } = request.body;
            const params = {
                username, password, role
            };     
            await createUser(fastify.pg, params);
            reply.code(201).send();
        }
        catch (e) {
            console.log(e);
            reply.code(500).send("Internal error creating user");
        }
    });

    fastify.post('/verify/', async (request, reply) => {
        try {
            const { operations } = await request.jwtVerify();
            reply.send({ operations });
          } catch (err) {
            reply.send(err)
          }
    });

};

module.exports = authRoutes;