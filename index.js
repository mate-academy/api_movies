const express = require('express');
const app = express();
const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'api_movies',
  password: '7197',
  port: 5432,
})

client.connect()
// 4.
app.get('/movies', (req, res) => {
  client.query(`select * from movies order by id`, (err, result) => {
    res.json(result.rows);
  });
});

// 5.
app.get('/movies/:id(\\d+)', (req, res) => {
  client.query(`select * from movies where id = $1`, [req.params.id], (err, result) => {
    if (result.rowCount === 0) {
      res.sendStatus('404');
    } else {
      res.send(result.rows[0]);
    }
  });
});

// 6.
app.get('/movies/titles', (req, res) => {
  client.query(`select title from movies order by title`, (err, result) => {
    const text = result.rows.map(row => `<p>${row.title}</p>`);
    const textToSend = text.join('');
    res.send(textToSend);
  });
});

// 7.
app.get('/movies/titlesByYear/:year', (req, res) => {
  client.query(`select title from movies where year = $1`, [req.params.year], (err, result) => {
    if (!result.rows.length) {
      res.send('No matches');
    } else {
      const text = result.rows.map(row => `<p>${row.title}</p>`);
    const textToSend = text.join('');
    res.send(textToSend);
    }
  });
});

// 8.
app.post('/movies/:year/:title', (req, res) => {
  client.query(`insert into movies (title, year)
                values ($2, $1) returning id`, 
                [req.params.year, req.params.title], (err, result) => {
    res.json(result.rows[0].id);
  });
});

app.put('/movies/:id/:year/:title', (req, res) => {
  client.query(`update movies set title = $3, year = $2 where id = $1`, 
                [req.params.id, req.params.year, req.params.title], (err, result) => {
    res.json(result.rowCount);
  });
});

app.delete('/movies/:id', (req, res) => {
  client.query(`delete from movies where id = $1`, 
                [req.params.id], (err, result) => {
    res.json(result.rowCount);
  });
});

process.on('exit', () => {
  client.end();
});

app.listen(3000);
