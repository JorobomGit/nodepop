'use strict';

//Que borre las tablas y cargue anuncios, y algún usuario.
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');

var crypto = require('crypto');
/* Connect to the DB */
mongoose.connect('mongodb://localhost/nodepop', function() {
    /* Drop the DB */
    mongoose.connection.db.dropDatabase(function() {
        //Cuando elimine la base de datos llama al cb
        mongoose.connection.close(function() {
            //Cuando cierre conexion en el cb la reabrimos con los datos cargados.
            mongoose.connect('mongodb://localhost/nodepop');
            require('./models/anuncio_model');
            require('./models/usuario_model');

            //Se han insertado promesas de modo que cuando inserte o no(resolve)
            //realice la siguiente insercion y  finalmente cierre la conexion

            insertaAnunciosJSON()
                .then(
                    function() {
                        console.log('Llega');
                        return insertaUsuariosJSON();
                    })
                .then(
                    function() {
                        console.log('Final');
                        mongoose.connection.close();
                    })
        });
    });
});


function insertaAnunciosJSON() {
    //Leemos json
    return new Promise(function(resolve, rejected) {
        var Anuncio = mongoose.model('Anuncio');
        if (fs.existsSync('./anuncios.json')) {
            var parsedJSON = require('./anuncios.json');
            async.eachSeries(parsedJSON.anuncios,
                function(item, siguiente) {
                    var anuncio = new Anuncio(item);
                    anuncio.save(function(err, anuncio) {
                        if (err) return { result: false, err: err };
                        console.log('Escribe: ', anuncio);
                        siguiente();
                    })
                },
                function() {
                    resolve();
                });
        } else {
            console.log('El fichero anuncios.json no existe');
            resolve();
        }
    });
}

function insertaUsuariosJSON() {
    //Leemos json
    return new Promise(function(resolve, rejected) {
        var Usuario = mongoose.model('Usuario');
        if (fs.existsSync('./usuarios.json')) {
            var parsedJSON = require('./usuarios.json');
            async.eachSeries(parsedJSON.usuarios,
                function(item, siguiente) {
                    /*Hashing*/
                    item['clave'] = crypto.createHmac('sha256', item['clave'])
                        .digest('hex');
                    var usuario = new Usuario(item);
                    usuario.save(function(err, usuario) {
                        if (err) return { result: false, err: err };
                        console.log('Escribe: ', usuario);
                        siguiente();
                    })
                },
                function() {
                    console.log("Y resuelve");
                    resolve();
                });
        } else {
            console.log('El fichero usuarios.json no existe');
            resolve();
        }
    });
}
