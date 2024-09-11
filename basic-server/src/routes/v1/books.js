const fastify = require('fastify');
const { readBooks, readBookById, createBook, deleteBook, updateBook } = require("../../services/books");
const { readBooksOpts, readBookOpts, createBookOpts, deleteBookOpts, updateBookOpts } = require("../../schemas/books");

const booksRoutes = async (fastify) => {
    fastify.get('/', readBooksOpts, async (request, reply) => {
        try {
            const {author, publicationYear, sortByYear, pageSize, pageNumber } = request.query; 
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
    
    fastify.get('/:id', readBookOpts, async (request, reply) => {
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

    fastify.put('/:id', updateBookOpts, async (request, reply) => {
        try {
            const { title, author, isbn, published_year } = request.body;
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

    fastify.post('/', createBookOpts, async (request, reply) => {
        try {
            const { title, author, isbn, published_year } = request.body;

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

    fastify.delete('/:id', async (request, reply) => {
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