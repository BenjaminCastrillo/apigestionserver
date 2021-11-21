const conectionDB = require('./database');
const queries = require('../models/queries');
const config = require('./config');
const validator = require('validator');
const moment = require('moment');

const Error = require('./errors/index');
const { closeSync } = require('fs');
const { Logform } = require('winston');
const { response } = require('express');
const clase = require('../models/location');
const { zeroFill } = require('../modules/util');



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
                color: response.rows[0].color,
                deleted: response.rows[0].deleted
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
 ** Obtener la lista de categorias de un site 
 ** Get the category list  by id site
 --------------------------------
 */
async function getCategoryBySite(siteId) {
    const __functionName = 'getCategoryBySite';
    let param = [siteId];
    let result = [];

    try {
        let response = await conectionDB.pool.query(queries.getCategoryBySite, param);
        for (let i = 0; i < response.rows.length; i++) {
            result.push({
                id: response.rows[i].id,
                description: response.rows[i].description,
                color: response.rows[i].color,
                user: response.rows[i].email
            })
        }
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;

}

/**
 ** Obtener el siguiente codigo comercial
 
 *@Params countryId, languageId
 --------------------------------
 */

async function getComercialCode(comercialCodeId) {
    const __functionName = 'getComercialCode';
    let comercialCode = null;
    let fecha = new Date();
    let ano = fecha.getFullYear();
    let param = [parseInt(comercialCodeId, 10)];
    let nextNumber = 0;
    let nextYear = null;

    try {
        // Obtenemos la secuencia actual
        let response = await conectionDB.pool.query(queries.getSiteComercialCodeById, param);

        if (parseInt(response.rows[0].current_year, 10) == ano) {

            nextNumber = response.rows[0].sequence + 1;
            nextYear = response.rows[0].current_year;
        } else {
            nextNumber = 1;
            nextYear = ano.toString();
        }

        comercialCode = response.rows[0].acronym.trim() + nextYear.substring(2) + '-' + zeroFill(nextNumber.toString(), 4);

        param = [comercialCodeId, nextNumber, nextYear];
        await conectionDB.pool.query(queries.increaseSiteComercialCode, param);

    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };

    return comercialCode
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
    let responsePhone;

    try {

        // Obtenemos los contactos de los locales - Get venue contacts
        response = await conectionDB.pool.query(queries.getContactsByVenueId, param);

        for (let i = 0; i < response.rows.length; i++) {

            contact = {
                id: response.rows[i].id,
                name: response.rows[i].name,
                email: response.rows[i].email,
                notes: response.rows[i].notes_contact,
                deleted: response.rows[i].deleted_contact,
            };
            param = [response.rows[i].id];
            responsePhone = await conectionDB.pool.query(queries.getPhonesByContactId, param);

            for (let ii = 0; ii < responsePhone.rows.length; ii++) {

                telephone = {
                    id: responsePhone.rows[ii].id_contact_phone,
                    number: responsePhone.rows[ii].phone_number,
                    notes: responsePhone.rows[ii].notes_phone,
                    deleted: responsePhone.rows[ii].deleted_phone
                }
                phoneNumbers.push(telephone);
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


    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    // Añadimos los números de telefono de cada contacto  - we add the phone numbers of each contact


    return result;
}


/**
 ** Obtener la descripcion del pais por id en el idioma solicitado
 
 *@Params countryId, languageId
 --------------------------------
 */

async function getCountryById(countryId, languageId) {
    const __functionName = 'getCountryById';
    const param = [countryId, languageId];
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
 ** Obtener el id de la red por defecto
 ** Get network id by default
 *@Params 
 --------------------------------
 */
async function getDefaultNetwork() {
    const __functionName = 'getDefaultNetwork';

    let result = '';
    try {
        let response = await conectionDB.pool.query(queries.getDefaultNetwork);
        if (response.rowCount != 0)
            result = response.rows[0].id;
    } catch (err) {
        const error = new error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };
    return result;
}


/**
 ** Obtener el estado del site por defecto
 ** Get status id by defalt
 **    @Params 
 **  -- -- -- -- --
 */
async function getDefaultStatus() {
    const __functionName = 'defaultStatus';

    let result = '';
    try {
        let response = await conectionDB.pool.query(queries.getDefaultStatus);
        if (response.rowCount != 0)
            result = response.rows[0].id;
    } catch (err) {
        const error = new error.createPgError(err, __moduleName, __functionName);
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
 ** Obtiene los datos de la licencia por id
 ** Get license for ID
 *@Params licenseId
 --------------------------------
 */
async function getLicenseById(licenseId) {
    const __functionName = 'getLicenseById';
    const param = [licenseId];

    let result = {};
    let valid = true;
    const today = new Date();
    try {
        let response = await conectionDB.pool.query(queries.getLicenseById, param);
        if (response.rowCount != 0)
            result = {
                id: response.rows[0].id_license,
                activationDate: response.rows[0].activation_date,
                expirationDate: response.rows[0].expiration_date,
                durationMonths: response.rows[0].duration_months,
                licenseNumber: response.rows[0].license_number,
                valid: today > result.expiration_date ? false : true
            };
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
 
 *@Params venueId, languageId
 --------------------------------
 */

async function getLocationByVenueId(venueId, languageId) {
    const __functionName = 'getLocationByVenueId';

    let result = [];
    let territorialOrg = new Array();
    let locationObject = new Array();

    try {
        // Obtenemos las descripciones de las organizaciones territoriales
        // Get descriptions of the territorial organizations
        let param = [languageId];
        let response = await conectionDB.pool.query(queries.getTerritorialOrganization, param)
        territorialOrg = response.rows;

        // Obtenemos las descripciones de las entidades territoriales del local
        // Get descriptions of the territorial entities by venue
        param = [venueId, languageId];
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

        locationObject[ind] = new clase.Location(result[ind].id, result[ind].id_territorial_org, description.text_,
            result[ind].id_territorial_ent, result[ind].text_);
    }
    return locationObject;
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
                description: response.rows[0].description,
                deleted: response.rows[0].deleted
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
 *@Params networkId, languageId
 --------------------------------
 */
async function getNetworkById(networkId, languageId) {
    const __functionName = 'getNetworkById';
    const param = [networkId, languageId];
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
 *@Params OrientationId, languageId
 --------------------------------
 */
async function getOrientationById(orientationId, languageId) {

    const __functionName = 'getOrientationById';
    const param = [orientationId, languageId];
    let result = {};

    if (orientationId == null) return result;
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
 ** Obtener la descripcion del tipo de via por id en el idioma solicitado
 
 
 *@Params typeRoadId, languageId
 --------------------------------
 */

async function getRoadTypeById(typeRoadId, languageId) {
    const __functionName = 'getRoadTypeById';
    const param = [typeRoadId, languageId];
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
 ** Obtener el horario de apertura de un local
 ** Get the opening hours of a venue
 *@Params venueId, week
 --------------------------------
 */

async function getScheduleByVenueId(venueId, week) {
    const __functionName = 'getScheduleByVenueId';
    let param = [venueId];
    let result = [];
    let schedule = {};
    let semana = new Array();
    let dia = {};
    let horariosLocal = new Array;


    try {
        let response = await conectionDB.pool.query(queries.getSchedulesByVenueId, param);
        response.rows.forEach(elem => horariosLocal.push([elem.id, elem.id_customer_schedule]));
        for (let ii = 0; ii < horariosLocal.length; ii++) {
            param = [horariosLocal[ii][1]];


            let resp = await conectionDB.pool.query(queries.getScheduleVenueById, param);

            let inicio = 0
            for (let i = 0; i < 7; i++) {
                let horario = resp.rows[0].week_schedule.substr(inicio, 18)
                let descriptionDay = week.find(element => (element.id == horario.substr(1, 1)));
                dia = {
                    day: horario.substr(1, 1),
                    descriptionDay: descriptionDay.text_,
                    openingTime1: horario.substr(2, 2) + ':' + horario.slice(4, 6),
                    closingTime1: horario.substr(6, 2) + ':' + horario.slice(8, 10),
                    openingTime2: horario.substr(10, 2) != '--' ? horario.substr(10, 2) + ':' + horario.slice(12, 14) : null,
                    closingTime2: horario.substr(14, 2) != '--' ? horario.substr(14, 2) + ':' + horario.slice(16, 18) : null
                }
                semana.push(dia);
                inicio = inicio + 18;
            }
            let fecha = moment(resp.rows[0].start_date.substr(0, 2) + "/" + resp.rows[0].start_date.substr(2, 2) + "/2000", "DD/MM/YYYY");



            schedule = {
                //                id: resp.rows[0].id,
                id: horariosLocal[ii][0],
                idCustomerSchedule: horariosLocal[ii][1],
                description: resp.rows[0].description,
                startDate: {
                    id: resp.rows[0].start_date,
                    description: fecha.format('Do MMMM')
                },
                weekly: semana,
                deleted: resp.rows[0].deleted
            }
            semana = [];
            result.push(schedule);


        }

        return result;

    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw err.userMessage;
    };

}
/**
 ** Obtener tipos de horarios por idioma
 ** Get types of schedules by language
 *@Params languageId
 --------------------------------
 */

async function getScheduleTypes(languageId) {
    const __functionName = 'getScheduleTypes';
    const param = [languageId];
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
        if (response.rowCount != 0)
            result = {
                id: response.rows[0].id_screen_location,
                description: response.rows[0].description,
                deleted: response.rows[0].deleted
            };
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
 *@Params ScreenTypeId, languageId
 --------------------------------
 */
async function getScreenTypeById(ScreenTypeId, languageId) {
    const __functionName = 'getScreenTypeById';
    const param = [ScreenTypeId, languageId];
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
 *@Params venueId, userId, exceptions, customerId) {
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

    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };

    switch (exceptionType) {

        case 0:
            respuesta = result;
            break;
        case 1:
            for (let i = 0; i < result.length; i++) {
                index = exceptions.indexOf(result[i].id_site)
                if (index === -1) respuesta.push(result[i]);
            }
            break;

        case 2:
            for (let i = 0; i < result.length; i++) {
                index = exceptions.indexOf(result[i].id_site)
                if (index != -1) respuesta.push(result[i]);
            }
            break;

    }
    return respuesta;
}

/**
 ** Obtener el nombre del estado del site por id y lenguaje
 ** Get state name by id and languaje
 *@Params siteId, userId, exceptions
 --------------------------------
 */
async function getSiteById(siteId, userId, exceptions) {
    const __functionName = 'getSiteById';
    let result = new Array();
    let respuesta = new Array();
    let customer = [];
    let exceptionType = 0;
    let param = [siteId];
    let customerId;


    try {

        let response = await conectionDB.pool.query(queries.getSitesById, param);
        result = response.rows;

        customerId = result[0].id_customer;
        param = [userId];

        // obtengo los acciones de para cada cliente
        response = await conectionDB.pool.query(queries.getCustomerByIdUser, param);
        customer = response.rows;

        if (customer.length > 0) { // si es 0  es superusuario
            let a = customer.find(elem => elem.id_customer == customerId);

            if (a != undefined) exceptionType = a.exception;

        }

        switch (exceptionType) {
            case 0:
                respuesta = result;
                break;
            case 1: // las excepciones se retiran
                index = exceptions.indexOf(result[0].id_site)
                    // si no esta el id_site en las excepciones 
                if (index === -1) respuesta.push(result[0]);
                break;
            case 2: // solo las excepciones se devuelven
                index = exceptions.indexOf(result[0].id_site)
                if (index != -1) respuesta.push(result[0]);
                break;

        }


    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    }

    return respuesta;

}


/**
 ** Obtener el nombre del estado del site por id y lenguaje
 ** Get state name by id and languaje
 *@Params statusId, languageId
 --------------------------------
 */
async function getStatusById(statusId, languageId) {

    const __functionName = 'getStatusById';
    const param = [statusId, languageId];
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


    try {
        // obtenemos os datos del usuario (superusuario/propietario/otros)
        let response = await conectionDB.pool.query(queries.getUserById, param);


        if (response.rowCount != 0) {
            usuario = response.rows[0];
            if (usuario.rol === 0 || usuario.admin) { // El usuario es superusuario o administrador
                response = await conectionDB.pool.query(queries.getAllVenues);
            } else {
                response = await conectionDB.pool.query(queries.getVenuesByUser, param);
            }
            result = response.rows;
        }
    } catch (err) {
        const error = new Error.createPgError(err, __moduleName, __functionName);
        error.alert();
        throw error.userMessage;
    };

    return result;
}


/**
 ** Obtener locals por id
 ** Get venue data by id
 *@Params venueId
 --------------------------------
 */


async function getVenueById(venueId) {

    const __functionName = 'getVenueById';
    const param = [venueId];
    let result = new Array();

    try {
        let response = await conectionDB.pool.query(queries.getVenueById, param);

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
 *@Params languageId
 --------------------------------
 */

async function getWeekDays(languageId) {
    const __functionName = 'getWeekDays';
    const param = [languageId];
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


/**
 ** Comprueba si un venue es acceible para un usuario
 ** Check if a venue is accessible to a user (true or false)
 *@Params venueId, userId
 --------------------------------
 */

async function validVenueByUser(venueId, userId) {
    const __functionName = 'validVenueByUser';

    let usuario = {};
    let param = [userId];
    let valid = true;
    try {

        // si el usuario es superusuario devolvemos siempre true
        // obtenemos los datos del usuario (superusuario/propietario/otros)
        let response = await conectionDB.pool.query(queries.getUserById, param);
        if (response.rowCount != 0) {
            usuario = response.rows[0];
            if (usuario.rol === 0 || usuario.admin) { // El usuario es superusuario o administrador
                return valid;
            }
            param = [venueId, userId];
            response = await conectionDB.pool.query(queries.getIdVenuesByVenueAndUser, param);
            if (response.rowCount === 0) valid = false;
        } else {
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


module.exports = {
    getBrandById,
    getCategoryBySiteAndUserId,
    getCategoryBySite,
    getComercialCode,
    getContactsByVenueId,
    getCountryById,
    getCustomerAllowedByUser,
    getDefaultNetwork,
    getDefaultStatus,
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
    getSiteById,
    getSitesByVenueIdAndUserId,
    getStatusById,
    getUserById,
    getLicenseById,
    getVenuesByUserId,
    getVenueById,
    getWeekDays,
    validVenueByUser,
    validLicense,
}