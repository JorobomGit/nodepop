'use strict';

var basicAuth = require('basic-auth');
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var crypto = require('crypto');

var fn = function() {
    return function(req, res, next) {
        var userRequest = basicAuth(req);
        if (!userRequest) {
            console.log(userRequest);
            //Escribe algo en la cabecera
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            res.sendStatus(401);
            return;
        }

        //Realizamos un find para ver si concuerda
        var filtro = {};
        filtro['nombre'] = userRequest.name;
        filtro['clave'] = userRequest.pass;
        console.log(filtro['clave']);
        /*filtro['clave'] = crypto.createHmac('sha256', userRequest.pass)
            .digest('hex');*/

        console.log(crypto.createHmac('sha256', userRequest.pass)
            .digest('hex'));


        var hash = crypto.createHmac('sha256', userRequest.pass)
            .digest('hex');
        filtro['clave'] = hash;
        var query = Usuario.find(filtro);
        
        query.exec(function(err, rows) {
            if (err) {
                console.log(err)
                return;
            }
            //Comprobamos que no hemos obtenido resultados
            if (rows.length == 0) {
                console.log('Login incorrecto');
                res.sendStatus(401);
                return;
            }
            console.log('Login Correcto');
            next();
        });
    };
}


module.exports = fn;
