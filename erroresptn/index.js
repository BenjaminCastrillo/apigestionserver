/******************************************

    Módulo: errors
    Descripción: Gestión de errores

********************************************/
//Definimos nombre del módulo
const __moduleName = 'src/modules/errors';

///////////// Dependencias del módulo ///////////////////
// var querystring = require('querystring')

const stringUtils = require('../stringUtils');
const logger = require('../logger');
// const mailer = require('../mailer');
const httpErrors = require('./httpErrors');
const validErrors = require('./valErrors');
const pgErrors = require('./pgErrors');
const funcErrors = require('./funcErrors');

/********************************************
 *            PÚBLICO
 *******************************************/

// Gestión de errores general
module.exports.errorHandler = function(err, req, res, next) {

    var error = generateErrorObject(req, err);

    if (error.statusCode !== 404) {
        console.error('[ERROR BEGIN ' + error.path + ']:' + ' ----------------------------------------------------{');
        console.error(error);
        console.error(error.stack);
        console.error('[ERROR END ' + error.path + ']:' + ' ----------------------------------------------------}');
    }

    res.status(error.statusCode);
    res.json(error);

    var errorMsg = {
        message: err.message,
        method: req.method,
        extra: JSON.stringify(err, null, '\t'),
        stack: stringUtils.newlinesToHtml(err.stack),
        module: err.moduleName,
        funct: err.funcName,
        path: error.path,
        body: JSON.stringify(req.body, null, '\t'),
        from_ip: req.ip
    };
    logger.finalError(errorMsg);

    if ((error.critical) && (process.env.PLAYTHENET_ENV !== 'local')) {
        console.log('Sending mail for error ' + error);
        console.log('   Is Critical ' + error.critical);
        console.log('   From IP ' + req.ip);
        //        mailer.warnDevelopers(errorMsg);
    }
};

module.exports.setCritical = function(error, __moduleName, __funcName) {
    error.funcName = __funcName;
    error.moduleName = __moduleName;
    error.critical = true;
};

// Middleware para errores 404
module.exports.pageNotFound = function(req, res, next) {
    var error = httpErrors.createError(404);
    next(error);
};

// Middleware para errores al parsear el body de la request
module.exports.parseError = function(err, req, res, next) {
    var error = httpErrors.createError(400);
    error.message = "Error parsing request body";
    next(error);
};

// Middleware para errores 405
module.exports.methodNotAllowed = function(req, res, next) {
    if ((req.jsonData === undefined) && (req.tplData === undefined)) {
        var error = httpErrors.createError(405);
        next(error);
    } else { next(); }
};

module.exports.pgErrorHandler = pgErrors.handler;

module.exports.createFuncError = funcErrors.createError;
module.exports.createValidError = validErrors.createError;
module.exports.createPgError = pgErrors.createError;
module.exports.createHttpError = httpErrors.createError;

module.exports.isFunctionalError = funcErrors.isFunctionalError;
module.exports.isValidationError = validErrors.isValidationError;
module.exports.isPgError = pgErrors.isPgError;
module.exports.isHttpError = httpErrors.isHttpError;

/********************************************"
 *            PRIVADO
 *******************************************/

function generateErrorObject(req, err) {

    let error = {};

    console.log("estoy en generaErrorObject");

    if (httpErrors.isHttpError(err)) {
        error = err;
        error.statusCode = error.statusCode || 500;
        if ((error.statusCode >= 400) && (error.statusCode < 500)) {
            error.success = false;
        }
        error.critical = (error.statusCode >= 500);
    }

    let query = querystring.stringify(req.query);
    query = ((query != '') ? '?' : '') + query;
    error.path = req.path + query;
    console.log(error);
    return error;
}

function isNetworkError(err) {

    if (err.code == 'ECONNREFUSED' || err.code == 'ECONNRESET') { return err.code; } else if (err.hasOwnProperty("internal_errors")) { return isNetworkError(err.internal_errors); } else { return false; }
}

function isControlledError(err) {
    return funcErrors.isFunctionalError(err) || validErrors.isValidationError(err) || pgErrors.isPgError(err);
}