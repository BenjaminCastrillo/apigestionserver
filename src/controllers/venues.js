const conectionDB = require('../modules/database');
const { body, validationResult } = require('express-validator');
const validator = require('validator');
const config = require('../modules/config');
const queries = require('../models/queries');
const colors = require('colors/safe');
const clase = require('../models/venue');

const { getRoadTypeById, getCountryById, getBrandById, getMarketRegionById, getLocationByVenueId } = require('../modules/servicesdata');

const validLanguajes = [];
const defaultLanguaje = [];
config.localization.langs.forEach(element => {
    validLanguajes.push(element.id);
});
defaultLanguaje[0] = config.localization.defaultLang;




/**
 ** Obtener lista de locales de un usuario
 
 *@Params user_id, languaje_id
 --------------------------------
 */

const getVenuesByUser = (req, res) => {

        const venuesList = new Array();

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
        let id = [req.params.user_id];
        // if languaje_id not found to get default languaje
        let languaje = (validLanguajes.includes(req.params.languaje_id)) ? [req.params.languaje_id] : defaultLanguaje;

        conectionDB.pool.query(queries.getVenuesByUser, id)
            .then((response) => {

                getdescriptions(response.rows, languaje)
                    .then(response => {
                        res.status(200).json(response);

                    })
                    .catch(error => {


                    })
            })
            .catch(e => {
                res.status(500).json({
                    result: false,
                    message: 'error interno de acceso a datos venues',
                    body: {
                        error: e
                    }
                });
                console.log(colors.red(`ERR: ${e}, ${req.method} ${req.headers.host}${req.url}`));

            });




    }
    // Private functions

/**********************************
 *
 ** Obtencion de las descripciones de las propiedades de los locales
 ** Tablas: 
 *@param venues[],languaje[]
 *
 *?response array de objetos Venue
 ***********************************/

async function getdescriptions(venues, languaje) {

    let roadTypeObject = {};
    let brandObject = {};
    let marketRegionObject = {};
    let countryObject = {};
    let location = new Array();
    let placeObject = [];

    for (let i = 0; i < venues.length; i++) {

        roadTypeObject = await getRoadTypeById(venues[i].id_road_type, languaje[0]);
        countryObject = await getCountryById(venues[i].id_country, languaje[0]);
        brandObject = await getBrandById(venues[i].id_brand);
        marketRegionObject = await getMarketRegionById(venues[i].id_market_region);
        location = await getLocationByVenueId(venues[i].id_venue, languaje[0]);

        placeObject[i] = new clase.Venue(venues[i].id_venue, venues[i].name, venues[i].id_customer, venues[i].address, venues[i].street_number,
            venues[i].id_country, countryObject.description, location, venues[i].id_road_type,
            roadTypeObject.description, venues[i].latitude, venues[i].longitude,
            venues[i].postal_code, venues[i].id_brand, brandObject.description, venues[i].id_market_region, marketRegionObject.description);

    }

    return placeObject;
}

module.exports = {

    getVenuesByUser
}