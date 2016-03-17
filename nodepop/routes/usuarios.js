'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var auth = require('../lib/auth');

var crypto = require('crypto');

/**
 * @api {get} /usuarios Get Usuarios: Obtiene los usuarios
 * @apiVersion 1.0.0
 * @apiName GetUsuarios
 * @apiGroup Usuarios
 *
 *
 * @apiSuccess {String} nombre  Nombre del usuario (debe ser único).
 * @apiSuccess {String} email  Email del usuario (debe ser único).
 * @apiSuccess {String} clave   Clave del usuario encriptada.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "result": "true",
 *       "nombre": "Smith",
 *       "email": "agenteSmith@matrix.com",
 *       "clave": "e2bd05dfa68d1b2fa5deabc4a9b37c311be54d2cb0fc540d819847db66d76a28"
 *     }
 *
 * @apiError (Error 500) DBError Descripcion error base de datos
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "result": "false",
 *        "err": "DBError"
 *     }
 */

router.get('/', function(req, res) {
    var sort = req.query.sort || 'nombre';

    Usuario.list(sort, function(err, rows) {
        if (err) return res.json({ result: false, err: err });
        console.log(rows);
        res.render('usuarios', { result: true, rows: rows });
    });
});

/**
 * @api {post} /usuarios Post Usuario: Inserta un usuario
 * @apiVersion 1.0.0
 * @apiName PostUsuarios
 * @apiGroup Usuarios
 *
 * @apiSuccess {String} nombre  Nombre del usuario (debe ser único).
 * @apiSuccess {String} email   Email del usuario (debe ser único).
 * @apiSuccess {String} clave   Clave del usuario encriptada.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "result": "true",
 *       "nombre": "Smith",
 *       "email": "agenteSmith@matrix.com",
 *       "clave": "e2bd05dfa68d1b2fa5deabc4a9b37c311be54d2cb0fc540d819847db66d76a28"
 *     }
 *
 * 
 * @apiError (Error 500) DBError Descripcion error base de datos
 * 
 * @apiErrorExample Error-Response-DB:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "result": "false",
 *        "err": "DBError"
 *     }
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


/***************************************/
/*Nombre: registro**********************/
/*Descripcion: dado un nombre, email y */
/*clave, registra un usuario************/
/*Parametros:***************************/
/**Entrada:*****************************/
/***req: request del usuario************/
/**Salida:******************************/
/***Json con datos introducidos si OK***/
/***Texto indicando error si ERR********/
/***************************************/

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

/***************************************/
/*Nombre: validacion********************/
/*Descripcion: dado un nombre y un email/
/*valida un usuario campo a campo*******/
/*Parametros:***************************/
/**Entrada:*****************************/
/***nombre: nombre del usuario**********/
/***email: email del usuario************/
/**Salida:******************************/
/***Promesa indicando resolve o rejected/
/***************************************/

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


/***************************************/
/*Nombre: validarCampo******************/
/*Descripcion: dado un campo y su dato */
/*comprobamos que no exista en la BD****/
/*Parametros:***************************/
/**Entrada:*****************************/
/***campo: campo a buscar***************/
/***dato: dato a validar****************/
/**Salida:******************************/
/***Promesa indicando resolve o rejected/
/***************************************/
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
