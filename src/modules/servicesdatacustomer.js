const conectionDB = require('./database');
const queries = require('../models/queries');
const config = require('./config');
const validator = require('validator');
const moment = require('moment');

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
 ** Get customer list
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
 ** Obtener un cliente por id
 ** Get customer by id customer
 *@Params 
 --------------------------------
 */

async function getCustomerById(customerId) {
    const __functionName = 'getCustomerById';
    const param = [customerId];
    let result = new Array();
    try {
        response = await conectionDB.pool.query(queries.getCustomersByIdCustomer, param);
        result = response.rows[0]
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
    const param2 = [0];
    let result = new Array();

    try {
        response = await conectionDB.pool.query(queries.getSiteComercialCodeByIdCustomer, param);
        if (response.rows === 0) {
            response = await conectionDB.pool.query(queries.getSiteComercialCodeByIdCustomer, param2);
        }
        result = response.rows
    } catch (err) {
        error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;
}



/**
 ** Obtener el horario de apertura de un local de un cliente
 ** Get the opening hours of a customer
 *@Params customerId, week
 --------------------------------
 */

async function getCustomerSchedules(customerId, week) {
    const __functionName = 'getCustomerSchedules';
    let param = [customerId];
    let result = [];
    let schedule = {};
    let semana = new Array();
    let dia = {};
    let response;

    try {
        response = await conectionDB.pool.query(queries.getScheduleVenueByCustomerId, param);
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    response.rows.forEach(element => {
        let inicio = 0
        for (let i = 0; i < 7; i++) {
            let horario = element.week_schedule.substr(inicio, 18)
            let descriptionDay = week.find(element => (element.id == horario.substr(1, 1)));
            dia = {
                day: horario.substr(1, 1),
                descriptionDay: descriptionDay.text_,
                openingTime1: horario.substr(2, 2) != '--' ? horario.substr(2, 2) + ':' + horario.slice(4, 6) : null,
                closingTime1: horario.substr(6, 2) != '--' ? horario.substr(6, 2) + ':' + horario.slice(8, 10) : null,
                openingTime2: horario.substr(10, 2) != '--' ? horario.substr(10, 2) + ':' + horario.slice(12, 14) : null,
                closingTime2: horario.substr(14, 2) != '--' ? horario.substr(14, 2) + ':' + horario.slice(16, 18) : null
            }

            semana.push(dia);
            inicio = inicio + 18;
        }
        let fecha = moment(element.start_date.substr(0, 2) + "/" + element.start_date.substr(2, 2) + "/2000", "DD/MM/YYYY");

        schedule = {
            id: element.id,
            description: element.description,
            //      startDate: fecha.format('Do MMMM'),
            startDate: {
                id: element.start_date,
                description: fecha.format('Do MMMM')
            },
            weekly: semana,
            deleted: element.deleted
        }
        semana = [];
        result.push(schedule);

    });

    return result;
}

module.exports = {
    getCustomerBrands,
    getCustomerMarketRegions,
    getCustomerScreenLocations,
    getCustomerSiteComercialCodes,
    getCustomerSchedules,
    getCustomersAll,
    getCustomerById

}