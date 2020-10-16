/**   dos asteriscos seguidos pata activar colores
 ** brillante
 *! alerta
 * normal
 *? razon
 * TODO resaltado
 *@param parametro
 */

/*-------------------------------------

    Módulo: config
    Descripción: Lectura de datos de configuración del fichero config.json

---------------------------------------*/
//Definimos nombre del módulo
const __moduleName = 'src/modules/config';

///////////// Dependencias del módulo ///////////////////
const fs = require('fs');
// const util = require('util');
const extend = require('extend');
const colors = require('colors/safe');

/********************************************
 *            PÚBLICO
 *******************************************/

const config = {};
module.exports = config;

config.loadConfiguration = function loadConfiguration(mode) {

    console.log('LOADING ENVIRONMENT _________' + mode);
    let data = fs.readFileSync('./config/' + mode + '.json');
    try {
        configObj = JSON.parse(data);
        extend(true, config, configObj);
    } catch (err) {
        console.log(colors.red('Error parsing configuration file ' + mode + '.json'));
        console.log(err);
    };

}