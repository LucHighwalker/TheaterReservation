const theaters = require('express').Router();
const database = require('../database');
const bodyParser = require('body-parser');

const urlEncodedParser = bodyParser.urlencoded({
    extended: false
});

theaters.get('/', (req, res) => {
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

theaters.post('/new', urlEncodedParser, (req, res) => {
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

theaters.get('/:id', (req, res) => {
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

theaters.post('/:id/reserve', urlEncodedParser, (req, res) => {
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

module.exports = theaters;