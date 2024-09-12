const bcrypt = require('bcrypt');

const SALT = 10

// const saltRounds = 10;
// const hashedPassword = await bcrypt.hash(password, saltRounds);


async function createUser(pg, params) {
    if (await userExists(pg, params.username)) {
        throw new Error("user already exists");
    }
    const client = await pg.connect();
    let paramValues = [];
    try {
        const hashedPassword = await bcrypt.hash(params.password, SALT);
        let sqlString = `insert into users (username, password, role)
        values ($1, $2, $3)
        RETURNING id;`;
        console.log('--------------', sqlString);
        paramValues = [params.username, hashedPassword, params.role];
        const { rows } = await client.query(sqlString, paramValues);
        return Promise.resolve(rows[0].id);
    }
    finally {
        client.release();
    }    
}


async function login(pg, jwt, params) {
    const user = await getUser(pg, params.username);
    if (!user) {
        return Promise.resolve(undefined);
    }
    if (!await bcrypt.compare(params.password, user.password)) {
        return Promise.resolve(undefined);
    }
    return Promise.resolve(issueNewToken(jwt, user));
}


function issueNewToken(jwt, user) {
    const operations = user.role === 'admin' ? ['read', 'write', 'delete'] : ['read'];
    return jwt.sign({ name: user.username, id: user.id, role: user.role, operations }, { expiresIn: '1d' });
}

async function getUser(pg, username) {
    const client = await pg.connect();
    const paramValues = [];
    try {
        let sqlString = `Select id, username, password, role FROM users where username = $1 `;
        const { rows } = await client.query(sqlString, [username]);
        // console.log('result-->', rows);
        return Promise.resolve(rows.length > 0 ? rows[0] : undefined);
    }
    finally {
        client.release();
    }
}


async function userExists(pg, username) {
    const user = await getUser(pg, username);
    if (user) {
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}


module.exports = { createUser, login }