# Movies API

1.  Fork this repo, clone the fork, and initialize a Node app in the folder. Add `node_modules` to `.gitignore`. Install `express` and `pg` to the folder.

2.  Using your favorite DB client, design and create a database table called `movies` that would store the following information on each movie:

        - title of the movie,
        - release year of the movie.

    Insert the SQL generated by your client here:

    ```postgresql
    CREATE TABLE movies
    (
      id SERIAL,
      title text NOT NULL,
      year integer NOT NULL,
      CONSTRAINT movies_pkey PRIMARY KEY (id)
    )
    ```

    [Seed](https://en.wikipedia.org/wiki/Database_seeding) the table.

3.  Create a template `index.js` (or `app.js`, etc.) where you import the Express and PostgreSQL libraries and properly initialize them to connect to the DB and listen to a port to serve requests; do close the DB connection on exit.

4.  Create a GET API on `movies` that returns all the rows from the table, ordered by the release year, as JSON.

5.  Create a GET API on `movies/<id>` that retrieves the single row corresponding to the movie with the provided ID. If there is no such movie, return 404.

6.  Create a GET API on `movies/titles` that returns the titles of all the movies, ordered alphabetically, as plain text (titles to be separated with a linebreak).

7.  Create a GET API on `movies/titlesByYear/<year>` that returns the titles of all the movies released in the given year, ordered alphabetically, as plain text (separating titles with a linebreak).

8.  Create a POST API on `movies/<year>/<title>` that inserts a new movie with the provided title and release year into the table and returns a single number as plain text — the ID of the new movie.

9.  Create a PUT API on `movies/<id>/<year>/<title>` that updates the given row with the provided title and year. For the response, return the number of updated rows (either 0 or 1) as plain text.

10. Create a DELETE API on `movies/<id>` that removes the specified movie from the table. For the response, return the number of deleted rows (either 0 or 1) as plain text.

Make sure your server is fault-tolerant and will continue to serve clients even after receiving an invalid request. For instance, if the string "im-a-text-not-a-number" is passed as a release year for a movie, the server shouldn’t crash.
