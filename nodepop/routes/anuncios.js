'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');
var auth = require('../lib/auth');

/* GET anuncios list. */
router.get('/', auth(),  function(req, res) {
    Anuncio.list(req.query, function(err, rows) {
        if (err) return res.json({ result: false, err: err });
        //Cuando esten disponibles los mando en JSON
        console.log(rows);
        res.json({ result: true, rows: rows });
    });
});

//Añadir un anuncio
router.post('/', function(req, res) {
    //Instanciamos objeto en memoria
    console.log('body post: ' , req.body);
    var anuncio = new Anuncio(req.body);

    //Lo guardamos en la BD
    anuncio.save(function(err, newRow) {
        if (err) return res.json({ result: false, err: err });
        console.log(newRow);
        res.json({ result: true, row: newRow });
    });

});

module.exports = router;