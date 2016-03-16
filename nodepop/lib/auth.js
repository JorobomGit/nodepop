'use strict';

var basicAuth = require('basic-auth');
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

var fn = function() {
    return function(req, res, next) {
        var userRequest = basicAuth(req);
        if (!userRequest) {
            console.log(userRequest);
            //Escribe algo en la cabecera
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            res.send(401);
            return;
        }

        //Realizamos un find para ver si concuerda
        var filtro = {};
        filtro['nombre'] = userRequest.name;
        filtro['clave'] = userRequest.pass;

        var query = Usuario.find(filtro);
        query.exec(function(err, rows) {
            if (err) {
                console.log(err)
                return;
            }
            //Comprobamos que no hemos obtenido resultados
            if (rows.length == 0) {
                console.log('Login incorrecto');
                res.send(401);
                return;
            }
            next();
        });
    };
}


module.exports = fn;
