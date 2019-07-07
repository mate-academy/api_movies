const express = require('express');
const { Client } = require('pg');

const app = express();

const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }
);

client.connect();

app.get('/movies', (req, res) => {
    client.query('SELECT * FROM movies ORDER BY release_year;', (err, result) => {
        res.json(result.rows);
    });
});

app.get('/movies/:moviesId(\\d+)', (req, res) => {
    client.query('SELECT * FROM movies WHERE id = $1;', [req.params.moviesId], (err, result) => {
        if (result.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.json(result.rows);
        }
    });
});

app.get('/movies/title(\\w+)', (req, res) => {
    client.query('SELECT title FROM movies ORDER BY title;', (err, result) => {
        res.send(result.rows.map(row => row.title).join(' '));
    });
});

app.get('/movies/titlesByYear/:year(\\d{4})', (req, res) => {
    client.query('SELECT title FROM movies WHERE release_year = $1 GROUP BY title;',
        [req.params.year],
        (err, result) => {
            res.send(result.rows.map(row =>
                row.title + "<br />"
            ).join(''));
        });
});

app.post('/movies/:year(\\d{4})/:title(\\w+)', (req, res) => {
    client.query('INSERT  INTO movies (title, release_year) VALUES($1, $2) RETURNING id;',
        [req.params.title, req.params.year], (err, result) => {
            res.json(result.rows[0].id);
        });
});

app.put('/movies/:moviesId(\\d+)/:year(\\d{4})/:title(\\w+)', (req, res) => {
    client.query('Update movies SET title = $1, release_year = $2 WHERE id = $3;',
        [req.params.title, req.params.year, req.params.moviesId], (err, result) => {
            res.json(result.rowCount);
        });
});

app.delete('/movies/:moviesId(\\d+)', (req, res) => {
    client.query('DELETE FROM movies WHERE id = $1;',
        [req.params.moviesId], (err, result) => {
            res.json(result.rowCount);
        });
});

process.on('exit', () => {
    client.end();
});

app.listen(3000);
