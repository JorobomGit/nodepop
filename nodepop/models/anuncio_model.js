'use strict';

var mongoose = require('mongoose');

var anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]
});


anuncioSchema.statics.list = function(string, cb) {

    var sort = string.sort || 'nombre';

    console.log(string);
    //Filtros
    var filtro = {};

    if (string.tag !== undefined) {
        filtro['tags'] = string.tag;        
    }
    //filtro['nombre'] = 'Bicicleta';
    console.log(filtro);
    var query = Anuncio.find(filtro);
    query.sort(sort);
    //query.skip(500);
    //query.limit(1);
    query.select();
    return query.exec(function(err, rows) {
        if (err) {
            return cb(err);
        }
        return cb(null, rows);
    });
};


var Anuncio = mongoose.model('Anuncio', anuncioSchema);
