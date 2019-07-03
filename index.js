const express = require('express');
const app = express();
const client = require('./client');

app.get('/movies', (req, res) => {
    client.query('SELECT * FROM movies ORDER BY year', (err, result) => {
        res.json(result.rows);
    });
});

app.get('/movies/:id(\\d+)', (req, res) => {
    client.query('SELECT * FROM movies WHERE id = $1',
        [req.params.id],
        (err, result) => {
            if (result.rows.length === 0) {
                res.sendStatus(404);
            } else {
                res.json(result.rows[0]);
            }
        });
});

app.get('/movies/titles', (req, res) => {
    client.query('SELECT title FROM movies ORDER BY title',
        (err, result) => {
            res.send(result.rows.map(film => film.title).join('\n'));
        });
});

app.get('/movies/titlesByYear/:year(\\d{4})', (req, res) => {
    client.query('SELECT title FROM movies WHERE year = $1 ORDER BY title',
        [req.params.year],
        (err, result) => {
            res.send(result.rows.map(film => film.title).join('\n'));
        });
});

app.post('/movies/:year(\\d{4})/:title', (req, res) => {
    client.query('INSERT INTO movies (title, year) VALUES ($1, $2) RETURNING id',
        [req.params.title, req.params.year],
        (err, result) => {
            res.json(result.rows[0].id);
        });
});

app.put('/movies/:id(\\d+)/:year(\\d{4})/:title', (req, res) => {
    client.query('UPDATE movies SET title = $1, year = $2 WHERE id = $3',
        [req.params.title, req.params.year, req.params.id],
        (err, result) => {
            res.json(result.rowCount);
        });
});

app.delete('/movies/:id(\\d+)', (req, res) => {
    client.query('DELETE FROM movies WHERE id = $1',
        [req.params.id],
        (err, result) => {
            res.json(result.rowCount);
        });
});

app.listen(3000);
