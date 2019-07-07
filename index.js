const express = require('express');
const { Client } = require('pg');

const app = express();

const client = new Client;
client.connect();

app.get('/mov', (req, res) => {
  client.query('SELECT * FROM movies ORDER BY release_year', (err, result) => {
    res.json(result.rows);
  });
});

app.get('/mov/:id(\\d+)', (req, res) => {
  client.query('SELECT title FROM movies WHERE id = $1',[req.params.id], (err, result) => {
    if (result.rows.length === 0) {
      res.sendStatus(404);
    } else {
     res.send(result.rows[0])
    }
  });
});

app.get('/mov/titles', (req, res) => {
  client.query('SELECT title FROM movies ORDER BY title', (err, result) => {
    res.send(result.rows.map(row => row.title).join('\n'));
  });
});

app.get('/mov/titlesByYear/:year(\\d+)', (req, res) => {
  client.query('SELECT title FROM movies  WHERE release_year = $1 ORDER BY title', [req.params.year],
    (err, result) => {
    res.send(result.rows.map(row => row.title).join('\n'));
    });
});

app.post('/mov/:year(\\d+)/:title', (req, res) => {
  client.query('INSERT INTO movies (title, release_year) VALUES ($1, $2) RETURNING id',
    [req.params.title, req.params.year], (err, result) => {
     res.json(result.rows[0].id);
    });
});

app.put('/mov/:id(\\d+)/:year(\\d+)/:title', (req, res) => {
  client.query('UPDATE movies SET title = $1, release_year = $2 WHERE id = $3',
    [req.params.title, req.params.year, req.params.id], (arr, result) => {
      res.json(result.rowCount);
    })
});

app.delete('/mov/:id(\\d+)', (req, res) => {
  client.query('DELETE FROM movies WHERE id = $1', [req.params.id],
    (arr, result) => {
    res.json(result.rowCount);
    });
});

process.on('exit', () => {
  client.end();
});

app.listen(3000);
