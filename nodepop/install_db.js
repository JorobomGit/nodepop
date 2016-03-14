'use strict';

//Que borre las tablas y cargue anuncios, y algún usuario.
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');
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
            insertaAnunciosJSON();
            insertaUsuariosJSON();
        });
    });
});



function insertaAnunciosJSON() {
    //Leemos json
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
            });
    } else { console.log('El fichero anuncios.json no existe'); }
}

function insertaUsuariosJSON() {
    //Leemos json
    var Usuario = mongoose.model('Usuario');
    if (fs.existsSync('./usuarios.json')) {
        var parsedJSON = require('./usuarios.json');
        async.eachSeries(parsedJSON.usuarios,
            function(item, siguiente) {
                var usuario = new Anuncio(item);
                usuario.save(function(err, anuncio) {
                    if (err) return { result: false, err: err };
                    console.log('Escribe: ', usuario);
                    siguiente();
                })
            }
        );
    } else { console.log('El fichero usuarios.json no existe'); }
}
