const { Client } = require('pg');
const client = new Client({
  user: "postgres",
  host: 'localhost',
  password: '********',
  database: 'imdb',
  port: 5432
});

client.connect();

process.on('exit', () => {
  client.end();
});

module.exports = client;
