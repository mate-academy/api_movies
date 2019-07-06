const queries = {
    getAllMovies: {
        text: 'SELECT * FROM movies ORDER BY release_year;',
    },
    getMovieById: {
        text: 'SELECT * FROM movies WHERE id = $1;',
    },
    getAllTitles: {
        text: 'SELECT title FROM movies ORDER BY title;',
    },
    getTitlesByYear: {
        text: `
            SELECT title FROM movies
                WHERE release_year = $1 ORDER BY title;
        `,
    },
    insertNewMovie: {
        text: `
            INSERT INTO movies(title, release_year)
                VALUES ($1, $2) RETURNING id;
        `,
    },
    updateMovieById: {
        text: `
            WITH updated as (
                UPDATE movies SET (title, release_year) = ($2, $3)
                WHERE id = $1 RETURNING *
            ) SELECT count(*) FROM updated;
        `,
    },
    deleteMovieById: {
        text: `
            WITH updated as (
                DELETE FROM movies WHERE id = $1 RETURNING *
            ) SELECT count(*) FROM updated;
        `,
    },
};

module.exports = queries;
