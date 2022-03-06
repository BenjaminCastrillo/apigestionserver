const { param, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
// const config = require('./config');
const basicAuth = require('express-basic-auth');
const config = require('../modules/config');
const moment = require('moment');


const expressAuthentication = (req, res, next) => {

    // console.log(config.expresscredentials.username);
    // console.log(config.expresscredentials.password);
    const accessToken = req.headers['authorization'];

    if (!accessToken) {
        res.status(401).json({
            result: false,
            data: 'Usuario no autorizado, sin token'
        });
    } else {
        jwt.verify(accessToken, config.authentication_key, (err, usuario) => {
            console.log('usuario', usuario.email);

            const hora1 = moment.unix(usuario.iat).format("DD-MM-YYYY h:mm:ss");
            const hora2 = moment.unix(usuario.exp).format("DD-MM-YYYY h:mm:ss");
            console.log('hora generacion', hora1);
            console.log('hora expiracion', hora2);

            if (err) {
                res.status(401).json({
                    result: false,
                    data: 'Usuario no autorizado'
                });

            } else {
                next()

            }
        });
    }




    return
}



async function validateUserId(req, res, next) {

    next()
}

function myAuthorizer(username, password) {

    const user = config.config.expresscredentials.username;
    const pw = config.config.expresscredentials.password;


    const userMatches = basicAuth.safeCompare(username, user)
    const passwordMatches = basicAuth.safeCompare(password, password)
    console.log(userMatches, passwordMatches);
    return userMatches & passwordMatches;
}

function errorMiddleware(err, req, res, next) {

    res.status(400).json({
        status: error,
        name: err.name,
        path: error.path,
        message: err.message
    })
}


module.exports = {
    expressAuthentication,
    myAuthorizer,
    errorMiddleware,
    validateUserId
}