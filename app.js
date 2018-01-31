// Requiriments
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const routesUsuario = require('./routes/usuario')
const jsonwebtoken = require("jsonwebtoken");

// Automacao para parsing do JSON
// app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json())

// Hook para checagem de Token de autorizacao.
app.use(function (req, res, next) {
    if (req.headers && req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer') {

        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], global.jwtSecret,
            function (err, decode) {
                if (err) {
                    // Token authentication error.
                    req.user = undefined;
                    res.status(422).send(
                       { mensagem : 'Sessão Inválilda!' } 
                    )
                } else {
                    req.user = decode;
                }
                next();
            });
    } else {
        req.user = undefined;
        next();
    }   
});

// Registra rotas do usuario.
app.use('/', routesUsuario);

// Error Handling.
app.use(function(req, res) {
    res.status(404).send("{'mensagem':'Objeto não encontrado.'");
});

module.exports = app
