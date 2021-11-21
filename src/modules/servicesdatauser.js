const conectionDB = require('./database');
const queries = require('../models/queries');

const Error = require('./errors/index');


// inicializacion de constantes
const __moduleName = 'src/modules/servicesdatauser';


/**********************************
 *
 ** Catalogo de funciones de acceso a datos y descripciones 
 ** de usuarios 
 ** General data access functions and descriptions
 ** of users
 *
 ***********************************/
/**
 ** Obtener la lista de usuarios
 ** Get customer  list
 *@Params  user
 --------------------------------
 */

async function getUserCustomer(userId) {
    const __functionName = 'getUserCustomer';
    const param = [userId];
    let result = new Array();

    try {
        let response = await conectionDB.pool.query(queries.getCustomerByUser, param);
        result = response.rows
    } catch (err) {
        let error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;


}

async function getUserExceptionsSites(userId) {

    const __functionName = 'getUserExceptionsSites';
    const param = [userId];
    let result = new Array();

    try {
        let response = await conectionDB.pool.query(queries.getExceptionSitesByUser, param);
        result = response.rows
    } catch (err) {
        let error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;

}
async function getUserCategories(userId) {

    const __functionName = 'getUserCategories';
    const param = [userId];
    let result = new Array();

    try {
        let response = await conectionDB.pool.query(queries.getCategoriesByUser, param);
        result = response.rows
    } catch (err) {
        let error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;

}

/* **
Obtener la descripcion del rol de usuario id en el idioma solicitado

@Params RolId, languageId
*/

async function getRolById(rolId, languageId) {
    const __functionName = 'getRolById';
    const param = [rolId, languageId];
    let result = {};
    if (rolId == null) return result;
    try {
        let response = await conectionDB.pool.query(queries.getRolById, param);
        if (response.rowCount != 0)
            result = response.rows[0];

    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;

    };
    return result;
}

module.exports = {
    getUserCustomer,
    getUserExceptionsSites,
    getUserCategories,
    getRolById,
}