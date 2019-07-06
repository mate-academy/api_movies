const express = require('express');
const { Client } = require('pg');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'movies_database',
    password: 'yojikyo',
    port: 5432,
});
client.connect();
const sendResponceByQuery = (query, paramsNames, onAcceptQuery) => {
    return (request, response) => {
        query.values = paramsNames.map(name => request.params[name]);
        client.query(
            query,
            (error, result) => {
            if (error) {
                response.sendStatus(500);
                console.log(error);
            } else {
                onAcceptQuery(response, result);
            }
        });
    };
};

const app = express();

const queries = require('./queries');

app.get('/movies', sendResponceByQuery(
    queries.getAllMovies,
    [],
    (response, queryResult) => {
        response.json(queryResult.rows);
    }
));

app.get('/movies/:movieId(\\d+)', sendResponceByQuery(
    queries.getMovieById,
    ['movieId'],
    (response, queryResult) => {
        if (queryResult.rows.length === 0) {
            response.sendStatus(404);
        } else {
            response.json(queryResult.rows[0]);
        }
    }
));

app.get('/movies/titles', sendResponceByQuery(
    queries.getAllTitles,
    [],
    (response, queryResult) => {
        if (queryResult.rows.length === 0) {
            response.sendStatus(204);
        } else {
            response.send(queryResult.rows.reduce((resultText, { title }) => {
                return resultText + title + '<br>';
            }, ''));
        }
    }
));

app.get('/movies/titlesByYear/:year(\\d{4})', sendResponceByQuery(
    queries.getTitlesByYear,
    ['year'],
    (response, queryResult) => {
        if (queryResult.rows.length === 0) {
            response.sendStatus(204);
        } else {
            response.send(queryResult.rows.reduce((resultText, { title }, index, inputArray) => {
                return resultText + title + ';' + (index === inputArray.length ? '' : '<br>');
            }, ''));
        }
    }
));

app.post('/movies/:year(\\d{4})/:title', sendResponceByQuery(
    queries.insertNewMovie,
    ['title', 'year'],
    (response, queryResult) => {
        response.send(`Inserted with id = ${queryResult.rows[0].id}.`);
    }
));

app.put('/movies/:id(\\d+)/:year(\\d{4})/:title', sendResponceByQuery(
    queries.updateMovieById,
    ['id', 'title', 'year'],
    (response, queryResult) => {
        response.send(`Updated ${queryResult.rows[0].count} rows.`);
    }
));

app.delete('/movies/:id(\\d+)', sendResponceByQuery(
    queries.deleteMovieById,
    ['id'],
    (response, queryResult) => {
        response.send(`Deleted ${queryResult.rows[0].count} rows.`);
    }
));

process.on('exit', () => {
   client.end();
});

app.listen(3000);
