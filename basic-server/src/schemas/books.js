const MAX_YEAR = 2024;
const MIN_YEAR = -800;

const book = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        title: { type: 'string' },
        author: { type: 'string' },
        isbn: { type: 'string' },
        published_year: { type: 'number' }
    }
}

const bookNotFoundResponse = { 
    type: 'object', 
    properties: { 
        statusCode: { type: 'integer' },
        error: { type: 'string' },
        message: { type: 'string' },
        example: { statusCode: 404, error: "Not Found", message: "The book you r are looking for does not exist" }
    }
}

const readBookOpts = {
    schema: {
        params: {
            id: { type: 'string' }
        },
        response: {
            200: book,
            404: bookNotFoundResponse
        }
    }
};

const readBooksOpts = {
    schema: {
        querystring: {
            type: 'object',
            properties: {
                author: { type: 'string' },
                publicationYear: { type: 'number', maximum: MAX_YEAR, minimum: MIN_YEAR },
                pageSize: {type: 'number', minimum: 1, maximum: 10},
                pageNumber: { type: 'number', minimum: 1 },
                sortByYear: { type: 'string', enum: ['asc', 'desc'] }
            },
            required: ['pageSize', 'pageNumber'],
        },
        response: {
            200: { type: 'array', items: book }
        }
    }
}

const createBookOpts = {
    schema: {
        body: {
            type: 'object',
            required: ['title', 'author', 'isbn', 'published_year'],
            properties: {
                title: { type: 'string' },
                author: { type: 'string' },
                isbn: { type: 'string', minLength: 10, maxLength: 13 },
                published_year: { type: 'number', maximum: MAX_YEAR, minimum: MIN_YEAR }
            }
        },
        response: {
            201: book
        }
    }
}

const updateBookOpts = {
    schema: {
        params: {
            id: { type: 'string' }
        },
        body: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                author: { type: 'string' },
                isbn: { type: 'string', minLength: 10, maxLength: 13 },
                published_year: { type: 'number', maximum: MAX_YEAR, minimum: MIN_YEAR }
            },
            required: ['title', 'author', 'isbn', 'published_year']
        },
        response: {
            200: book
        }
    }
}

const deleteBookOpts = {
    schema: {
        response: {
            204: {}
        }
    }
}

module.exports = { readBookOpts, readBooksOpts, createBookOpts, deleteBookOpts, updateBookOpts };

