/**********************************
 *
 *   Array de errores
 *   Cortesía de node-httperrors: https://github.com/One-com/node-httperrors/blob/master/lib/httpErrors.js
 *
 ***********************************/

const util = require('util');

const httpErrorNames = {
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Time-out',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request-URI Too Large',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    418: 'I\'m a teapot', // RFC 2324
    422: 'Unprocessable Entity', // RFC 4918
    423: 'Locked', // RFC 4918
    424: 'Failed Dependency', // RFC 4918
    425: 'Unordered Collection', // RFC 4918
    426: 'Upgrade Required', // RFC 2817
    428: 'Precondition Required', // RFC 6585
    429: 'Too Many Requests', // RFC 6585
    431: 'Request Header Fields Too Large', // RFC 6585
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Time-out',
    505: 'HTTP Version Not Supported',
    506: 'Variant Also Negotiates', // RFC 2295
    507: 'Insufficient Storage', // RFC 4918
    509: 'Bandwidth Limit Exceeded',
    510: 'Not Extended', // RFC 2774
    511: 'Network Authentication Required' // RFC 6585
};

function HttpError(statusCode) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    var self = this;
    self.name = "HttpError";
    self.statusCode = statusCode;
    self.errorName = httpErrorNames[statusCode] ? httpErrorNames[statusCode] : httpErrorNames[500];

    this.isClientError = function() {
        return (self.statusCode >= 400 && self.statusCode < 500);
    }

    return this;
}
util.inherits(HttpError, Error);
// class HttpError extends Error {}

module.exports.isHttpError = function isHttpError(err) {
    return (err !== undefined) && (err.name == "HttpError");
}


module.exports.createError = function createHttpError(statusCode) {

    console.log("estoy en createHttpError");

    return new HttpError(statusCode);
}