'use strict';

var conn = require('../lib/connectMongoose.js');
var mongoose = require('mongoose');

var anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number
});


anuncioSchema.statics.list = function(sort,cb) {
    var query = Anuncio.find({});
    query.sort(sort);
    //query.skip(500);
    //query.limit(1);
    //query.select('nombre');
    return query.exec(function(err, rows) {
        if (err) {
            return cb(err);
        }
        return cb(null, rows);
    });
};


var Anuncio = mongoose.model('Anuncio', anuncioSchema);