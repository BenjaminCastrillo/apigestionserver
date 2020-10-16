var winston = require('winston');
// var winstonRedis = require('winston-redis').Redis;
var config = require('./config');

var errorLogger;
var infoLogger;
var warnLogger;
var auditLogger;

var transportBuilders = {
    'console': winston.transports.Console,
    'file': winston.transports.File
        //  'redis': winston.transports.Redis
};

module.exports.initLogger = function() {
    errorLogger = initLoggerLevel('error');
    infoLogger = initLoggerLevel('info');
    warnLogger = initLoggerLevel('warn');
    auditLogger = initLoggerLevel('audit');
};

function initLoggerLevel(loggerLevel) {
    var transports = config.logger[loggerLevel].transports;
    var transportsKeys = Object.keys(transports);
    var transportObjects = [];
    for (var i = 0; i < transportsKeys.length; ++i) {
        var key = transportsKeys[i];
        var transportConfig = transports[key];
        var transportBuilder = transportBuilders[key];
        if (transportBuilder) {
            transportObjects.push(
                new(transportBuilder)(transportConfig)
            );
        }
    }
    return new(winston.Logger)({
        transports: transportObjects
    });
};


module.exports.call = function(module, func, req) {
    var path = req ? req.path : "#na#";
    infoLogger.log('info', "CALL " + module + "->" + func, { module: module, func: func, path: path, type: "CALL" })
};

module.exports.time = function(module, func, time, status, req) {
    var path = req ? req.url : "#na#";
    infoLogger.log('info', "TIME " + module + "->" + func + "->" + time + "ms", { module: module, func: func, path: path, type: "TIME", time: time, status: status })
};

module.exports.timeroute = function(time, req) {
    var path = req ? req.url : " unknown route";
    infoLogger.log('info', "ROUTE ", { path: path, method: req.method, time: time + "ms" })
};

module.exports.info = function(module, func, msg, req) {
    var path = req ? req.path : "#na#";
    infoLogger.log('info', "INFO " + msg, { status: "OK", module: module, func: func, path: path, type: "INFO" });
};

module.exports.warn = function(module, func, msg, req) {
    var path = req ? req.path : "#na#";
    warnLogger.log('warn', "WARN " + msg, { status: "OK", module: module, func: func, path: path });
};

module.exports.error = function(module, func, err, req) {
    if (!err.logged) {
        err.logged = true;
        var path = req ? req.path : "#na#";
        errorLogger.log('error', "ERROR " + err.message, { status: "KO", module: module, func: func, path: path });
    }
};

module.exports.finalError = function(err) {
    errorLogger.log('error', 'ERROR ' + err.message, err);
}

module.exports.audit = function(user, module, func, data, msg, req) {
    var path = req ? req.path : "#na#";
    auditLogger.log('info', "AUDIT " + msg, { user: user, module: module, func: func, path: path, data: data, path: path });
};