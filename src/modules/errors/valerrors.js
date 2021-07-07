const moment = require('moment');
const valErrorNames = {
    genericError: { errorCode: 0, message: 'Generic validation error' },
    "1": { errorName: "invalid parameter", message: "Tipo de parámetro invalido" },
    "2": { errorName: "Id not exist", message: "El código buscado no existe" }
}
class ValidationError {
    constructor(err, req, processName, functionName, errorCode) {
        let textError = valErrorNames[errorCode] || valErrorNames['genericError'];
        this.name = 'error';
        this.typeError = 'Data validation';
        this.error = err;
        this.processName = processName;
        this.functionName = functionName;
        this.method = req.method + ' ' + req.headers.host + req.url;
        this.time = moment().format('YYYY-MM-DD hh:mm:ss');
        this.userMessage = {
            code: errorCode,
            text: textError.message
        };
    }

    alert() {
        console.log(this);
    }
}


module.exports.ValidationError = ValidationError;