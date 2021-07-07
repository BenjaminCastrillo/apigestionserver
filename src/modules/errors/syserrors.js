const moment = require('moment');
const sysErrorNames = {
    genericError: { errorCode: 0, message: 'System error' },
    "3": { errorName: "File write error", message: "Error al grabar la imagen" },

}

class SysError {
    constructor(err, req, processName, functionName, errorCode) {
        let textError = sysErrorNames[errorCode] || sysErrorNames['genericError'];
        this.name = 'error';
        this.typeError = 'System Error';
        this.error = err
        this.message = textError.message;
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


module.exports.SysError = SysError;