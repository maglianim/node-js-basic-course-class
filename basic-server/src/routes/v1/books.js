const fastify = require('fastify');
const { readBooks, readBookById, createBook, deleteBook, updateBook } = require("../../services/books");
const { checkRead, checkWrite, checkDelete } = require("../../services/utils");
const { readBooksOpts, readBookOpts, createBookOpts, deleteBookOpts, updateBookOpts } = require("../../schemas/books");
const { isAllDigits } = require("../../utils/utils");
const booksRoutes = async (fastify) => {
    fastify.get('/', {
        ...readBooksOpts,
        preHandler: async (request, reply) => {
            checkRead(reply, request.user.operations)
        }
    }, async (request, reply) => {
        try {
            const { author, publicationYear, sortByYear, pageSize, pageNumber } = request.query; 
            const params = {
                author,
                publicationYear,
                sortByYear,
                pagination: {
                    pageSize,
                    pageNumber
                },
            }
            reply.send(await readBooks(fastify.pg, params))
        }
        catch (e) {
            reply.code(500).send("Internal error reading books");
        }
    });
    
    fastify.get('/:id', {
        ...readBookOpts, 
        preHandler: async (request, reply) => {
            checkRead(reply, request.user.operations)
        }
    }, async (request, reply) => {
        try {
            const row = await readBookById(fastify.pg, request.params.id);
            if (!row) {
                reply.code(404).send('row not found');
            }
            reply.send(await readBookById(fastify.pg, request.params.id))
        }
        catch (e) {
            reply.code(500).send("Internal error reading book");
        }
    });

    fastify.put('/:id', {
        ...updateBookOpts,
        preHandler: async (request, reply) => {
            checkWrite(reply, request.user.operations)
        }
     }, async (request, reply) => {
        try {
            const { title, author, isbn, published_year } = request.body;
            if (!isAllDigits(isbn)) {
                reply.code(400).send('isbn not valid must be all digits');
            }
            const params = {
                id: request.params.id,
                book: {
                    title,
                    author,
                    isbn,
                    published_year,
                },
            };
            const rowCount = await updateBook(fastify.pg, params);
            if (rowCount > 0) {
                reply.send(await readBookById(fastify.pg, request.params.id));
            }            
            reply.code(404).send('row not found');
            
        }
        catch (e) {
            console.log(e);
            reply.code(500).send("Internal error updating books");
        }
    });

    fastify.post('/', {
        ...createBookOpts, 
        preHandler: async (request, reply) => {
            checkWrite(reply, request.user.operations)
        }
    }, async (request, reply) => {
        try {
            const { title, author, isbn, published_year } = request.body;
            if (!isAllDigits(isbn)) {
                reply.code(400).send('isbn not valid must be all digits');
            }
            const params = {
                book: {
                    title,
                    author,
                    isbn,
                    published_year,
                },
            };            
            const newId = await createBook(fastify.pg, params);
            reply.code(201).send(await readBookById(fastify.pg, newId));
        }
        catch (e) {
            reply.code(500).send("Internal error creating books");
        }
    });

    fastify.delete('/:id', {
        preHandler: async (request, reply) => {
            checkDelete(reply, request.user.operations)
        }
    }, async (request, reply) => {
        try {
            const rowCount = await deleteBook(fastify.pg, request.params.id);
            if (rowCount > 0) {
                reply.send(true)
            }            
            reply.code(404).send('row not found');
            
        }
        catch (e) {
            reply.code(500).send("Internal error creating books");
        }
    });


};

module.exports = booksRoutes;