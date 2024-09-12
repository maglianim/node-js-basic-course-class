const createUserOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                username: { type: 'string', minLength: 3, maxLength: 100 },
                password: { type: 'string', minLength: 8, maxLength: 100 },
                role: { type: 'string', enum: ['admin', 'normal'] }
            },
            required: ['username', 'password', 'role'],
        }
    }
}

const createUserOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                username: { type: 'string', minLength: 3, maxLength: 100 },
                password: { type: 'string', minLength: 8, maxLength: 100 },
                role: { type: 'string', enum: ['admin', 'normal'] }
            },
            required: ['username', 'password', 'role'],
        }
    }
}

module.exports = { createUserOpts };

