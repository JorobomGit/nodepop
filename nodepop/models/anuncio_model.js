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

    if (string.tag !== undefined) filtro['tags'] = string.tag;
    if (string.venta == 'true' || string.venta == 'false') filtro['venta'] = string.venta;
    if (string.precio !== undefined) {
        
        var arr = string.precio.split("-");
        //console.log(string.precio[0])
        //if(arr[1] == '') arr[1] = undefined;
        console.log(arr)


        if (string.precio[0] == "-") //Caso -50
            filtro['precio'] = { $lt: arr[1] };
        else if (string.precio[string.precio.length-1] == "-") //Caso 50-
            filtro['precio'] = { $gt: arr[0] };
        else if (arr[1] != undefined) //Caso 1-50
            filtro['precio'] = { $gt: arr[0], $lt: arr[1]};
        else if (arr[0]>0) //Caso 50 y positivo
            filtro['precio'] = arr[0];
        else console.log('Precio no filtrado');
        //Si no cumple ninguna condicion, no filtramos

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
