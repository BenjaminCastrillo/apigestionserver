const conectionDB = require('./database');
const queries = require('../models/queries');
const claseException = require('../models/exceptions_sites');

const Error = require('./errors/index');


const {
    getVenueById,
    getScreenLocationById,

} = require('./servicesdatavenuesandsites');

const { getCustomerById } = require('./servicesdatacustomer');

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
        for (let i = 0; i < response.rows.length; i++) {

            result[i] = {
                id: response.rows[i].id,
                customerId: response.rows[i].id_customer,
                customerName: response.rows[i].name,
                identification: response.rows[i].identification,
                exception: response.rows[i].exception,
                deleted: response.rows[i].deleted,
            };

        }

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

        if (response.rows.length > 0) {
            result = await getExceptionDescriptions(response.rows);
        }

    } catch {

        let error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    }


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



async function getExceptionDescriptions(sites) {
    const __functionName = 'getExceptionDescriptions';
    let screenLocationObject = {};
    let customerObject = {};
    let venue = [];
    let exception = {};
    // let screenLocationDescription;
    // let screenLocationDeleted;
    let exceptionsObject = [];


    for (let i = 0; i < sites.length; i++) {


        //    screenLocationObject = await getScreenLocationById(sites[i].id_screen_location);
        customerObject = await getCustomerById(sites[i].id_customer);
        venue = await getVenueById(sites[i].id_venue);

        //   screenLocationDescription = (JSON.stringify(screenLocationObject) == '{}') ? null : screenLocationObject.description;
        // screenLocationDeleted = (JSON.stringify(screenLocationObject) == '{}') ? null : screenLocationObject.deleted;

        exception = new claseException.ExceptionsSites(
            sites[i].id,
            sites[i].id_site,
            sites[i].id_site_comercial,
            venue[0].name,
            customerObject.id,
            customerObject.identification,
            customerObject.name,
            //     sites[i].id_screen_location,
            //     screenLocationDescription,
            //    screenLocationDeleted,
            false
        );

        exceptionsObject.push(exception);
    }
    return exceptionsObject
}


module.exports = {
    getUserCustomer,
    getUserExceptionsSites,
    getUserCategories,
    getRolById,
    getExceptionDescriptions,
}