const client = require('./db');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  client.query('SELECT * FROM movies ORDER BY year', (err, result) => {
    res.send(result.rows);
  });
});

router.get('/:id(\\d+)', (req, res) => {
  client.query('SELECT * FROM movies WHERE id = $1', [req.params.id], (err, result) => {
    if (result.rows.length === 0) {
      res.status(404).send('not found')
    } else {
      res.send(result.rows[0])
    };
  });
});

router.get('/titlesByYear/:year(\\d+)', (req, res) => {
  client.query('SELECT movie FROM movies WHERE year = $1 ORDER BY movie', [req.params.year], (err, result) => {
   res.send(result.rows.map(item => item.movie).join('\n'));
  });
});

router.get('/titles', (req, res) => {
  client.query('SELECT movie FROM movies ORDER BY movie', (err, result) => {
    res.send(result.rows.map(item => item.title).join('/n'))
  });
});

router.post('/:year(\\d+)/:movie', (req, res) => {
  client.query('INSERT INTO movies (movie, year) VALUES($2, $1) RETURNING id', [req.params.year, req.params.movie], (err, result) => {
    res.json(result.rows[0].id);
  })
})

router.put('/:id(\\d+)/:year(\\d+)/movie', (req, res) => {
  client.query('UPDATE movies SET movie=$3, year=$2 WHERE id = $1', 
    [req.params.id, req.params.year, req.params.movie], (err, result) => {
      res.send(result.rowCount);
    });
});

router.delete('/:id(\\d+)', (req, res) => {
  client.query('DELETE movies WHERE id =$1', [req.params.id], (err, result) => {
    res.send(result.rowCount);
  });
});

module.exports = router;