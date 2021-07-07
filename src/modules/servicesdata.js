const conectionDB = require('./database');
const queries = require('../models/queries');
const config = require('./config');
const validator = require('validator');

const Error = require('../modules/errors/index');
const { closeSync } = require('fs');
const { Logform } = require('winston');
const { response } = require('express');



// inicializacion de constantes
const __moduleName = 'src/modules/servicesdata';


/**********************************
 *
 ** Catalogo de funciones de acceso a datos generales y descripciones 
 ** de la aplicación
 ** General data access functions and descriptions
 ** of the application
 *
 ***********************************/



/**
 ** Obtener descripcion de la marca por id
 
 *@Params brandId
 --------------------------------
 */

async function getBrandById(brandId) {
    const __functionName = 'getBrandById';
    const param = [brandId];
    let result = {};

    try {
        let response = await conectionDB.pool.query(queries.getBrandById, param)
        if (response.rowCount != 0)
            result = {
                id: response.rows[0].id_brand,
                description: response.rows[0].description,
                image: response.rows[0].image,
                color: response.rows[0].color
            };
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;
}

/**
 ** Obtener la lista de categorias de un site para un usuario
 ** Get the category list  by id site and id user
 *@Params siteId, userId
 --------------------------------
 */
async function getCategoryBySiteAndUserId(siteId, userId) {
    const __functionName = 'getCategoryByUserIdAndSiteId';
    const param = [siteId, userId];
    let result = [];
    if (siteId == null || userId == null) return result;
    // console.log(param);
    try {
        let response = await conectionDB.pool.query(queries.getCategoryBySiteAndUser, param);
        if (response.rowCount != 0)
            result = response.rows;

    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;

}

/**
 ** Obtener la descripcion del pais por id en el idioma solicitado
 
 *@Params countryId, languajeId
 --------------------------------
 */

async function getCountryById(countryId, languajeId) {
    const __functionName = 'getCountryById';
    const param = [countryId, languajeId];
    let result = {};

    try {
        let response = await conectionDB.pool.query(queries.getCountryById, param)
        if (response.rowCount != 0)
            result = {
                id: response.rows[0].id_country,
                description: response.rows[0].text_
            };

    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;

    };
    return result;


}




/**
 ** Obtener los datos de personas de contacto y su telefonos de un local
 ** Get contact information and telephone numbers from venue
 *@Params venueId
 --------------------------------
 */

async function getContactsByVenueId(venueId) {
    const __functionName = 'getContactsByVenueId';
    let param = [venueId];
    let ind = 0;
    let phoneNumbers = new Array();
    let contact = {};
    let telephone = {};
    let lastContactId = 0;
    let result = new Array();
    let response;

    try {

        // Obtenemos los contactos de los locales - Get venue contacts
        response = await conectionDB.pool.query(queries.getContactsByVenueId, param);

    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    // Añadimos los números de telefono de cada contacto  - we add the phone numbers of each contact
    while (ind < response.rows.length) {
        lastContactId = response.rows[ind].id;
        while (ind < response.rows.length && response.rows[ind].id == lastContactId) {
            contact = {
                id: response.rows[ind].id,
                name: response.rows[ind].name,
                email: response.rows[ind].email,
                notes: response.rows[ind].notes_contact
            };
            telephone = {
                number: response.rows[ind].phone_number,
                notes: response.rows[ind].notes_phone
            }
            phoneNumbers.push(telephone);
            ind++;
        }
        Object.defineProperty(contact, 'phoneNumbers', {
            value: phoneNumbers,
            writable: true,
            enumerable: true,
            configurable: true
        });
        phoneNumbers = [];
        result.push(contact);
    }
    return result;
}

/**
 ** Obtener clientes permitidos para el usuario 
 ** get the allowed customers for the user
 *@Params userId
 --------------------------------
 */

async function getCustomerAllowedByUser(userId) {
    const __functionName = 'getCustomerAllowedByIdUser';
    const param = [userId];
    let result = new Array();

    try {
        let response = await conectionDB.pool.query(queries.getCustomerByIdUser, param);
        result = response.rows;
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };

    return result;
}

/**
 ** Obtener las exceciones de emplazamientos de un usuario
 ** Get excetions ite by user
 *@Params userId
 --------------------------------
 */

async function getExceptionSitesByUser(userId) {

    const __functionName = 'getExceptionSitesByUser';
    const param = [userId];
    let result = new Array();

    try {
        let response = await conectionDB.pool.query(queries.getExceptionSitesByUser, param);
        result = response.rows;
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;
}

/**
 ** Obtener la localización de un local por id en el idioma indicado
 ** Get  location of a venue by id in the indicated language
 
 *@Params venueId, languajeId
 --------------------------------
 */

async function getLocationByVenueId(venueId, languajeId) {
    const __functionName = 'getLocationByVenueId';

    let result = [];
    let territorialOrg = new Array();

    try {
        // Obtenemos las descripciones de las organizaciones territoriales
        // Get descriptions of the territorial organizations
        let param = [languajeId];
        let response = await conectionDB.pool.query(queries.getTerritorialOrganization, param)
        territorialOrg = response.rows;

        // Obtenemos las descripciones de las entidades territoriales del local
        // Get descriptions of the territorial entities by venue
        param = [venueId, languajeId];
        response = await conectionDB.pool.query(queries.getLocationByVenue, param)
        result = response.rows;
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;

    };
    // Insertamos en cada objeto la descripcion de la organizacion territorial
    // Insert in each object the description of the territorial organization
    for (let ind = 0; ind < result.length; ind++) {

        let description = territorialOrg.find(elemento => elemento.id == result[ind].id_territorial_org);
        Object.defineProperty(result[ind], 'text_org_', {
            value: description.text_,
            writable: true,
            enumerable: true,
            configurable: true
        });
    }
    return result;
}

/**
 ** Obtener descripcion de la region comercial por id
 
 *@Params MarketRegionId
 --------------------------------
 */

async function getMarketRegionById(MarketRegionId) {
    const __functionName = 'getMarketRegionById';
    const param = [MarketRegionId];
    let result = {};

    try {
        let response = await conectionDB.pool.query(queries.getMarketRegionsById, param);
        if (response.rowCount != 0)
            result = {
                id: response.rows[0].id_market_region,
                description: response.rows[0].description
            };
    } catch (err) {
        const error = newError.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;
}

/**
 ** Obtener el nombre de la red por id y lenguaje
 ** Get network name by id and languaje
 *@Params networkId, languajeId
 --------------------------------
 */
async function getNetworkById(networkId, languajeId) {
    const __functionName = 'getNetworkById';
    const param = [networkId, languajeId];
    let result = {};
    try {
        let response = await conectionDB.pool.query(queries.getNetworkById, param);
        if (response.rowCount != 0)
            result = response.rows[0];
    } catch (err) {
        const error = new error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;
}

/**
 ** Obtener el nombre del sisema operativo de un player por id
 ** Get os name by id
 *@Params osIde
 --------------------------------
 */
async function getOsById(osId) {
    const __functionName = 'getOsById';
    const param = [osId];
    let result = {};

    try {
        let response = await conectionDB.pool.query(queries.getOsById, param);
        if (response.rowCount != 0)
            result = response.rows[0];
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;
}

/**
 ** Obtener la descripcion de la orientacion de la pantalla por id y lenguaje
 ** Get orientation description by id and languaje
 *@Params OrientationId, languajeId
 --------------------------------
 */
async function getOrientationById(OrientationId, languajeId) {

    const __functionName = 'getOrientationById';
    const param = [OrientationId, languajeId];
    let result = {};
    if (OrientationId == null) return result;
    try {
        let response = await conectionDB.pool.query(queries.getOrientationById, param);
        if (response.rowCount != 0)
            result = response.rows[0];
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;


}

/**
 ** Obtener el horario de apertura de un local
 ** Get the opening hours of a venue
 *@Params venueId, week, scheduleType
 --------------------------------
 */

async function getScheduleByVenueId(venueId, week, scheduleType) {
    const __functionName = 'getScheduleByVenueId';
    let param = [venueId];
    let result = [];
    let schedule = {};
    let semana = new Array();
    let dia = {};
    let response;

    try {
        response = await conectionDB.pool.query(queries.getScheduleVenueByVenueId, param);
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
                openingTime1: horario.substr(2, 2) + ':' + horario.slice(4, 6),
                closingTime1: horario.substr(6, 2) + ':' + horario.slice(8, 10),
                openingTime2: horario.substr(10, 2) + ':' + horario.slice(12, 14),
                closingTime2: horario.substr(14, 2) + ':' + horario.slice(16, 18)
            }

            semana.push(dia);
            inicio = inicio + 18;
        }
        let tipoHorario = scheduleType.find(elem => (elem.id == element.schedule_type));

        schedule = {
            id: element.schedule_type,
            description: tipoHorario.text_,
            weekly: semana
        }
        semana = [];
        result.push(schedule);

    });
    return result;
}

/**
 ** Obtener tipos de horarios por idioma
 ** Get types of schedules by language
 *@Params languajeId
 --------------------------------
 */

async function getScheduleTypes(languajeId) {
    const __functionName = 'getScheduleTypes';
    const param = [languajeId];
    let result = new Array();

    try {
        let response = await conectionDB.pool.query(queries.getScheduleTypes, param);
        result = response.rows;
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;
}

/**
 ** Obtener el nombre de la marca de una pantalla por id
 ** Get screen brand name by id
 *@Params ScreenBrandId
 --------------------------------
 */
async function getScreenBrandById(ScreenBrandId) {

    const __functionName = 'getScreenBrandById';
    const param = [ScreenBrandId];
    let result = {};

    if (ScreenBrandId == null) return result;
    try {
        let response = await conectionDB.pool.query(queries.getScreenBrandById, param);
        result = response.rows[0];
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;

}


/**
 ** Obtener la descripcion de la localizacion de pantallas por id
 ** Get the description of screen location y id
 *@Params ScreenLocationId
 --------------------------------
 */
async function getScreenLocationById(ScreenLocationId) {

    const __functionName = 'getScreenLocationById';
    const param = [ScreenLocationId];
    let result = {};


    if (ScreenLocationId == null) return result;
    try {
        let response = await conectionDB.pool.query(queries.getScreenLocationById, param);
        if (response.rowCount != 0) result = response.rows[0];
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };

    return result;



}
/**
 ** Obtener el nombre del modelo de una pantalla por id
 ** Get the screen model name by id
 *@Params ScreenModelId
 --------------------------------
 */
async function getScreenModelById(ScreenModelId) {
    const __functionName = 'getScreenModelById';
    const param = [ScreenModelId];

    let result = {};
    if (ScreenModelId == null) return result;
    try {
        let response = await conectionDB.pool.query(queries.getScreenModelById, param);
        if (response.rowCount != 0)
            result = response.rows[0];
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;


}



/**
 ** Obtener el nombre del tipo de pantalla por id
 ** Get screen type name by id
 *@Params ScreenTypeId, languajeId
 --------------------------------
 */
async function getScreenTypeById(ScreenTypeId, languajeId) {
    const __functionName = 'getScreenTypeById';
    const param = [ScreenTypeId, languajeId];
    let result = {};
    if (ScreenTypeId == null) return result;
    try {
        let response = await conectionDB.pool.query(queries.getScreenTypeById, param);
        if (response.rowCount != 0)
            result = response.rows[0];

    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;

}

/**
 ** Obtener sites de una local
 ** get sites  venue
 *@Params venueId
 --------------------------------
 */


async function getSitesByVenueIdAndUserId(venueId, userId, exceptions, customerId) {
    const __functionName = 'getSitesByVenueIdAndUserId';
    let param = [userId];
    let result = new Array();
    let respuesta = new Array();
    let index;
    let customer = [];
    let exceptionType = 0;


    try {

        // obtengo los acciones de para cada cliente
        let response = await conectionDB.pool.query(queries.getCustomerByIdUser, param);
        customer = response.rows;

        if (customer.length > 0) { // si es 0  es superusuario
            exceptionType = customer.find(elem => elem.id_customer == customerId).exception;
        }

        param = [venueId];
        response = await conectionDB.pool.query(queries.getSitesByVenueId, param);
        result = response.rows;
        console.log(exceptions);

    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    console.log('antes del switch');
    switch (exceptionType) {

        case 0:
            console.log('entro en el 0');
            respuesta = result;
            break;
        case 1:
            console.log('entro en el 1');
            for (let i = 0; i < result.length; i++) {
                index = exceptions.indexOf(result[i].id_site)
                if (index != -1) respuesta.push(result[i]);
            }
            break;

        case 2:
            console.log('entro en el 2');
            for (let i = 0; i < result.length; i++) {
                index = exceptions.indexOf(result[i].id_site)
                if (index === -1) respuesta.push(result[i]);
            }
            break;

    }
    return respuesta;
}

/**
 ** Obtener el nombre del estado del site por id y lenguaje
 ** Get state name by id and languaje
 *@Params statusId, languajeId
 --------------------------------
 */
async function getStatusById(statusId, languajeId) {

    const __functionName = 'getStatusById';
    const param = [statusId, languajeId];
    let result = {};
    try {
        let response = await conectionDB.pool.query(queries.getStatusById, param);
        if (response.rowCount != 0)
            result = response.rows[0];
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;
}


/**
 ** Obtener la descripcion del tipo de via por id en el idioma solicitado
 
 
 *@Params typeRoadId, languajeId
 --------------------------------
 */

async function getRoadTypeById(typeRoadId, languajeId) {
    const __functionName = 'getRoadTypeById';
    const param = [typeRoadId, languajeId];
    let result = {};
    try {
        let response = await conectionDB.pool.query(queries.getRoadTypeById, param);
        if (response.rowCount != 0)
            result = {
                id: response.rows[0].id_road_type,
                description: response.rows[0].text_
            };

    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;

    };
    return result;
}
/**
 ** Obtener datos de un usuario
 ** Get user data
 *@Params userId
 --------------------------------
 */


async function getUserById(userId) {

    const __functionName = 'getUserById';
    const param = [userId];
    let result = new Array();

    try {
        let response = await conectionDB.pool.query(queries.getUserById, param);
        result = response.rows;
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;
}


/**
 ** Comprueba si la licencia del player esta activa
 ** Check if the license is activa (true or false)
 *@Params licenseId
 --------------------------------
 */
async function validLicense(licenseId) {
    const __functionName = 'validLicense';
    const param = [licenseId];

    let result = {};
    let valid = true;
    const today = new Date();

    try {
        let response = await conectionDB.pool.query(queries.getLicenseById, param);
        if (response.rowCount != 0)
            result = response.rows[0];
        if (result == null || today > result.expiration_date) {
            valid = false;
        }

    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return valid;
}

/**
 ** Obtener locales de un usuario atendiendo al tipo (superusuario,propietarios,no propietario)
 ** Get venues data by user
 *@Params userId
 --------------------------------
 */


async function getVenuesByUserId(userId) {

    const __functionName = 'getVenuesByUserId';
    const param = [userId];
    let result = new Array();
    let usuario = {};
    let customer = new Array();

    try {
        // obtenemos os datos del usuario (superusuario/propietario/otros)
        let response = await conectionDB.pool.query(queries.getUserById, param);
        if (response.rowCount != 0)
            usuario = response.rows[0];
        // obtenemos los clientes asociados al usuario
        // response = await conectionDB.pool.query(queries.getCustomerByIdUser, param);
        // customer = response;
        if (usuario.super_user) { // El usuario es superusuario 
            response = await conectionDB.pool.query(queries.getAllVenues);
        } else {
            response = await conectionDB.pool.query(queries.getVenuesByUser, param);
        }

        // } else if (usuario.owner_user) { // el usuario es propietario

        //     // AQUI TENGO QUE SEGUIR ---------
        //     console.log(param);
        //     param[0] = usuario.id_customer;
        //     console.log(param);
        //     response = await conectionDB.pool.query(queries.getVenuesByCustomerId, param);
        // } else { // El usuario no es propietario 
        //     response = await conectionDB.pool.query(queries.getVenuesByUser, param);
        // }
        result = response.rows;
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };

    return result;
}

/**
 ** Obtener dias de la semana por idioma
 ** Get days of the week by language
 *@Params languajeId
 --------------------------------
 */

async function getWeekDays(languajeId) {
    const __functionName = 'getWeekDays';
    const param = [languajeId];
    let result = new Array();

    try {
        let response = await conectionDB.pool.query(queries.getWeekDays, param);
        result = response.rows;
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;
}


module.exports = {
    getBrandById,
    getCategoryBySiteAndUserId,
    getContactsByVenueId,
    getCountryById,
    getCustomerAllowedByUser,
    getExceptionSitesByUser,
    getLocationByVenueId,
    getMarketRegionById,
    getNetworkById,
    getOrientationById,
    getOsById,
    getRoadTypeById,
    getScheduleByVenueId,
    getScheduleTypes,
    getScreenBrandById,
    getScreenLocationById,
    getScreenModelById,
    getScreenTypeById,
    getSitesByVenueIdAndUserId,
    getStatusById,
    getUserById,
    validLicense,
    getVenuesByUserId,
    getWeekDays,
}