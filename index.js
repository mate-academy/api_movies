const express = require('express');
const movies = require('./movies');

const app = express();
const bodyParsingMiddleware = express.urlencoded({extended: true});
app.use(bodyParsingMiddleware);

app.use('/movies', movies);

app.use((req, res) => {
    res.send('Not found!');
});
app.listen(3000, () => {
    console.log('Server start on port 3000');
});