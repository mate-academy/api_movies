const { Client } = require('pg');

const client = new Client();
client.connect();
process.on('exit', () => {
  client.end();
});

module.exports = client;
