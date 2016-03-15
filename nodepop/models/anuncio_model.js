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

    /*Filtrado de tag*/
    if (string.tag !== undefined) filtro['tags'] = string.tag;

    /*Filtrado de venta*/
    if (string.venta == 'true' || string.venta == 'false') filtro['venta'] = string.venta;

    /*Filtrado de precio*/
    if (string.precio !== undefined) {
        
        var arr = string.precio.split("-");        
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

    /*Filtrado de nombre*/
    if (string.nombre !== undefined){
        filtro['nombre'] = new RegExp('^' + string.nombre, "i")
    }

    
    var query = Anuncio.find(filtro);
    /*Ordenación*/
    query.sort(sort);

    /*Paginación*/
    /*Skip*/
    if(string.skip != undefined)   query.skip(parseInt(string.skip));
    /*Limite de registros*/
    if(string.limit != undefined)   query.limit(parseInt(string.limit));
    query.select();
    return query.exec(function(err, rows) {
        if (err) {
            return cb(err);
        }
        return cb(null, rows);
    });
};


var Anuncio = mongoose.model('Anuncio', anuncioSchema);
