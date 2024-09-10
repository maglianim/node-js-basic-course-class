 const contacts = [
    'j.doe@acme.com',
    'a.doe@acme.com',
    'b.doe@acme.com',
    'c.doe@acme.com',
    'd.doe@acme.com',
    'e.doe@acme.com',
    'f.doe@acme.com',
    'g.doe@acme.com',
];

function getRandomContact() {
    const idx = Math.floor(Math.random() * contacts.length);

    return contacts[idx];
}

module.exports = { getRandomContact };