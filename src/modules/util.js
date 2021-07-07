const fs = require('fs'); // funciones generales


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
module.exports = {
    deleteFile,
    ramdonNumber


}