const conectionDB = require('./database');
const queries = require('../models/queries');
const config = require('./config');
const validator = require('validator');

const Error = require('./errors/index');
const { closeSync } = require('fs');



// inicializacion de constantes
const __moduleName = 'src/modules/servicesdatacustomer';


/**********************************
 *
 ** Catalogo de funciones de acceso a datos y descripciones 
 ** de clientes 
 ** General data access functions and descriptions
 ** of customers
 *
 ***********************************/
/**
 ** Obtener la lista de clientes
 ** Get customer  list
 *@Params 
 --------------------------------
 */

async function getCustomersAll() {
    const __functionName = 'getCustomers';
    const param = [];
    let result = new Array();

    try {
        response = await conectionDB.pool.query(queries.getCustomers);
        result = response.rows
    } catch (err) {
        error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;
}


/**
 ** Obtener la lista de marcas de un cliente
 ** Get brands list by customer id
 *@Params customerId
 --------------------------------
 */

async function getCustomerBrands(customerId) {
    const __functionName = 'getCustomerBrands';
    const param = [customerId];
    let result = new Array();

    try {
        response = await conectionDB.pool.query(queries.getBrandsByIdCustomer, param);
        result = response.rows
    } catch (err) {
        error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;
}
/**
 ** Obtener la lista de regiones comerciales de un cliente
 ** Get market regions list by customer id
 *@Params customerId
 --------------------------------
 */

async function getCustomerMarketRegions(customerId) {
    const __functionName = 'getCustomerMarketRegions';
    const param = [customerId];
    let result = new Array();

    try {
        response = await conectionDB.pool.query(queries.getMarketRegionsByIdCustomer, param);
        result = response.rows
    } catch (err) {
        error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;
}
/**
 ** Obtener la lista de localizaciones posibles de pantallas de un cliente
 ** Get screen locations list by customer id
 *@Params customerId
 --------------------------------
 */

async function getCustomerScreenLocations(customerId) {
    const __functionName = 'getCustomerScreenLocations';
    const param = [customerId];
    let result = new Array();

    try {
        response = await conectionDB.pool.query(queries.getScreenLocationByIdCustomer, param);
        result = response.rows
    } catch (err) {
        error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;
}
/**
 ** Obtener la lista de acronimmos de codigos comerciales de un cliente
 ** Get acronym codes list by customer id
 *@Params customerId
 --------------------------------
 */

async function getCustomerSiteComercialCodes(customerId) {
    const __functionName = 'getCustomerSiteComercialCodes';
    const param = [customerId];
    let result = new Array();

    try {
        response = await conectionDB.pool.query(queries.getSiteComercialCodeByIdCustomer, param);
        result = response.rows
    } catch (err) {
        error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;
}

module.exports = {
    getCustomerBrands,
    getCustomerMarketRegions,
    getCustomerScreenLocations,
    getCustomerSiteComercialCodes,
    getCustomersAll

}