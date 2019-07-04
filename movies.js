const express = require('express');
const router = express.Router();
const client = require('./db');

router.get('/movies', (req, res) => {
  client.query('SELECT * FROM author_movies ORDER BY year', (err, result) => {
    res.json(result.rows);
  });
});

router.get('/movies/:id(\\d+)', (req, res) => {
  client.query('SELECT * FROM  author_movies WHERE id=$1', [req.params.id], (err, result) => {
    if (result.rows.length) {
      res.json(result.rows[0]);
    } else {
      res.sendStatus('404');
    }
  });
});

router.get('/movies/title', (req, res) => {
  client.query('SELECT * FROM author_movies ORDER BY title', (err, result) => {
    result.rows.length ? res.json(result.rows) : res.sendStatus(404);
  });
});

router.get('/movies/titlesByYear/:year(\\d+)', (req, res) => {
  client.query('SELECT title FROM author_movies WHERE year = $1 ORDER BY title', [req.params.year], (err, result) => {
    result.rows.length ? res.json(result.rows) : res.sendStatus(404);
  });
});

router.post('/movies/:year(\\d+)/:title', (req, res) => {
  client.query('INSERT INTO author_movies (title, year) VALUES ($1, $2) RETURNING id', [req.params.title, req.params.year], (err, result) => {
    res.json(result.rows[0].id);
  });
});

router.put('/movies/:id(\\d+)/:year(\\d+)/:title', (req, res) => {
  client.query('UPDATE author_movies SET title = $3, year = $2 WHERE id = $1',
    [req.params.id, req.params.year, req.params.title], (err, result) => {
      res.json(result.rowCount);
    });
});

router.delete('/movies/:id(\\d+)', (req, res) => {
  client.query('DELETE FROM author_movies WHERE id=$1', [req.params.id], (err, result) => {
    res.json(result.rowCount);
  });
});

module.exports = router;
