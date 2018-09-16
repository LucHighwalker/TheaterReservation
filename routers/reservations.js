const reservations = require('express').Router();
const database = require('../database');

reservations.get('/', (req, res) => {
    database.find('sessions').then((sessionList) => {
        console.log(sessionList);
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

reservations.get('/:id', (req, res) => {
    var id = req.params.id;

    database.find('sessions', id).then((session) => {
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

reservations.post('/:id/confirm', (req, res) => {
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

module.exports = reservations;