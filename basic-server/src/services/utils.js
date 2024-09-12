

function checkRead(reply, operation) {
    return checkOperation(reply, operation, 'read');
}
function checkWrite(reply, operation) {
    return checkOperation(reply, operation, 'write');
}
function checkDelete(reply, operation) {
    return checkOperation(reply, operation, 'delete');
}

function checkOperation(reply, operation, value) {
  if (!operation.includes(value)) {
    reply.code(403).send();
  }
}

module.exports = { checkRead, checkWrite, checkDelete }