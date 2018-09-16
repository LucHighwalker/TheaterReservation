const ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;

var db = null;

//collections
var theaters = null;
var sessions = null;

const sessExp = 86400000; // session expiration = 1 day

function connect(url, name) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, (err, client) => {
            if (err) {
                reject(err);
            } else {
                db = client.db(name);
                theaters = db.collection('theaters');
                sessions = db.collection('sessions');

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

function update(collection, id, update) {
    return new Promise((resolve, reject) => {
        let col = checkCol(collection);

        let data = {
            $set: update
        };

        col.findOneAndUpdate({
            _id: ObjectId(id)
        }, data, (err, resp) => {
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
            var date = new Date();
            var expiration = new Date(date.getTime() + sessExp);

            var theaterSess = theater;

            theaterSess.theaterId = theaterSess._id;
            theaterSess._id = new ObjectId();
            theaterSess.sessionCreation = date;
            theaterSess.sessionExpiration = expiration;
            theaterSess.seatsTaken = 0;

            for (var i = 0; i < rowsArray.length; i++) {
                let row = rowsArray[i];
                let seat = seatsArray[i];

                if (theaterSess.seats[row][seat] === 0) {
                    theaterSess.seats[row][seat] = 1;
                    theaterSess.seatsTaken += 1;
                } else {
                    reject({
                        reason: 'seat already reserved',
                        row: row,
                        seat: seat
                    });
                }
            }

            create(sessions, theaterSess).then((session) => {
                resolve(session.ops[0]._id);
            });
        }).catch((err) => {
            reject(err);
        });
    });
}

function confirmReservation(sessionId) {
    return new Promise((resolve, reject) => {
        find(sessions, sessionId).then((session) => {
            let expiration = session.sessionExpiration ? session.sessionExpiration : null;

            if (expiration === null || new Date() > expiration) {
                // delete session
                reject('session expired');
            }

            let theaterId = session.theaterId ? session.theaterId : null;

            if (theaterId === null) {
                //delete session
                reject('missing theater id')
            }

            find(theaters, theaterId).then((theater) => {
                let seatsAvailable = theater.seatsAvailable - session.seatsTaken;

                let data = {
                    seats: session.seats,
                    seatsAvailable: seatsAvailable
                }

                update(theaters, theaterId, data).then((resp) => {
                    resolve(resp);
                }).catch((err) => {
                    reject(err);
                });

            }).catch((err) => {
                reject(err)
            });
        }).catch((err) => {
            reject(err);
        })
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
    update: update,
    reserveSeat: reserveSeat,
    confirmReservation: confirmReservation
};