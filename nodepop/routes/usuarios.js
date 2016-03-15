'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var auth = require('../lib/auth');


var admin = 'admin';
var pass = 'pass';

/**
 * @api {get} /usuarios Get Users List sorted by specified (nombre as default).
 * @apiName GetUser
 * @apiGroup Usuario
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     { 
 *          "result": "true",
 *          "rows": "datos" 
 *     }
 *
 */

router.get('/', auth(admin,pass), function(req, res) {

    var sort = req.query.sort || 'nombre';

    Usuario.list(sort, function(err, rows) {
        if (err) return res.json({ result: false, err: err });
        //Cuando esten disponibles los mando en JSON
        console.log(rows);
        res.json({ result: true, rows: rows });
    });
});

/**
 * @api {post} /usuarios save user into DB with content of the request body.
 * @apiName PostUser
 * @apiGroup Usuario
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     { 
 *          "result": "true",
 *          "newRow": "nuevo Usuario" 
 *     }
 *
 */

router.post('/', function(req, res) {
    //Instanciamos objeto en memoria
    console.log('body post: ', req.body);
    var usuario = new Usuario(req.body);
    var query = Usuario.find(req.body); 
    console.log(query);
    //registro(usuario.nombre, usuario.email, usuario.clave);
});

function registro (nombre, email, clave) {
    console.log(nombre);
    console.log(email);
    console.log(clave);
    //Lo guardamos en la BD
    usuario.save(function(err, newRow) {
        if (err) return res.json({ result: false, err: err });
        console.log(newRow);
        res.json({ result: true, row: newRow });
    });
}



module.exports = router;
