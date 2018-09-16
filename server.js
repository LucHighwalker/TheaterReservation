const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const database = require('./database');

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

app.get('/theaters', (req, res) => {
    database.find('theaters').then((theaterList) => {
        console.log(theaterList);
        res.json({
            'stub': `[${req.originalUrl}] Endpoint works! `
        });
    }).catch((error) => {
        console.error(error);
        res.json({
            'error': `[${error}]!`
        });
    });
});

app.post('/theaters/new', urlEncodedParser, (req, res) => {
    var newTheater = JSON.parse(JSON.stringify(req.body));

    database.create('theaters', newTheater).then((resp) => {
        console.log(resp);
        res.json({
            'stub': `[${req.originalUrl}] Endpoint works! `,
            'req': `{${newTheater}}`
        });
    }).catch((error) => {
        console.error(error);
        res.json({
            'error': `[${error}]!`
        });
    });
});

app.get('/theaters/:id', (req, res) => {
    var id = req.params.id;

    database.find('theaters', id).then((theater) => {
        console.log(theater);
        res.json({
            'stub': `[${req.originalUrl}] Endpoint works! `
        });
    }).catch((error) => {
        console.error(error);
        res.json({
            'error': `[${error}]!`
        });
    });
});

app.post('/theaters/:id/reserve', urlEncodedParser, (req, res) => {
    let id = req.params.id;

    let body = JSON.parse(JSON.stringify(req.body));

    var rows = JSON.parse(JSON.stringify(body.rows));
    var seats = JSON.parse(JSON.stringify(body.seats));

    database.reserveSeat(id, rows, seats).then((session) => {
        console.log(session);
        res.json({
            'stub': `[${req.originalUrl}] Endpoint works! `
        });
    }).catch((error) => {
        console.error(error);
        res.json({
            'error': `[${error}]!`
        });
    });
});

app.get('/reservations', (req, res) => {
    //shows list of user's reservatiosn
    res.json({
        'stub': `[${req.originalUrl}] Endpoint works! `
    });
});

app.get('/reservations/:id', (req, res) => {
    //shows specific reservation
    res.json({
        'stub': `[${req.originalUrl}] Endpoint works! `
    });
});

app.post('/reservations/:id/confirm', (req, res) => {
    let id = req.params.id;

    database.confirmReservation(id).then((resp) => {
        console.log(resp);
        res.json({
            'stub': `[${req.originalUrl}] Endpoint works! `
        });
    }).catch((error) => {
        console.error(error);
        res.json({
            'error': `[${error}]!`
        });
    });
});