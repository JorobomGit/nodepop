'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

/* GET usuarios list. */
router.get('/', function(req, res) {

	var sort = req.query.sort || 'nombre';

    Usuario.list(sort, function(err, rows) {
        if (err) return res.json({ result: false, err: err });
        //Cuando esten disponibles los mando en JSON
        console.log(rows);
        res.json({ result: true, rows: rows });
    });
});

//Añadir un usuario
router.post('/', function(req, res) {
    //Instanciamos objeto en memoria
    console.log('body post: ' , req.body);
    var usuario = new Usuario(req.body);

    //Lo guardamos en la BD
    usuario.save(function(err, newRow) {
        if (err) return res.json({ result: false, err: err });
        console.log(newRow);
        res.json({ result: true, row: newRow });
    });

});

module.exports = router;