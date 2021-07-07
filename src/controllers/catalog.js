const conectionDB = require('../modules/database');
const queries = require('../models/queries');

const { body, validationResult } = require('express-validator');
const config = require('../modules/config');

const Error = require('../modules/errors/index');


const __moduleName = 'src/controllers/catalog';

// constants languajes 

const validLanguajes = new Array();
const defaultLanguaje = [];
config.localization.langs.forEach(element => {
    validLanguajes.push(element.id);
});
defaultLanguaje[0] = config.localization.defaultLang;

/**********************************
 *
 ** Catalogo de datos generales de la aplicación
 ** General data catalog of the application
 *
 ***********************************/

// Prueba servidor
const getInicio = (req, res) => {

    res.status(200).send(
        "<h1>Pagina de inicio</h1>"
    );
}

/**
 ** Obtener lista de paises en un idioma
 ** Get countries list by language
 *  Tables: country
 *@Params languajeId
 --------------------------------
 */

const getCountries = (req, res) => {
    const __functionName = 'getCountries';
    let error;
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res)) return

    // if languaje_id not found to get default languaje
    let languajeId = (validLanguajes.includes(req.params.languaje_id)) ? [req.params.languaje_id] : defaultLanguaje;

    conectionDB.pool.query(queries.getCountries, languajeId)
        .then(response => {
            res.status(200).json({
                result: true,
                data: response.rows
            });
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();
        });
    return;
}

/**
 ** Obtener lista de tipos de via en un idioma
 ** Get list of road types by language
 *  Tables: road_type
 *@Params languajeId
 --------------------------------
 */

const getRoadTypes = (req, res) => {
    const __functionName = 'getRoadTypes';
    let error;
    let languajeId = [req.params.languaje_id];
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res)) return

    conectionDB.pool.query(queries.getRoadTypes, languajeId)
        .then(response => {
            res.status(200).json({
                result: true,
                data: response.rows
            });
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();
        });
}

/**
 ** Obtener lista de estados de emplazamientos en un idioma
 ** Get a list of site status by language
 *  Tables: status
 *@Params languajeId
 --------------------------------
 */

const getStatus = (req, res) => {
    const __functionName = 'getStatus';
    let error;
    let languajeId = [req.params.languaje_id];
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res)) return

    conectionDB.pool.query(queries.getStatus, languajeId)
        .then(response => {
            res.status(200).json({
                result: true,
                data: response.rows
            });
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        });
}

/**
 ** Obtener lista de marcas de pantallas
 ** Get a list of screen brands
 *  Tables: screen_brand
 *@Params 
 --------------------------------
 */

const getScreenBrands = (req, res) => {
    const __functionName = 'getScreenBrands';
    let error;

    conectionDB.pool.query(queries.getScreenBrands)
        .then(response => {
            res.status(200).json({
                result: true,
                data: response.rows
            });
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        });
}

/**
 ** Obtener lista de modelos de pantallas
 ** Get a list of models brands
 *  Tables: screen_model
 *@Params screen_brand_id languaje_id
 --------------------------------
 */

const getScreenModels = (req, res) => {
    const __functionName = 'getScreenModels';
    let error;

    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res)) return
    let param = [req.params.screen_brand_id, req.params.languaje_id];
    conectionDB.pool.query(queries.getScreenModels, param)
        .then(response => {
            res.status(200).json({
                result: true,
                data: response.rows
            });
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        });
}


/**
 ** Obtener lista de tipos de pantallas en un idioma
 ** Get list of screen types by language
*  Tables: screen_type
 *@Params languajeId
 --------------------------------
 */

const getScreenTypes = (req, res) => {
    const __functionName = 'getScreenTypes';
    let error;
    let languajeId = [req.params.languaje_id];
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res)) return

    conectionDB.pool.query(queries.getScreenTypes, languajeId)
        .then(response => {
            res.status(200).json({
                result: true,
                data: response.rows
            });
        })
        .catch(e => {
            error = new Error.createPgError(err, __moduleName, __functionName)
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        });
}


/**
 ** Obtener lista de orientaciones de pantalla en un idioma
 ** Get list of screen orientations by language
*  Tables: parameter
 *@Params languajeId
 --------------------------------
 */

