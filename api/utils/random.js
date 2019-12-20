const uuidv4 = require('uuid/v4');

function generateShortUUID() {
  return uuidv4().split('-', 1)[0];
}

module.exports = { generateShortUUID };
