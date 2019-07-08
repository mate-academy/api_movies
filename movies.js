const express = require('express');
const router = express.Router();
const client = require('./db');

router.get('/', (req, res) => {
    client.query('select * from movies order by release_year;',
        (error, result) => {
        res.json(result.rows);
    });
});

router.get('/:movieId(\\d+)', (req, res) => {
    client.query('select * from movies c id = $1',
        [req.params.movieId],
        (err, result) => {
        if (result.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.json(result.rows[0]);
        }
    });
});

router.get('/titles', (req, res) => {
    client.query('select title from movies order by title ',
        (err, result) => {
        res.json(result.rows)
    });
});

router.get('/titles/:year(\\d+)', (req, res) => {
    client.query('select title from movies where release_year = $1 order by title',
        [req.params.year],
        (err, result) => {
        res.json(result.rows)
    });
});

router.post('/:year(\\d+)/:title', (req, res) => {
    const { title, year} = req.params;
    client.query('insert into movies ("title", "release_year") values ($1, $2) returning id',
        [title, year],
        (err, result) => {
        res.json(result.rows[0]);
    });
});

router.put('/:id(\\d+)/:title/:year(\\d+)', (req, res) => {
    const { title, year, id} = req.params;
    client.query('update movies set title = $1, release_year = $2 where id = $3',
        [title, year, id],
        (err, result) => {
        res.json(result.rowCount);
    });
});

router.delete('/:id(\\d+)', (req, res) => {
    client.query('delete from movies where id = $1',
        [req.params.id],
        (err, result) => {
        res.json(result.rowCount);
    })
});


module.exports = router;