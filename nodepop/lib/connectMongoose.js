'use strict';

//Require moongoose
var mongoose = require('mongoose');
var conn = mongoose.connection;

//Eventemiter en error pinta 
conn.on('error', console.error.bind(console, 'mongodb connection error:'));
conn.once('open', function() {
    console.info('Connected to mongoose.');
});
mongoose.connect('mongodb://localhost/nodepop');
