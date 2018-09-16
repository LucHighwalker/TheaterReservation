const ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;

var db = null;

function connect(url, name) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, (err, client) => {
            if (err) {
                reject(err);
            } else {
                db = client.db(name);

                console.log('databse connected');
                resolve(db);
            }
        });
    });
}

function find(collection, id = null) {
    return new Promise((resolve, reject) => {
        let col = checkCol(collection);

        if (id !== null) {
            col.findOne(ObjectId(id), (err, resp) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(resp);
                }
            });
        } else {
            col.find({}).toArray((err, list) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(list);
                }
            });
        }
    });
}

function create(collection, item) {
    return new Promise((resolve, reject) => {
        let col = checkCol(collection);

        col.insertOne(item, (err, resp) => {
            if (err) {
                reject(err);
            } else {
                resolve(resp);
            }
        });
    });
}

function reserveSeat(id, rows, seats) {
    return new Promise((resolve, reject) => {
        var theaters = db.collection('theaters');
        var session = db.collection('sessions');

        var rowsArray = JSON.parse(rows);
        var seatsArray = JSON.parse(seats);

        if (rowsArray.length !== seatsArray.length) {
            reject({
                reason: 'array lengths do not match',
                row: rowsArray,
                seat: seatsArray
            });
        }

        find(theaters, id).then((theater) => {
            var theaterSess = theater;

            theaterSess._id = new ObjectId();

            console.log(theaterSess);

            for (var i = 0; i < rowsArray.length; i++) {
                let row = rowsArray[i];
                let seat = seatsArray[i];

                if (theaterSess.seats[row][seat] === 0) {
                    theaterSess.seats[row][seat] = 1;
                    theaterSess.seatsAvailable -= 1;
                } else {
                    reject({
                        reason: 'seat already reserved',
                        row: row,
                        seat: seat
                    });
                }
            }

            create(session, theaterSess).then((session) => {
                resolve(session.ops[0]._id);
            });
        }).catch((err) => {
            reject(err);
        });
    });
}


//helpers
function checkCol(collection) {
    return typeof collection === 'string' ? db.collection(collection) : collection;
}

module.exports = {
    connect: connect,
    find: find,
    create: create,
    reserveSeat: reserveSeat
};