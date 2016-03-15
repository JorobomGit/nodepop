'use strict';

var mongoose = require('mongoose');

var usuarioSchema = mongoose.Schema({
    nombre: String,
    email: String,
    clave: String
});


usuarioSchema.statics.list = function(sort, cb) {
    var query = Usuario.find({});
    query.sort(sort);
    return query.exec(function(err, rows) {
        if (err) {
            return cb(err);
        }
        return cb(null, rows);
    });
};


var Usuario = mongoose.model('Usuario', usuarioSchema);
