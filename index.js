const express = require('express');

const { Client } = require('pg');

const app = express();
const conString = "postgres://postgres:postgres@localhost:5432/api_movies";
const client = new Client(conString);

client.connect();

app.get('/movies', (req, res)=>{
    client.query('SELECT * FROM MOVIES ORDER BY release_year', (err, result)=>{
        res.json(result.rows)
    })
});

app.get('/movies/:id(\\d+)', (req, res)=>{
    client.query('SELECT * FROM movies WHERE id=$1', [req.params.id], (err, result)=>{
        result.rows.length ? res.json(result.rows[0]) : res.sendStatus(404)
    })
});

app.get('/movies/titles/', (req, res)=>{
    client.query('SELECT title FROM MOVIES ORDER BY title', (err, result)=>{
        res.json(result.rows)

    })
});


app.get('/movies/titlesByYear/:year(\\d+)', (req, res)=>{
    client.query('SELECT title FROM movies WHERE release_year=$1 ORDER BY title',
        [req.params.year], (err, result)=>{
        result.rows.length ? res.json(result.rows) : res.sendStatus(404)
    })
});

app.post('/movies/:year(\\d+)/:title', (req, res)=>{
    client.query('INSERT INTO movies (title, release_year) values($1, $2) returning id',
        [req.params.title, req.params.year], (err, result)=>{
        res.json(result.rows[0].id)
    })
});

app.put('/movies/:id(\\d+)/:year(\\d+)/:title', (req, res)=>{
    client.query('UPDATE movies SET release_year=$1, title=$2 WHERE id=$3  returning id',
        [req.params.year, req.params.title, req.params.id],
        (err, result)=>{
            res.json(result.rowCount)
        }
        )
});

app.delete('/movies/:id(\\d+)', (req, res)=>{
    client.query('DELETE FROM movies WHERE id=$1 returning id', [req.params.id], (err, result)=>{
        res.json(result.rowCount)
    })
});


process.on('exit', ()=>{
    client.end();
});
app.listen(3000);