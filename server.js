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
}, function (err, client) {
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
        name: newTheater.name
    });

    console.log(newTheater);

    res.json({
        'stub': `[${req.originalUrl}]`,
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

app.post('/theaters/:id/reserve', (req, res) => {
    //reserves seat at theter
    res.json({
        'stub': `[${req.originalUrl}] Endpoint works! `
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