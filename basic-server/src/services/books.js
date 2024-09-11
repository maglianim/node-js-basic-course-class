const fastify = require("fastify");

async function readBooks(pg, params) {
    const client = await pg.connect();
    const paramValues = [];
    try {
        let sqlString = `Select id, title, author, isbn, published_year
            FROM books `;
        if (params.author || params.publicationYear) {
            sqlString += "WHERE 1=1"

            if (params.author) {
                sqlString += ` AND author = $${paramValues.length + 1}`;
                paramValues.push(params.author); 
            }
            if (params.publicationYear) {
                sqlString += ` AND published_year = $${paramValues.length + 1}`;
                paramValues.push(params.publicationYear);  
            }
        }

        sqlString += ` ORDER BY published_year ${params.sortByYear === 'asc' ? 'asc': 'DESC'}`
        sqlString += ` LIMIT ${params.pagination.pageSize} OFFSET ${params.pagination.pageSize * (params.pagination.pageNumber -1) }`;
        console.log(sqlString);
        const { rows } = await client.query(sqlString, paramValues);
        // console.log('result-->', rows);
        return Promise.resolve(rows);
    }
    finally {
        client.release();
    }
}

async function readBookById(pg, id) {
    const client = await pg.connect();
    const paramValues = [];
    try {
        let sqlString = `Select id, title, author, isbn, published_year
            FROM books where id = $1 `;
        const { rows } = await client.query(sqlString, [id]);
        // console.log('result-->', rows);
        return Promise.resolve(rows.length > 0 ? rows[0] : undefined);
    }
    finally {
        client.release();
    }
}

async function createBook(pg, params) {
    
    const client = await pg.connect();
    let paramValues = [];
    try {
        let sqlString = `insert into books (title, author, isbn, published_year)
        values ($1, $2, $3, $4)
        RETURNING id;`;
        paramValues = [params.book.title, params.book.author, params.book.isbn, params.book.published_year];
        const { rows } = await client.query(sqlString, paramValues);
        return Promise.resolve(rows[0].id);
    }
    finally {
        client.release();
    }    
}

async function deleteBook(pg, id) {
    const client = await pg.connect();
    const paramValues = [];
    try {
        let sqlString = `DELETE FROM books where id = $1 `;
        const { rowCount } = await client.query(sqlString, [id]);
        return Promise.resolve(rowCount);
    }
    finally {
        client.release();
    }
}

async function updateBook(pg, params) {
    const client = await pg.connect();
    let paramValues = [];
    try {
        let sqlString = `update books SET 
        title = $1,
        author = $2,
        isbn = $3,
        published_year = $4
        WHERE id = $5`;

        paramValues = [params.book.title, params.book.author, params.book.isbn, params.book.published_year, params.id];
        const { rowCount } = await client.query(sqlString, paramValues);
        return Promise.resolve(rowCount);
    }
    finally {
        client.release();
    }        
}

module.exports = {
    readBooks,
    readBookById,
    createBook,
    deleteBook,
    updateBook,
};