const getOrientations = (req, res) => {
    const __functionName = 'getOrientations';
    let error;
    let languajeId = [req.params.languaje_id];
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res)) return

    conectionDB.pool.query(queries.getOrientations, languajeId)
        .then(response => {
            res.status(200).json({
                result: true,
                data: response.rows
            });
        })
        .catch(e => {
            error = new Error.createPgError(err, __moduleName, __functionName)
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        });
}



/**
 ** Obtener lista de sistemas operativos de los player
 ** Get a list of OS 
 *  Tables: operating_system
 *@Params 
 --------------------------------
 */

const getOs = (req, res) => {
    const __functionName = 'getScreenBrands';
    let error;

    conectionDB.pool.query(queries.getOs)
        .then(response => {
            res.status(200).json({
                result: true,
                data: response.rows
            });
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        });
}

/**
 ** Obtener lista de redes de emplazamientos en un idioma
 ** Get list of site networks by language
*  Tables: networks
 *@Params languajeId
 --------------------------------
 */

const getNetworks = (req, res) => {
    const __functionName = 'getNetworks';
    let error;
    let languajeId = [req.params.languaje_id];
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res)) return

    conectionDB.pool.query(queries.getNetworks, languajeId)
        .then(response => {
            res.status(200).json({
                result: true,
                data: response.rows
            });
        })
        .catch(e => {
            error = new Error.createPgError(err, __moduleName, __functionName)
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        });
}




/**
 ** Obtener lista elementos de la organizacion territorial de un pais en un idioma
 ** Get a list of elements of the territorial organization of a country in a language
*  Tables: territorial_organization
 *@Params countryId, languajeId
 --------------------------------
 */

const getTerritorialOrganizationByIdCountry = (req, res) => {
    const __functionName = 'getTerritorialOrganizationByIdCountry';
    let error;

    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res)) return
    let param = [req.params.country_id, req.params.languaje_id];
    conectionDB.pool.query(queries.getTerritorialOrganizationByIdCountry, param)
        .then(response => {
            res.status(200).json({
                result: true,
                data: response.rows
            });
        })
        .catch(e => {
            error = new Error.createPgError(err, __moduleName, __functionName)
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        });
}

/**
 ** Obtener lista entidades territoriales de una la organizacion territorial en un idioma
 ** Get a list of elements of the territorial organization of a country in a language
*  Tables: territorial_entities
 *@Params territorial_org_id, languaje_id, territorial_ent_id (opcional)
 --------------------------------
 */

const getTerritorialEntitiesByIdTerritorialOrg = (req, res) => {
    const __functionName = 'getTerritorialEntitiesByIdTerritorialOrg';
    let error;

    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res)) return
    let relatedEntity = (!req.params.territorial_ent_id) ? 0 : req.params.territorial_ent_id;
    // relatedEntity = null;

    let param = [req.params.territorial_org_id, req.params.languaje_id, relatedEntity];
    conectionDB.pool.query(queries.getTerritorialEntitiesByIdTerritorialOrg, param)
        .then(response => {
            res.status(200).json({
                result: true,
                data: response.rows
            });
        })
        .catch(e => {
            error = new Error.createPgError(err, __moduleName, __functionName)
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        });
}


/********************************************"
 *            PRIVADO
 *******************************************/
// crea objeto error si la validacion de parametros lo requiere
// create error object if parameter validation requires it

const paramValidation = (err, req, res) => {
    const __functionName = 'paramValidation';

    if (!err.isEmpty()) {
        let error = new Error.createValidationError(err, req, __moduleName, __functionName);
        res.status(400).json({
            result: false,
            message: error.userMessage,
        })
        error.alert();
        return false;
    }
    return true;

}

module.exports = {
    getInicio,
    getCountries,
    getRoadTypes,
    getStatus,
    getNetworks,
    getTerritorialOrganizationByIdCountry,
    getTerritorialEntitiesByIdTerritorialOrg,
    getScreenBrands,
    getScreenModels,
    getScreenTypes,
    getOrientations,
    getOs
}