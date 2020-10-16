const { param, validationResult } = require('express-validator');
const config = require('./config');
const basicAuth = require('express-basic-auth');

const ParamIsNumber = (req, res, next) => {

    param('languaje_id').isInt();

    console.log('hola', req.params);

    next();

}

const expressAuthentication = (req, res, next) => {

    console.log(config.expresscredentials.username);
    console.log(config.expresscredentials.password);
    console.log("Por ahora no autentico los servicios");

    next();

}


function myAuthorizer(username, password) {

    const user = config.config.expresscredentials.username;
    const password = config.config.expresscredentials.password;


    const userMatches = basicAuth.safeCompare(username, user)
    const passwordMatches = basicAuth.safeCompare(password, password)
    console.log(userMatches, passwordMatches);
    return userMatches & passwordMatches;
}
module.exports = {
    expressAuthentication,
    ParamIsNumber,
    myAuthorizer
}