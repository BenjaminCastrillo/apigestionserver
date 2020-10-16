var httpErrors = require('./httpErrors');
var util = require('util');

var pgErrorNames = {
    genericError: { errorCode: 0, message: 'Postgres error'},
    "22001": { errorName: "TooLongValue", message: "The data inserted is too long for the field", producesValError:true},
    "22007": { errorName: "InvalidDatetimeFormat", message: "Invalid datetime format", producesValError:true},
    "22008": { errorName: "DateFormatError", message: "Date format is not valid", producesValError:true},
    "22P02": { errorName: "InvalidTextRepresentation", message: "Invalid text input for a non-text field", producesValError:true},
    "23502": { errorName: "NotNullViolation", message: "Some field violates a NOT NULL restriction", producesValError:true},
    "23503": { errorName: "ForeignKeyViolation", message: "Foreign key violation"},
    "23505": { errorName: "UniqueKeyViolation", message: "Resource already exists (unique key violation)"},
    "42601": { errorName: "SyntaxError", message: "Syntax error on SQL statement"}
}

function PgError(errCode) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    var self = this;
    self.name = "PgError";
    var error = pgErrorNames[errCode] || pgErrorNames['genericError'];
    self.errorCode = errCode;
    self.errorName = error.errorName;
    self.message = error.message;

    return this;
}

util.inherits(PgError, Error);

module.exports.producesValError = function(err){
	if (err && err.errorCode && pgErrorNames[err.errorCode]){
		if (pgErrorNames[err.errorCode]) { return true; }
		else { return false; }
	}
	else return false;
}

module.exports.isPgError = function(err){
    return (err !== undefined) && (err.name == "PgError");
}

module.exports.createError = function(errCode){
    return new PgError(errCode);
}
