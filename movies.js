const express = require('express');
const router = express.Router();
const client = require('./db');

router.get('/movies', (req, res) => {
  client.query('SELECT * FROM movies ORDER BY release_year', (err, result) => {
    if (result.rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.json(result.rows);
    }
  });
});

router.get('/movies/:id(\\d+)', (req, res) => {
  client.query('SELECT * FROM movies WHERE id = $1', [req.params.id], (err, result) => {
    res.json(result.rows[0]);
  });
});

router.get('/movies/titles/', (req, res) => {
  client.query('SELECT title FROM movies ORDER BY title', (err, result) => {
    const titles = result.rows;
    const titleString = titles.map(item => item.title).join('\n');
    res.send(titleString);
  });
});

router.get('/movies/titlesByYear/:year', (req, res) => {
  client.query('SELECT title FROM movies WHERE release_year = $1 ORDER BY title', [req.params.year], (err, result) => {
    const titles = result.rows;
    const titleString = titles.map(item => item.title).join('\n');
    res.send(titleString);
  });
});

router.post('/movies/:year/:title', (req, res) => {
  client.query('INSERT INTO movies (title, release_year) VALUES ($1, $2) RETURNING id',
  [req.params.title, req.params.year], (err, result) => {
    const titles = result.rows;
    const titleString = titles.map(item => item.id).join('');
    res.send(titleString);
  });
});

router.put('/movies/:id/:year/:title', (req, res) => {
  client.query('UPDATE movies SET release_year = $1, title = $2 WHERE id = $3',
  [req.params.year, req.params.title, req.params.id], (err, result) => {
    res.json(result.rowCount);
  });
});

router.delete('/movies/:id', (req, res) => {
  client.query('DELETE FROM movies WHERE id = $1', [req.params.id], (err, result) => {
    res.json(result.rowCount);
  });
});

module.exports = router;
