const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;

let db = null;

var urlEncodedParser = bodyParser.urlencoded({
    extended: false
});

MongoClient.connect('mongodb://localhost:27017/theaterReservation', {
    useNewUrlParser: true
}, (err, client) => {
    if (err) throw err

    db = client.db('theaterReservation');

    console.log('databse connected');

    app.listen(4200, () => {
        console.log('Theater reservations is listening on localhost:4200');
    });
});

app.get('/', (req, res) => {
    res.json({
        'stub': `[${req.originalUrl}] Endpoint works! `
    });
});

app.get('/theaters', (req, res) => {
    var theaters = db.collection('theaters');

    theaters.find({}).toArray((err, theaterList) => {
        console.log(theaterList);
    });
    //shows list of theaters
    res.json({
        'stub': `[${req.originalUrl}] Endpoint works! `
    });
});

app.post('/theaters/new', urlEncodedParser, (req, res) => {
    var newTheater = JSON.parse(JSON.stringify(req.body));

    var theaters = db.collection('theaters');

    theaters.insertOne({
        name: newTheater.name,
        seats: newTheater.seats,
        seatsAvailable: newTheater.seatsAvailable
    });

    console.log(newTheater);

    res.json({
        'stub': `[${req.originalUrl}] Endpoint works! `,
        'req': `{${newTheater}}`
    });
});

app.get('/theaters/:id', (req, res) => {
    var id = req.params.id;
    var theater = null;
    var theaters = db.collection('theaters');

    theaters.findOne(ObjectId(id))
        .then((resp) => {
            theater = resp;
            console.log(theater);
        });


    //shows specific theater
    res.json({
        'stub': `[${req.originalUrl}] Endpoint works! `
    });
});

app.post('/theaters/:id/reserve', urlEncodedParser, (req, res) => {
    var id = req.params.id;

    var row = req.body.row;
    var seat = req.body.seat;

    var theaters = db.collection('theaters');

    theaters.findOne({
            _id: ObjectId(id)
        })
        .then((resp) => {
            let theater = resp;
            if (theater.seats[row][seat] === 0) {
                theater.seats[row][seat] = 1;
                theater.seatsAvailable -= 1;
                theaters.findOneAndUpdate({
                    _id: ObjectId(id)
                }, {
                    $set: {
                        seats: theater.seats,
                        seatsAvailable: theater.seatsAvailable
                    }
                }, {
                    upsert: true
                }, (err, doc) => {
                    if (err) throw err

                    res.json({
                        'stub': `[${req.originalUrl}] Endpoint works! `,
                        'doc': `{${doc}}`
                    });
                });
            } else {
                res.json({
                    'stub': `[${req.originalUrl}] Endpoint works! `,
                    'res': `seat already reserved`
                });
            }
        }).catch((error) => {
            console.error(error);
            res.json({
                'stub': `[${req.originalUrl}] Endpoint works! `,
                'err': `{${error}}`
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