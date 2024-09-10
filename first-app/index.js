const { getRandomContact } = require('./contacts');
const {sendEmail} = require('./send-email');
const {sendCall} = require('./call');
const {CALL_DELAY_MSEC, MESSAGE_DELAY_MSEC} = require('./config');


function main() {
  const mailInterval = setInterval(() => {
  sendEmail(getRandomContact());
  }, MESSAGE_DELAY_MSEC);
  
  const callInterval = setInterval(() => {
      sendCall(getRandomContact());
  }, CALL_DELAY_MSEC);
  
  // at some point interval should be cleared!
}


main();
