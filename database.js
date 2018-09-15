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
        let col = db.collection(collection);

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
        let col = db.collection(collection);

        col.insertOne(item, (err, resp) => {
            if (err) {
                reject(err);
            } else {
                resolve(resp);
            }
        });
    });
}

module.exports = {
    connect: connect,
    find: find,
    create: create
};