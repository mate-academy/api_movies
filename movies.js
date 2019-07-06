const express = require('express');
const router = express.Router();
const client = require('./db');

router.get('/', (req, res) => {
  client.query('SELECT * FROM movies_table ORDER BY years', (err, result) => {
    res.json(result.rows);
  });
});

router.get('/:movieId(\\d+)', (req, res) => {
  client.query('SELECT * FROM movies_table WHERE id = $1', [req.params.movieId], (err, result) => {
    if (result.rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.json(result.rows[0]);
    }
  });
});

router.get('/titles', (req, res) => {
  client.query('SELECT title FROM movies_table ORDER BY title ASC', (err, result) => {
    res.json(result.rows.map(item => item.title).join("\n"))
  });
});

router.get('/titles/:year(\\d+)', (req, res) => {
  client.query('SELECT title from movies_table WHERE years = $1 ORDER BY title', [req.params.year], (err, result) => {
    res.json(result.rows.map(item => item.title).join("\n"))
  });
});

router.post('/:year(\\d+)/:title', (req, res) => {
  client.query('INSERT INTO movies_table ("title", "years") VALUES ($1, $2) RETURNING id', [req.params.title, req.params.year], (err, result) => {
    res.json(result.rows[0]);
  });
});

router.put('/:id(\\d+)/:title/:year(\\d+)', (req, res) => {
  client.query('UPDATE movies_table SET title = $1, years = $2 WHERE id = $3', [req.params.title, req.params.year, req.params.id], (err, result) => {
    res.json(result.rowCount);
  });
});

router.delete('/:id(\\d+)', (req, res) => {
  client.query('DELETE FROM movies_table WHERE id = $1', [req.params.id], (err, result) => {
    res.json(result.rowCount);
  })
})
module.exports = router;
