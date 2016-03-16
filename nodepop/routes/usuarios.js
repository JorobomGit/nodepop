'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var auth = require('../lib/auth');

var crypto = require('crypto');

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

router.get('/', function(req, res) {
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
    registro(req)
        .then(function() {
            res.sendStatus(201); //Registro creado
        })
        .catch(function() {
            res.sendStatus(400); //Error al añadir registro
        })
});

function registro(req) {
    var usuario = new Usuario(req.body);
    var query = Usuario.find(req.body);

    var nombre = req.body.nombre;
    var email = req.body.email;
    var clave = req.body.clave;

    console.log("Nombre: ", nombre);
    console.log("Email: ", email);
    console.log("Clave: ", clave);

    if (nombre === undefined || email === undefined || clave === undefined) {
        return 'Error: Ninguno de los tres campos puede estar vacio';
    }
    //console.log(validacion(nombre, email));
    //Queremos que el nombre y el email sean unicos (Validacion)
    return validacion(nombre, email)
        .then(
            function() {
                /*Hashing*/
                 req.body['clave'] = crypto.createHmac('sha256', clave)
                    .digest('hex');

                var usuario = new Usuario(req.body);
                //Lo guardamos en la BD
                usuario.save(function(err, newRow) {
                    if (err) return { result: false, err: err };
                    return { result: true, row: newRow };
                });
            })
        .catch({
            function() {
                return 'Error en registro';
            }
        });
}

//Funcion para comprobar que el nombre o el email no existen ya
function validacion(nombre, email) {
    console.log('Nombre');
    return validarCampo('nombre', nombre)
        .then(
            function() {
                console.log('Email');
                return validarCampo('email', email);
            })
        .catch(
            function() {
                console.log('Ha habido algun error');
                return rejected();
            }
        )
}


/*Funcion que comprueba si un cierto campo no existe ya en nuestra BD*/
function validarCampo(campo, dato) {
    return new Promise(function(resolve, rejected) {
        var filtro = {};
        filtro[campo] = dato;

        var query = Usuario.find(filtro);
        query.exec(function(err, rows) {
            if (err) {
                console.log(err)
                return rejected();
            }
            //Comprobamos que no hemos obtenido resultados
            if (rows.length > 0) {
                console.log('Campo repetido');
                return rejected();
            }
            console.log('Campo correcto!');
            resolve();
        });
    });
}


module.exports = router;
