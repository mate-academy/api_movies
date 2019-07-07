const { Client } = require('pg');

const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }
);

client.connect();

client.query(`
    create table movies (
        id serial primary key,
        title text,
        release_year int
    );`, (err, result) => {
    console.log(err, result);
});

client.query(`
    INSERT INTO MOVIES (title, release_year) VALUES 
    ('Casablanca', 1942),
    ('The Godfather', 1972),
    ('Raging Bull', 1980),
    ('Citizen Kane', 1941),
    ('Vertigo', 1958),
    ('Psycho', 1960),
    ('On the Waterfront', 1954);`,
    (err, result) => {
        console.log(err, result);
        client.end();
});
