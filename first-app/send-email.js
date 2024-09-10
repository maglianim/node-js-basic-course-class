const config = require('./config');
const { getRandomContact } = require('./contacts');

function sendEmail(contact) {
  console.log(`email sent to ${contact}`);
}

module.exports = { sendEmail };
