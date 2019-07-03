const express = require('express');
const { Client } = require('pg');
const app = express();
const client = new Client();

client.connect();
app.get('/movies', (req, res) => {
    client.query('SELECT * FROM movies ORDER BY year ASC', (err, result) => {
        res.json(result.rows);
    });
});

app.get('/movies/:id(\\d+)', (req, res) => {
    client.query('SELECT * FROM movies WHERE id = $1', [req.params.id], (err, result) => {
        res.json(result.rows);
    });
});

app.get('/movies/titles', (req, res) => {
    client.query('SELECT title FROM movies ORDER BY title ASC', (err, result) => {
        if (result.rows.length) {
            res.json(result.rows);
        } else {
            res.sendStatus(404)
        }
    });
});

app.get('/movies/titlesByYear/:year(\\d+)', (req, res) => {
    client.query('SELECT title FROM movies WHERE year = $1 ORDER BY title ASC', [req.params.year], (err, result) => {
        res.json(result.rows);
    });
});

app.post('/movies/:year(\\d+)/:title', (req, res) => {
    client.query('INSERT INTO movies (title, year) VALUES($1, $2) RETURNING id', [req.params.title, req.params.year], (err, result) => {
        res.json(result.rows[0].id);
    });
});

app.put('/movies/:id(\\d+)/:year(\\d+)/:title', (req, res) => {
    client.query('UPDATE movies SET title = $2, year = $3 WHERE id = $1',
    [req.params.id, req.params.title, req.params.year], (err, result) => {
        res.json(result.rowCount);
    });
});

app.delete('/movies/:id(\\d+)', (req, res) => {
    client.query('DELETE FROM movies WHERE id = $1', [req.params.id], (err, result) => {
        res.json(result.rowCount);
    });
});

process.on('exit', () => {
    client.end();
});

app.listen(3000);
