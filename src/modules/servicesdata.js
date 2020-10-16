const conectionDB = require('./database');
const queries = require('../models/queries');
const colors = require('colors/safe');
const config = require('./config');
const validator = require('validator');
const { closeSync } = require('fs');


// inicializacion de constantes



/**********************************
 *
 ** Catalogo de funciones de acceso a datos generales y descripciones 
 ** de la aplicación
 *
 ***********************************/
/**
 ** Obtener la descripcion del tipo de via por id en el idioma solicitado
 
 
 *@Params typeRoadId, languajeId
 --------------------------------
 */

async function getRoadTypeById(typeRoadId, languajeId) {

    const param = [typeRoadId, languajeId];
    let result = {};
    try {
        response = await conectionDB.pool.query(queries.getRoadTypeById, param);
        result = {
            id: response.rows[0].id_road_type,
            description: response.rows[0].text_
        };
    } catch (e) {
        a = {
            result: false,
            message: 'error interno de acceso a datos ROADTYPE',
            body: {
                error: e
            }
        };
        console.log(colors.red(`ERR: ${a} ${e}`));

    };
    return result;
}

/**
 ** Obtener la descripcion del pais por id en el idioma solicitado
 
 *@Params countryId, languajeId
 --------------------------------
 */

async function getCountryById(countryId, languajeId) {

    const param = [countryId, languajeId];
    let result = {};

    try {
        response = await conectionDB.pool.query(queries.getCountryById, param)
        result = {
            id: response.rows[0].id_country,
            description: response.rows[0].text_
        };

    } catch (e) {
        a = {
            result: false,
            message: 'error interno de acceso a datos ROADTYPE',
            body: {
                error: e
            }
        };
        console.log(colors.red(`ERR: ${a} ${e}`));

    };
    return result;


}

/**
 ** Obtener descripcion de la marca por id
 
 *@Params brandId
 --------------------------------
 */

async function getBrandById(brandId) {

    const param = [brandId];
    let result = {};

    try {
        response = await conectionDB.pool.query(queries.getBrandById, param)
        result = {
            id: response.rows[0].id_brand,
            description: response.rows[0].description
        };
    } catch (e) {
        a = {
            result: false,
            message: 'error interno de acceso a datos BRAND',
            body: {
                error: e
            }
        };
        console.log(colors.red(`ERR: ${a} ${e}`));
    };
    return result;
}

/**
 ** Obtener descripcion de la region comercial por id
 
 *@Params MarketRegionId
 --------------------------------
 */

async function getMarketRegionById(MarketRegionId) {

    const param = [MarketRegionId];
    let result = {};

    try {
        response = await conectionDB.pool.query(queries.getMarketRegionsById, param)
        result = {
            id: response.rows[0].id_market_region,
            description: response.rows[0].description
        };
    } catch (e) {
        a = {
            result: false,
            message: 'error interno de acceso a datos MAKETREGION',
            body: {
                error: e
            }
        };
        console.log(colors.red(`ERR: ${a} ${e}`));
    };
    return result;
}

/**
 ** Obtener la localizacion de un local por id en el idioma solicitado
 
 *@Params venueId, languajeId
 --------------------------------
 */

async function getLocationByVenueId(venueId, languajeId) {

    let param = [languajeId];
    let result = [];
    let territorialOrg = new Array();

    try {

        // Obtenemos las descripciones de las organizaciones territoriales
        let response = await conectionDB.pool.query(queries.getTerritorialOrganization, param)
        territorialOrg = response.rows;

        // Obtenemos las descripciones de las entidades territoriales del local

        param = [venueId, languajeId];

        console.log(param);

        response = await conectionDB.pool.query(queries.getLocationByVenue, param)
        result = response.rows;

        // Insertamos en cada objeto la descripcion de la organizacion territorial
        for (let ind = 0; ind < result.length; ind++) {

            let description = territorialOrg.find(elemento => elemento.id == result[ind].id_territorial_org);
            Object.defineProperty(result[ind], 'text_org_', {
                value: description.text_,
                writable: true,
                enumerable: true,
                configurable: true
            });
        }

    } catch (e) {
        a = {
            result: false,
            message: 'error interno de acceso a datos ROADTYPE',
            body: {
                error: e
            }
        };
        console.log(colors.red(`ERR: ${a} ${e}`));

    };
    return result;
}


module.exports = {
    getRoadTypeById,
    getCountryById,
    getBrandById,
    getMarketRegionById,
    getLocationByVenueId
}