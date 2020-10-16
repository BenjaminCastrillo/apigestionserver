const conectionDB = require('../modules/database');
const queries = require('../models/queries');
const colors = require('colors/safe');
const { body, validationResult } = require('express-validator');
const config = require('../modules/config');
const validator = require('validator');


// inicializacion de constantes

const validLanguajes = new Array();
const defaultLanguaje = [];
config.localization.langs.forEach(element => {
    validLanguajes.push(element.id);
});
defaultLanguaje[0] = config.localization.defaultLang;

/**********************************
 *
 ** Catalogo de datos generales de la aplicación
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
 ** Tablas: country
 *@Params language_id
 --------------------------------
 */

const getCountries = (req, res) => {



    const error = validationResult(req); // resultado de la valoracion el parametro languaje_id numerico

    if (!error.isEmpty()) {
        //  return res.status(400).json({ error: error.array() });
        res.status(400).json({
            result: false,
            message: 'Parametro invalido',
            errorCode: 12,
            body: {
                error: errors
            }
        })
        let txterr = 'ERR: ' + error.errors + req.method + req.headers.host + req.url;
        console.log(colors.red(txterr));
        return;
    }

    // if languaje_id not found to get default languaje
    let id = (validLanguajes.includes(req.params.languaje_id)) ? [req.params.languaje_id] : defaultLanguaje;


    conectionDB.pool.query(queries.getCountries, id)
        .then(response => {
            res.status(200).json(response.rows);
        })
        .catch(e => {
            res.status(500).json({
                result: false,
                message: 'Error interno de acceso a datos',
                body: {
                    error: e
                }
            })
            console.log(colors.red(`ERR: ${e}, ${req.method} ${req.headers.host}${req.url}`));

        });
    return;
}

/**
 ** Obtener lista de tipos de via en un idioma
 
 *@Params language_id
 --------------------------------
 */

const getRoadTypes = (req, res) => {

    let id = [req.params.languaje_id];


    conectionDB.pool.query(queries.getRoadTypes, id)
        .then(response => {
            res.status(200).json(response.rows);
        })
        .catch(e => {
            res.status(500).json({
                result: false,
                message: 'Error interno de acceso a datos',
                body: {
                    error: e
                }
            })
            console.log(colors.red(`ERR: ${e}, ${req.method} ${req.headers.host}${req.url}`));

        });
}

/**
 ** Obtener lista de estados de emplazamientos en un idioma
 
 *@Params language_id
 --------------------------------
 */

const getStatus = (req, res) => {

    let id = [req.params.languaje_id];


    conectionDB.pool.query(queries.getStatus, id)
        .then(response => {
            res.status(200).json(response.rows);
        })
        .catch(e => {
            res.status(500).json({
                result: false,
                message: 'Error interno de acceso a datos',
                body: {
                    error: e
                }
            })
            console.log(colors.red(`ERR: ${e}, ${req.method} ${req.headers.host}${req.url}`));

        });
}

/**
 ** Obtener lista de redes de emplazamientos en un idioma
 
 *@Params language_id
 --------------------------------
 */

const getNetworks = (req, res) => {

    let id = [req.params.languaje_id];

    conectionDB.pool.query(queries.getNetworks, id)
        .then(response => {
            res.status(200).json(response.rows);
        })
        .catch(e => {
            res.status(500).json({
                result: false,
                message: 'Error interno de acceso a datos',
                body: {
                    error: e
                }
            })
            console.log(colors.red(`ERR: ${e}, ${req.method} ${req.headers.host}${req.url}`));

        });
}
module.exports = {
    getInicio,
    getCountries,
    getRoadTypes,
    getStatus,
    getNetworks,
}