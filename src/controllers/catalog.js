const conectionDB = require('../modules/database');
const queries = require('../models/queries');

const { body, validationResult } = require('express-validator');
const config = require('../modules/config');

const Error = require('../modules/errors/index');


const __moduleName = 'src/controllers/catalog';

// constants languajes 

const validLanguages = new Array();
const defaultLanguage = [];
config.localization.langs.forEach(element => {
    validLanguages.push(element.id);
});
defaultLanguage[0] = config.localization.defaultLang;

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
 *@Params languageId
 --------------------------------
 */

const getCountries = (req, res) => {
    const __functionName = 'getCountries';
    let error;
    countries = [];
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res, 1)) return

    // if languaje_id not found to get default languaje
    let languageId = (validLanguages.includes(parseInt(req.params.language_id, 10))) ? [req.params.language_id] : defaultLanguage;

    conectionDB.pool.query(queries.getCountries, languageId)
        .then(response => {
            countries = response.rows.map(elem => {
                return {
                    id: elem.id_country,
                    name: elem.text_
                }
            });
            res.status(200).json({
                result: true,
                data: countries
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
* Obtener lista de duraciones validas de licencias emplazamientos
* Get list of license duration

*@Params 
 --------------------------------
 */

const getDurationLicenses = (req, res) => {
    const __functionName = 'getDurationLicenses';


    res.status(200).json({
        result: true,
        data: config.validDurationLicenses
    });
}


/**
 ** Obtener lista de idiomas
 ** Get list of languagew
*  Tables: language
 *@Params 
 --------------------------------
 */

const getLanguages = (req, res) => {
    const __functionName = 'getLanguages';
    let error;

    conectionDB.pool.query(queries.getLanguages)
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
 *@Params languageId
 --------------------------------
 */

const getOrientations = (req, res) => {
    const __functionName = 'getOrientations';
    let error;
    let languageId = [req.params.language_id];
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res, 1)) return

    conectionDB.pool.query(queries.getOrientations, languageId)
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
 ** Obtener lista de tipos de via en un idioma
 ** Get list of road types by language
 *  Tables: road_type
 *@Params languageId
 --------------------------------
 */

const getRoadTypes = (req, res) => {
    const __functionName = 'getRoadTypes';
    let error;
    let roadTypes = [];
    let languageId = [req.params.language_id];
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res, 1)) return

    conectionDB.pool.query(queries.getRoadTypes, languageId)
        .then(response => {
            roadTypes = response.rows.map(elem => {
                return {
                    id: elem.id_road_type,
                    description: elem.text_
                }
            });
            res.status(200).json({
                result: true,
                data: roadTypes
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
 ** Obtener lista de rols de usuario
 ** Get list of user roles by language
 *  Tables: parameters
 *@Params languageId
 --------------------------------
 */

const getRoles = (req, res) => {
    const __functionName = 'getRols';
    let error;
    let languageId = [req.params.language_id];
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res, 1)) return
    conectionDB.pool.query(queries.getRoles, languageId)
        .then(response => {
            response.rows.forEach(elem => elem.id = parseInt(elem.id, 10));
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
 ** Obtener lista de estados de emplazamientos en un idioma
 ** Get a list of site status by language
 *  Tables: status
 *@Params languajeId
 --------------------------------
 */

const getStatus = (req, res) => {
    const __functionName = 'getStatus';
    let error;
    let languageId = [req.params.language_id];
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res, 1)) return

    conectionDB.pool.query(queries.getStatus, languageId)
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
 *@Params screen_brand_id language_id
 --------------------------------
 */

const getScreenModels = (req, res) => {
    const __functionName = 'getScreenModels';
    let error;
    let result = []

    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res, 1)) return
        //  let param = [req.params.screen_brand_id, req.params.language_id, req.params.screen_type_id];
    let param = [req.params.language_id];

    conectionDB.pool.query(queries.getScreenModels, param)
        .then(response => {
            for (let i = 0; i < response.rows.length; i++) {

                result.push({
                    id: response.rows[i].id_screen_model,
                    description: response.rows[i].description,
                    screenBrandId: response.rows[i].id_screen_brand,
                    screenTypeId: response.rows[i].id_screen_type,
                    screenTypeDescription: response.rows[i].screen_type,
                    resolutionWidth: response.rows[i].resolution_width,
                    resolutionHeight: response.rows[i].resolution_height,
                    measureWidth: response.rows[i].measure_width,
                    measureHeight: response.rows[i].measure_height,
                    pixel: response.rows[i].pixel,
                    inches: response.rows[i].inches,
                    panel: response.rows[i].panel,
                })
            }
            res.status(200).json({
                result: true,
                data: result
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
 *@Params languageId
 --------------------------------
 */

const getScreenTypes = (req, res) => {
    const __functionName = 'getScreenTypes';
    let error;
    let languageId = [req.params.language_id];
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res, 1)) return

    conectionDB.pool.query(queries.getScreenTypes, languageId)
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
 ** Obtener lista de redes de emplazamientos en un idioma
 ** Get list of site networks by language
*  Tables: networks
 *@Params languageId
 --------------------------------
 */

const getNetworks = (req, res) => {
    const __functionName = 'getNetworks';
    let error;
    let languageId = [req.params.language_id];
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res)) return

    conectionDB.pool.query(queries.getNetworks, languageId)
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
 *@Params countryId, languageId
 --------------------------------
 */

const getTerritorialOrganizationByIdCountry = (req, res) => {
    const __functionName = 'getTerritorialOrganizationByIdCountry';
    let error;
    territorialOrganization = [];

    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res, 1)) return
    let param = [req.params.country_id, req.params.language_id];
    conectionDB.pool.query(queries.getTerritorialOrganizationByIdCountry, param)
        .then(response => {

            territorialOrganization = response.rows.map(elem => {
                return {
                    id: elem.id,
                    territorialOrganizationName: elem.text_,
                    hierarchy: elem.hierarchy_
                }
            });

            res.status(200).json({
                result: true,
                data: territorialOrganization
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
 *@Params territorial_org_id, language_id, territorial_ent_id (opcional)
 --------------------------------
 */

const getTerritorialEntitiesByIdTerritorialOrg = (req, res) => {
    const __functionName = 'getTerritorialEntitiesByIdTerritorialOrg';
    let error;
    let territorialEntities = [];
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res, 1)) return
    let relatedEntity = (!req.params.territorial_ent_id) ? 0 : req.params.territorial_ent_id;

    let param = [req.params.territorial_org_id, req.params.language_id, relatedEntity];
    if (!req.params.territorial_ent_id) {
        param = [req.params.territorial_org_id, req.params.language_id];
        conectionDB.pool.query(queries.getAllTerritorialEntitiesByIdTerritorialOrg, param)
            .then(response => {
                territorialEntities = response.rows.map(elem => {
                    return {
                        id: elem.id,
                        territorialEntityName: elem.text_,
                        territorialEntityIdRelation: elem.relation_id
                    }
                });
                res.status(200).json({
                    result: true,
                    data: territorialEntities
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

    } else {
        param = [req.params.territorial_org_id, req.params.language_id, relatedEntity];
        conectionDB.pool.query(queries.getTerritorialEntitiesByIdTerritorialOrg, param)
            .then(response => {
                territorialEntities = response.rows.map(elem => {
                    return {
                        id: elem.id,
                        territorialEntityName: elem.text_,
                        territorialEntityIdRelation: elem.relation_id
                    }
                });
                res.status(200).json({
                    result: true,
                    data: territorialEntities
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
}

/**
 ** Obtener lista de dias de la semana en un idioma
 ** Get list of week days by language
*  Tables: parameter
 *@Params languageId
 --------------------------------
 */

const getWeek = (req, res) => {
    const __functionName = 'getWeek';
    let error;
    let week = []
    let languageId = [req.params.language_id];
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res, 1)) return

    conectionDB.pool.query(queries.getWeekDays, languageId)
        .then(response => {

            week = response.rows.map(elem => {
                return {
                    id: elem.id,
                    description: elem.text_
                }
            });
            res.status(200).json({
                result: true,
                data: week
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
 ** Obtener lista de los meses del año en un idioma
 ** Get list of months by language
*  Tables: parameter
 *@Params languageId
 --------------------------------
 */

const getMonth = (req, res) => {
    const __functionName = 'getMonth';
    let error;
    let week = []
    let languageId = [req.params.language_id];
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res, 1)) return

    conectionDB.pool.query(queries.getMonths, languageId)
        .then(response => {

            week = response.rows.map(elem => {
                return {
                    id: elem.id,
                    description: elem.text_
                }
            });


            res.status(200).json({
                result: true,
                data: week
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

const paramValidation = (err, req, res, errorCode) => {
    const __functionName = 'paramValidation';

    if (!err.isEmpty()) {
        let error = new Error.createValidationError(err, req, __moduleName, __functionName, errorCode);
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
    getDurationLicenses,
    getLanguages,
    getNetworks,
    getOrientations,
    getOs,
    getRoadTypes,
    getRoles,
    getScreenBrands,
    getScreenModels,
    getScreenTypes,
    getStatus,
    getTerritorialOrganizationByIdCountry,
    getTerritorialEntitiesByIdTerritorialOrg,
    getWeek,
    getMonth,
}