'use strict';

var client = require('mongodb').MongoClient;
var dbConnection = {
	db: null
}


client.connect('mongodb://localhost:27017/cursoNode',
    function(err, conn) {
        if(err) {
        	console.error('Cant connect to database');
        	process.exit(1);
        }

        console.log("Connected to", conn.databaseName, 'on', conn.options.url);
        dbConnection.db = conn;
    });

module.exports = dbConnection;