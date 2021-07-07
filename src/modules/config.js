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
const defaultLanguaje = new Array();
module.exports = config, defaultLanguaje;

config.loadConfiguration = function loadConfiguration(mode) {
    // const validLanguajes = [];

    //  config.localization.langs.forEach(element => {
    //validLanguajes.push(element.id.toString());
    // });


    console.log('LOADING ENVIRONMENT _________' + mode);
    let data = fs.readFileSync('./config/' + mode + '.json');
    try {
        configObj = JSON.parse(data);
        extend(true, config, configObj);
        defaultLanguaje[0] = config.localization.defaultLang;
    } catch (err) {
        console.log(colors.red('Error parsing configuration file ' + mode + '.json'));
        console.log(err);
    };

}