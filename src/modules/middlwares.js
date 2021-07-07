const { param, validationResult } = require('express-validator');
const config = require('./config');
const basicAuth = require('express-basic-auth');

const expressAuthentication = (req, res, next) => {

    console.log(config.expresscredentials.username);
    console.log(config.expresscredentials.password);
    console.log("Por ahora no autentico los servicios");

    next();

}

async function validateUserId(req, res, next) {

    next()
}

function myAuthorizer(username, password) {

    const user = config.config.expresscredentials.username;
    const password = config.config.expresscredentials.password;


    const userMatches = basicAuth.safeCompare(username, user)
    const passwordMatches = basicAuth.safeCompare(password, password)
    console.log(userMatches, passwordMatches);
    return userMatches & passwordMatches;
}

function errorMiddleware(err, req, res, next) {
    console.log('estoy en el middleware de errores');
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