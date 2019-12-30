const uuidv4 = require('uuid/v4');

function generateShortUUID() {
  return uuidv4().split('-', 1)[0];
}

function generateUUID() {
  return uuidv4();
}

function generateLongUUID() {
  return uuidv4();
}

module.exports = { generateShortUUID, generateUUID, generateLongUUID };
