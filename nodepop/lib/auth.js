'use strict';

var basicAuth = require('basic-auth');


var fn = function(user, pass) {
    return function(req, res, next) {
        var userRequest = basicAuth(req);
        if (!userRequest || userRequest.name !== user || userRequest.pass !== pass) {
            console.log(userRequest);
            //Escribe algo en la cabecera
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            res.send(401);
            return;
        }
        next();
    };
}


module.exports = fn;
