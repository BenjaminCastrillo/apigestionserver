const moment = require('moment');

const pgErrorNames = {
    genericError: { errorCode: 0, message: 'Postgres error' },
    "22001": { errorName: "TooLongValue", message: "The data inserted is too long for the field", producesValError: true },
    "22007": { errorName: "InvalidDatetimeFormat", message: "Invalid datetime format", producesValError: true },
    "22008": { errorName: "DateFormatError", message: "Date format is not valid", producesValError: true },
    "22P02": { errorName: "InvalidTextRepresentation", message: "Invalid text input for a non-text field", producesValError: true },
    "23502": { errorName: "NotNullViolation", message: "Some field violates a NOT NULL restriction", producesValError: true },
    "23503": { errorName: "ForeignKeyViolation", message: "Foreign key violation" },
    "23505": { errorName: "UniqueKeyViolation", message: "Resource already exists (unique key violation)" },
    "42601": { errorName: "SyntaxError", message: "Syntax error on SQL statement" },
    "42703": { errorName: "InternalError", message: "Column does not exist" },
    "42P01": { errorName: "InternalError", message: "Column does not exist (update)" }
}

class PgError {
    constructor(err, processName, functionName) {

        var errCode = 22001;
        var error = pgErrorNames[errCode] || pgErrorNames['genericError']


        this.name = err.name;
        this.typeError = 'Data Base access';
        this.error = (err.code) ? err.code : "0";
        this.message = err.message;
        this.hint = (err.hint) ? err.hint : "";
        this.routine = (err.routine) ? err.routine : "";
        this.processName = processName;
        this.functionName = functionName;
        this.day = moment().format('YYYY-MM-DD hh:mm:ss');
        this.userMessage = 'Error interno de acceso a datos';
    }
    alert() {
        console.log(this);
    }
}
module.exports.PgError = PgError;