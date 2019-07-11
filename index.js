const express = require('express');
const app = express();

require('dotenv').config();

const { Client } = require('pg');
const client = new Client();
client.connect();

app.use(express.urlencoded({ extended: true }));

app.get('/movies', (req, res) => {
  client.query('SELECT * FROM movies ORDER BY year', (err, result) => {
    if (result.rows.length) {
      res.json(result.rows);
    } else {
      res.status(404).send('Movies not found');
    }
  });
});

app.get('/movies/:moviesId(\\d+)', (req, res) => {
  client.query('SELECT * FROM movies WHERE id = $1', [req.params.moviesId], (err, result) => {
    if (result && result.rows.length) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Movie not found');
    }
  });
});

app.get('/movies/titles', (req, res) => {
  client.query('SELECT title FROM movies ORDER BY title ASC', (err, result) => {
    console.log(err);
    if (result && result.rows.length) {
      res.send(result.rows.map(movie => movie.title).join('\n'));
    } else {
      res.status(404).send('Movies not found');
    }
  });
});

app.get('/movies/titlesByYear/:year(\\d+)', (req, res) => {
  client.query(
    'SELECT title FROM movies WHERE year = $1 ORDER BY title ASC',
    [req.params.year],
    (err, result) => {
      console.log(err);
      if (result && result.rows.length) {
        res.send(result.rows.map(movie => movie.title).join('\n'));
      } else {
        res.status(404).send('Movies not found');
      }
    }
  );
});

app.post('/movies/:year(\\d+)/:title', (req, res) => {
  client.query(
    'INSERT INTO movies (title, year) VALUES ($1, $2) RETURNING id',
    [req.params.title, req.params.year],
    (err, result) => {
      if (result && result.rows.length) {
        res.send(result.rows[0].id.toString());
      } else {
        res.send(err);
      }
    }
  );
});

app.put('/movies/:id(\\d+)/:year(\\d+)/:title', (req, res) => {
  client.query(
    'UPDATE movies SET title = $1, year = $2 WHERE id = $3 RETURNING id',
    [req.params.title, req.params.year, req.params.id],
    (err, result) => {
      if (result) {
        res.send(result.rows.length.toString());
      } else {
        res.send(err);
      }
    }
  );
});

app.delete('/movies/:id(\\d+)', (req, res) => {
  client.query('DELETE FROM movies WHERE id = $1 RETURNING id', [req.params.id], (err, result) => {
    if (result) {
      res.send(result.rows.length.toString());
    } else {
      res.send(err);
    }
  });
});

process.on('exit', () => {
  client.end();
});

app.listen(3000);
