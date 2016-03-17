'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');
var auth = require('../lib/auth');

/**
 * @api {get} /anuncios Get Anuncios: Obtiene los anuncios si el usuario esta registrado
 * @apiVersion 1.0.0
 * @apiName GetAnuncios
 * @apiGroup Anuncios
 *
 * @apiDescription Se pueden aplicar filtros por campo, ordenación y paginación.
 *
 * @apiSuccess {String} nombre  Nombre del producto.
 * @apiSuccess {Boolean} venta   Se vende o se busca.
 * @apiSuccess {Number}   precio Precio del producto. 
 * @apiSuccess {String} foto  URL de la imagen del producto.
 * @apiSuccess {[String]} tags   Array de tags del producto.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "result": "true",
 *       "nombre": "Bicicleta",
 *       "venta": "true",
 *       "precio": "50",
 *       "foto": "foto_bici.png",
 *       "tags": "[motor, lifestyle]"
 *     }
 *
 * @apiError (Error 401) AuthenticationError Unauthorized
 *
 * @apiErrorExample Error-Response-Auth:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *        "result": "false",
 *        "err": "AuthenticationError"
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

router.get('/', auth(), function(req, res) {
    Anuncio.list(req.query, function(err, rows) {
        if (err) return res.json({ result: false, err: err });
        //Cuando esten disponibles los mando en JSON
        console.log(rows);
        res.render('anuncios', { result: true, rows: rows });
    });
});

/**
 * @api {get} /anuncios/tags Get Tags: Obtiene los tags si el usuario esta registrado
 * @apiVersion 1.0.0
 * @apiName GetAnunciosTags
 * @apiGroup Anuncios
 *
 *
 * @apiSuccess {[String]} tags   Array de tags del sistema.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "tags": "[motor, lifestyle, mobile]"
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

router.get('/tags', auth(), function(req, res) {
    Anuncio.listTag(req.query, function(err, tags) {
        if (err) return res.json({ result: false, err: err });
        //Cuando esten disponibles los mando en JSON
        var arrayTags = [];
        tags.forEach(function(element) {
            arrayTags.push(element.tags);
        });

        var uniqueList = arrayTags.toString().split(',').filter(function(item, i, allItems) {
            return i == allItems.indexOf(item);
        }).join(',');

        //res.send('Tags Disponibles: ' + uniqueList);
        res.render('tags', { result: true, tags: uniqueList });
    });
});

/**
 * @api {post} /anuncios Post Anuncio: Inserta un anuncio
 * @apiVersion 1.0.0
 * @apiName PostAnuncios
 * @apiGroup Anuncios
 *
 *
 * @apiSuccess {String} nombre  Nombre del producto.
 * @apiSuccess {Boolean} venta   Se vende o se busca.
 * @apiSuccess {Number}   precio Precio del producto. 
 * @apiSuccess {String} foto  URL de la imagen del producto.
 * @apiSuccess {[String]} tags   Array de tags del producto.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "result": "true",
 *       "nombre": "Bicicleta",
 *       "venta": "true",
 *       "precio": "50",
 *       "foto": "foto_bici.png",
 *       "tags": "[motor, lifestyle]"
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
    //Instanciamos objeto en memoria
    console.log('body post: ', req.body);
    var anuncio = new Anuncio(req.body);

    //Lo guardamos en la BD
    anuncio.save(function(err, newRow) {
        if (err) return res.json({ result: false, err: err });
        console.log(newRow);
        res.json({ result: true, row: newRow });
    });

});

module.exports = router;
