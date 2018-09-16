const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const database = require('./database');

const theatersRouter = require('./routers/theaters');
const reservationsRouter = require('./routers/reservations');

var urlEncodedParser = bodyParser.urlencoded({
    extended: false
});

database.connect('mongodb://localhost:27017/theaterReservation', 'theaterReservation').then(() => {
    app.listen(4200, () => {
        console.log('Theater reservations is listening on localhost:4200');
    });
}).catch((error) => {
    console.error(error);
    res.json({
        'error': `[${error}]!`
    });
});

app.get('/', (req, res) => {
    res.json({
        'stub': `[${req.originalUrl}] Endpoint works! `
    });
});

app.use('/theaters', (req, res, next) => {
    next();
}, theatersRouter);

app.use('/reservations', (req, res, next) => {
    next();
}, reservationsRouter);