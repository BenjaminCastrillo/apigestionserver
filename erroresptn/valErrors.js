
/**********************************
*
*   Errores de validación
*
***********************************/

var util = require('util');

function ValidationError() {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    var self = this;
    self.name = 'ValidationError';
    self.errorName = 'ValidationError';
    self.message = 'Validation error';

    return this;
}
util.inherits(ValidationError, Error);


module.exports.isValidationError = function isValidationError(err){
    return (err !== undefined) && (err.name == "ValidationError");
}


module.exports.createError = function createValidationError(){
    return new ValidationError();
}