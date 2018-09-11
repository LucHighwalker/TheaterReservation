const express = require('express');
const app = express();

var MongoClient = require('mongodb').MongoClient;

let db = null;

MongoClient.connect('mongodb://localhost:27017/theaterReservation', { useNewUrlParser: true }, function (err, client) {
  if (err) throw err

  db = client.db('theaterReservation');

  console.log('databse connected');
});

app.get('/', (req, res) => {
    res.json({'stub': `[${req.originalUrl}] Endpoint works! Replace me in Step 2.`});
});

app.get('/theaters', (req, res) => {
    //shows list of theaters
    res.json({'stub': `[${req.originalUrl}] Endpoint works! Replace me in Step 2.`});
});

app.get('/theaters/:id', (req, res) => {
    //shows specific theater
    res.json({'stub': `[${req.originalUrl}] Endpoint works! Replace me in Step 2.`});
});

app.post('/theaters/:id/reserve', (req, res) => {
    //reserves seat at theter
    res.json({'stub': `[${req.originalUrl}] Endpoint works! Replace me in Step 2.`});
});

app.get('/reservations', (req, res) => {
    //shows list of user's reservatiosn
    res.json({'stub': `[${req.originalUrl}] Endpoint works! Replace me in Step 2.`});
});

app.get('/reservations/:id', (req, res) => {
    //shows specific reservation
    res.json({'stub': `[${req.originalUrl}] Endpoint works! Replace me in Step 2.`});
});

app.listen(4200, () => {
    console.log('Theater reservations is listening on localhost:4200');
});