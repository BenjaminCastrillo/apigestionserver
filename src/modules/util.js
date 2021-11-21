const fs = require('fs'); // funciones generales
const Error = require('./errors/index');


function ramdonNumber(min, max) {
    const __functionName = 'ramdonNumber';
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

function deleteFile(fileName, path) {
    const __functionName = 'deleteFile';

    let pathFile = path + fileName;

    if (fs.existsSync(pathFile)) {
        fs.unlinkSync(pathFile);
    }
    return

}

function zeroFill(numero, width) {

    while (numero.length < width) {
        numero = '0' + numero;
    }
    return numero
}




/**********************************
 *
 ** crea objeto error si la validacion de parametros lo requiere
 ** create error object if parameter validation requires it
 *
 *@param errorvalidation
 *?response validation result
 */
const paramValidation = (err, req, res, errorCode) => {
    const __functionName = 'paramValidation';
    if (!err.isEmpty()) {
        let error = new Error.createValidationError(err.errors, req, __moduleName, __functionName, errorCode);
        res.status(400).json({
            result: false,
            message: error.userMessage,
        });
        error.alert();
        return false;
    }
    return true;

}
module.exports = {
    deleteFile,
    ramdonNumber,
    paramValidation,
    zeroFill,


}