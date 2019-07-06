const express = require('express');

const app = express();
app.use(express.json())

const movies = require('./movies');
app.use('/api/movies', movies);

app.use((req, res, next) => {
  res.send('NOT Found!');
});
app.listen(3000)
