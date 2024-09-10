const config = require('./config');

function sendCall(contact) {
    console.log(`called customer: ${contact}`);
}

module.exports = { sendCall };