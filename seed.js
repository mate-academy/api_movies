const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'movies_database',
    password: 'yojikyo',
    port: 5432,
});
client.connect();

client.query(
    `create table movies (
        id serial primary key,
        title text,
        release_year int
    );`,
    (err, res) => {
        console.log(err, res);
    }
);

client.query(`INSERT INTO movies (title, release_year) VALUES
    ('Toy Story', 1995),
    ('Monsters, Inc.', 2001),
    ('Finding Nemo', 2003),
    ('The Incredibles', 2004),
    ('Cars', 2006),
    ('Ratatouille', 2007),
    ('Telepusics', 2007);`,
    (err, res) => {
        console.log(err, res);
        client.end();
    }
);
