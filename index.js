const { Client } = require('pg');
const express = require('express');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'People',
  password: '8991Genius8991',
  port: 5432
});
client.connect();
const app = express();

app.get('/movies', (request, response) => {
  client.query('SELECT * FROM movies ORDER BY release',
    (err, result) => {
    response.send(result.rows);
  });
});

app.get('/movies/:id(\\d+)', (request, response) => {
  client.query('SELECT * FROM movies WHERE id = $1',
    [request.params.id],
    (err, result) => {
    if (result.rows.length === 0) {
      response.sendStatus(404);
    } else {
      response.send(result.rows[0]);
    }
  });
});

app.get('/movies/titles', (request, response) => {
  client.query('SELECT title FROM movies',
    (err, result) => {
    response.send(result.rows.map(movie => movie.title).join('\n'));
  });
});

app.get('/movies/titlesByYear/:year(\\d+)', (request, response) => {
  client.query('SELECT title FROM movies WHERE release = $1 ORDER BY title;',
    [request.params.year],
    (err, result) => {
        if (result.rows.length === 0) {
          response.sendStatus(404);
        } else {
          response.send(result.rows.map(movie => movie.title).join('\n'));
        }
    });
});

app.post('/movies/:year(\\d+)/:title', (request, response) => {
  client.query('INSERT INTO movies (title, release) VALUES ($1, $2) RETURNING id;',
    [request.params.title, request.params.year],
    (err, result) => {
      response.send(`id: ${result.rows[0].id}`);
    });
});

app.put('/movies/:id(\\d+)/:year(\\d+)/:title', (request, response) => {
  client.query('UPDATE movies SET release = $2, title = $3 WHERE id = $1',
    [request.params.id, request.params.year, request.params.title],
    (err, result) => {
      response.json(result["rowCount"]);
    });
});

app.delete('/movies/:id(\\d+)', (request, response) => {
  client.query('DELETE FROM movies WHERE id = $1;',
    [request.params.id],
    (err, result) => {
      response.json(result["rowCount"]);
    });
});

process.on('exit', () => {
  client.end();
});

app.listen(3000);