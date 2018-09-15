const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const ObjectId = require('mongodb').ObjectId;

const database = require('./database');

var urlEncodedParser = bodyParser.urlencoded({
    extended: false
});

database.connect('mongodb://localhost:27017/theaterReservation', 'theaterReservation').then(() => {
    app.listen(4200, () => {
        console.log('Theater reservations is listening on localhost:4200');
    });
}).catch((error) => {
    throw error;
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
        throw error;
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
        throw error;
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
        throw error;
    });
});

// app.post('/theaters/:id/reserve', urlEncodedParser, (req, res) => {
//     var id = req.params.id;

//     var row = req.body.row;
//     var seat = req.body.seat;

//     var theaters = db.collection('theaters');

//     theaters.findOne({
//             _id: ObjectId(id)
//         })
//         .then((resp) => {
//             let theater = resp;
//             if (theater.seats[row][seat] === 0) {
//                 theater.seats[row][seat] = 1;
//                 theater.seatsAvailable -= 1;
//                 theaters.findOneAndUpdate({
//                     _id: ObjectId(id)
//                 }, {
//                     $set: {
//                         seats: theater.seats,
//                         seatsAvailable: theater.seatsAvailable
//                     }
//                 }, {
//                     upsert: true
//                 }, (err, doc) => {
//                     if (err) throw err

//                     res.json({
//                         'stub': `[${req.originalUrl}] Endpoint works! `,
//                         'doc': `{${doc}}`
//                     });
//                 });
//             } else {
//                 res.json({
//                     'stub': `[${req.originalUrl}] Endpoint works! `,
//                     'res': `seat already reserved`
//                 });
//             }
//         }).catch((error) => {
//             console.error(error);
//             res.json({
//                 'stub': `[${req.originalUrl}] Endpoint works! `,
//                 'err': `{${error}}`
//             });
//         });
// });

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