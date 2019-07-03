const express = require('express');
const { Client } = require('pg');

const app = express();
const client = new Client();
client.connect();

app.get('/movies', (req, res) => {
  client.query('SELECT * FROM movies', (err, result) => {
    res.json(result.rows)
  })
});

app.get('/movies/:id(\\d+)', (req, res) => {
  client.query('SELECT * FROM movies WHERE id = $1', [req.params.id],(err, result) => {
    if(result.rows.length === 0) {
      res.status(404).send(`Sorry, we cannot find the movie with id ${req.params.id}!`)
    } else {
      res.json(result.rows[0])
    }
  });
});

app.get('/movies/titles', (req, res) => {
  client.query('SELECT title FROM public.movies ORDER BY title', (err, result) => {
    const titles = result.rows;
    const listTitle = titles.map(item => item.title);
    res.send(listTitle.join('\n'));
  })
});

app.get('/movies/titles/:year(\\d+)', (req, res) => {
  client.query('SELECT title FROM public.movies WHERE year = $1 ORDER BY title', 
    [req.params.year], (err, result) => {
      if(result.rows.length === 0) {
        res.status(404).send(`Sorry, we cannot find the movies released in ${req.params.year}!`)
      } else {
        const titles = result.rows;
        const listTitle = titles.map(item => item.title);
        res.send(listTitle.join('\n'));
      }
    })
});

app.post('/movies/:year(\\d+)/:title', (req, res) => {
  client.query('INSERT INTO public.movies ("title", "year") VALUES ($1, $2) RETURNING id', 
    [req.params.title, req.params.year], (err, result) => {
    res.json(result.rows[0].id)
  })
});

app.put('/movies/:id(\\d+)/:year(\\d+)/:title', (req, res) => {
  client.query('UPDATE public.movies SET title = $2, year = $3 WHERE id = $1', 
    [req.params.id, req.params.title, req.params.year], (err, result) => {
    res.json(result.rowCount)
  })
});

app.delete('/movies/:id(\\d+)', (req, res) => {
  client.query('DELETE FROM public.movies WHERE id = $1', [req.params.id], (err, result) => {
    if(result.rowCount === 0) {
      res.status(404).send(`Delete 0 movie`)
    } else {
      res.send(`Delete 1 movie`)
    }
  })
});
process.on('exit', () => {
  client.end();
});

app.listen(3000);
