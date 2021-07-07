const { body, validationResult } = require('express-validator');
const validator = require('validator');
const fs = require('fs');
const path = require('path');
const conectionDB = require('../modules/database');
const { ramdonNumber, deleteFile } = require('../modules/util');
const config = require('../modules/config');
const queries = require('../models/queries');
const clase = require('../models/venue');

const Error = require('../modules/errors/index');
const {
    getRoadTypeById,
    getCountryById,
    getBrandById,
    getMarketRegionById,
    getWeekDays,
    getScheduleTypes,
    getLocationByVenueId,
    getContactsByVenueId,
    getScheduleByVenueId,
    getSitesByVenueIdAndUserId,
    getVenuesByUserId,
    getExceptionSitesByUser

} = require('../modules/servicesdata');

const { getSitesDescriptions } = require('./sites');

//  languajes data
const validLanguajes = [];
const defaultLanguaje = [];
defaultLanguaje[0] = config.localization.defaultLang;
config.localization.langs.forEach(element => {
    validLanguajes.push(element.id.toString());
});
// extensiones de ficheros de imagenes validas
const validExtensions = config.validExtensions;
const imagenDirectory = config.storage.images;


// module name
const __moduleName = 'src/controllers/venues';

/**
 ** Obtener lista de locales de un usuario
 ** To Get a user's venue list
 
 *@Params userId, languajeId
 --------------------------------
 */

const venuesByUser = (req, res) => {
    const __functionName = 'venuesByUser';
    const err = validationResult(req); // result of param evaluation 
    const returnSites = false;
    if (!paramValidation(err, req, res)) return

    const userId = req.params.user_id;

    let error;

    // if languaje_id not found to get default languaje

    let languaje = (validLanguajes.includes(req.params.languaje_id)) ? [req.params.languaje_id] : defaultLanguaje;
    giveMeAll(userId, languaje, returnSites)
        .then(response => {
            res.json({
                result: true,
                data: response
            });
        })
        .catch(err => {
            res.status(500).json({
                result: false,
                message: err
            });
        })
    return
}

/**
 ** Obtener lista de locales de un usuario
 ** To Get a user's venue list
 **
 *@Params userId, languajeId
 --------------------------------
 */

const venuesAndSitesByUser = (req, res) => {
    const __functionName = 'venuesAndSitesByUser';
    const err = validationResult(req); // result of param evaluation 
    const returnSites = true;
    if (!paramValidation(err, req, res)) return
    const userId = req.params.user_id;

    // if languaje_id not found to get default languaje
    let languaje = (validLanguajes.includes(req.params.languaje_id)) ? [req.params.languaje_id] : defaultLanguaje;
    console.log('---------------------------------');
    giveMeAll(userId, languaje, returnSites)
        .then(response => {
            res.json({
                result: true,
                data: response
            });
        })
        .catch(err => {
            res.status(500).json({
                result: false,
                message: err
            });
        })
}

/**********************************
 *
 ** Devuelve lal lista de venues y sites permitidos para el usuario
 ** xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 ** Tablas: 
 *@param userId,languaje, returnSites
 **
 *?response array de objetos Venue
 ***********************************/

async function giveMeAll(userId, languaje, returnSites) {
    const __functionName = 'giveMeAll';
    let sites = [];
    let venues = [];
    let dataVenues = [];
    let exceptions = [];
    let userExceptions = [];
    let result = [];


    try {

        // to get exception by user
        exceptions = await getExceptionSitesByUser(userId);

        if (exceptions.length > 0) {
            exceptions.forEach(element => {
                userExceptions.push(element.id_site)
            });
        }

        // to get venues's list
        venues = await getVenuesByUserId(userId);

        if (returnSites) {

            // to get sites for each venue
            for (let i = 0; i < venues.length; i++) {
                console.log('*************************************************************');

                result = await getSitesByVenueIdAndUserId(venues[i].id_venue, userId, userExceptions, venues[i].id_customer);
                console.log('elvenue', venues[i].id_venue, 'sus sites', result);
                sites[i] = await getSitesDescriptions(result, languaje, userId);

            }
            // to get venues's description and put  the sites in
        }
        dataVenues = await getVenueDescriptions(venues, languaje, sites);

    } catch (err) {
        throw err;
    }
    return dataVenues;
}



/**
 ** Cargar imagen de un local
 ** To load the  venue's image
 
 *@Params venue_id , imagenfile
 --------------------------------
 */

const putImageVenues = (req, res) => {
    const __functionName = 'putImageVenues';
    const venueId = req.params.venue_id;
    let error;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            result: false,
            message: 'No se ha seleccionado ningun archivo'
        });
    }
    // validamos extension
    let archivo = req.files.archivo;
    let arrayFile = archivo.name.split('.');
    let extension = arrayFile[arrayFile.length - 1];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            result: false,
            message: 'Las extension validas son ' + validExtensions.join(', ')
        });
    }

    // formamos nombre archivo de imagen
    let numero = ramdonNumber(100000, 999999);
    let cadenaNumero = numero.toString();

    let fileName = venueId.padStart(8, '0') + '-' + cadenaNumero + '-V.' + extension;
    // guardamos el archivo
    archivo.mv(`${imagenDirectory}/venues/${fileName}`, function(e) {
        if (e) {
            error = new Error.createSysError(e, req, __moduleName, __functionName, "3");
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        } else {
            // grabar nombre fichero en base de datos
            let param = [venueId, fileName];
            conectionDB.pool.query(queries.putVenuesImageById, param)
                .then((response) => {
                    if (response.rowCount == 0) {
                        deleteFile(fileName, imagenDirectory + '/venues/');
                        error = new Error.createValidationError({
                            value: venueId,
                            msg: 'El codigo no existe',
                            param: 'venueId',
                            location: 'putVenuesImageById'
                        }, req, __moduleName, __functionName, "2");
                        res.status(400).json({
                            result: false,
                            message: error.userMessage
                        });
                        error.alert();

                    } else {
                        res.json({
                            result: true,
                            message: `fichero \'${archivo.name}\' grabado con éxito`
                        });
                    }
                })
                .catch(err => {
                    deleteFile(fileName, imagenDirectory + '/venues/');
                    error = new Error.createPgError(err, __moduleName, __functionName);
                    res.status(500).json({
                        result: false,
                        message: error.userMessage
                    });
                    error.alert();
                });
        }
    })

    return
}


/**
 ** Obtener imagen de un local
 ** To Get the  venue's image
 
 *@Params imageId
 --------------------------------
 */

const getImageVenues = (req, res) => {
    const __functionName = 'getImageVenues';
    let imagen = req.params.image_id;
    let pathImagen = `${imagenDirectory}/venues/${imagen}`;

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noPathImage = path.resolve(__dirname, '../../assets/no-image.jpg');
        res.sendFile(noPathImage);
    };

}


/**
 ** Alta de locales 
 ** Venues registration 
 TENGO QUE ESPERAR A HACER EL FRONT
 --------------------------------
 */
const insertVenue = (req, res) => {
    const __functionName = 'insertVenue';
    let error;
    const fecha = new Date();
    //    const dataQuery = [req.body., ];
    conectionDB.pool.query(queries.insertVenue, dataQuery)
        .then(() => {
            res.status(200).json({
                result: true,
                data: dataQuery
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


// Private functions

/**********************************
 *
 ** Obtencion de las descripciones de las propiedades de los locales
 ** Get the property descriptions of venues
 ** Tablas: 
 *@param venues[],languaje[],sites[][]
 *
 *?response array de objetos Venue
 ***********************************/

async function getVenueDescriptions(venues, languaje, sites) {
    const __functionName = 'getVenueDescriptions';
    let roadTypeObject = {};
    let brandObject = {};
    let marketRegionObject = {};
    let countryObject = {};
    let location = new Array();
    let schedule = new Array();
    let venueObject = new Array();
    let week = new Array();
    let scheduleType = new Array();
    let sitesList = new Array();

    let returnSites = (arguments.length === 3) ? true : false;


    try {
        week = await getWeekDays(languaje[0]);
        scheduleType = await getScheduleTypes(languaje[0]);
    } catch (err) {
        throw err;
    }

    for (let i = 0; i < venues.length; i++) {

        try {

            roadTypeObject = await getRoadTypeById(venues[i].id_road_type, languaje[0]);
            countryObject = await getCountryById(venues[i].id_country, languaje[0]);
            brandObject = await getBrandById(venues[i].id_brand);
            marketRegionObject = await getMarketRegionById(venues[i].id_market_region);

            location = await getLocationByVenueId(venues[i].id_venue, languaje[0]);

            contacts = await getContactsByVenueId(venues[i].id_venue);
            schedule = await getScheduleByVenueId(venues[i].id_venue, week, scheduleType);
            sitesList = (returnSites) ? sites[i] : [];
            groupScheduler(schedule);

        } catch (err) {
            throw err;
        }
        venueObject[i] = new clase.Venue(venues[i].id_venue, venues[i].name, venues[i].image,
            venues[i].id_customer, venues[i].address, venues[i].street_number,
            venues[i].id_country, countryObject.description, location, venues[i].id_road_type,
            roadTypeObject.description, venues[i].latitude, venues[i].longitude,
            venues[i].postal_code, venues[i].id_brand, brandObject.description, brandObject.color,
            brandObject.image, venues[i].id_market_region, marketRegionObject.description,
            contacts, schedule, sitesList);
    }
    return venueObject;
}

/**********************************
 * PARA UTILIZAR EN EL FRONTEND
 ** crea objeto horario del establecimiento agrupado por dias iguales
 ** create schedule object of venue group by weekdays
 *
 *@param schedule
 *?response schedulerObject
 */
const groupScheduler = (schedule) => {
    const __functionName = 'groupScheduler';

    let scheduleType = new Array();
    let dailySchedule;

    //    console.log(JSON.stringify(schedule, null, 5));
    schedule.forEach((element, index) => {
        let dayWeek = [];
        let schedule = [];
        let textWeekSchedule = [];
        let weeklySchedule = [];
        element.weekly.forEach(element2 => {
            dailySchedule = element2.openingTime1 + element2.closingTime1 + element2.openingTime2 + element2.closingTime2;
            if (schedule[schedule.length - 1] != dailySchedule) {

                schedule.push(dailySchedule);

                if (element2.day != '1') {
                    textWeekSchedule.push((dayWeek.length > 1) ?
                        dayWeek[0] + '-' + dayWeek[dayWeek.length - 1] : dayWeek[0]);
                    dayWeek = [];
                }

            }
            dayWeek.push(element2.descriptionDay.substr(0, 3));
        });

        textWeekSchedule.push((dayWeek.length > 1) ? dayWeek[0] + '-' + dayWeek[dayWeek.length - 1] : dayWeek[0]);

        // to build return object

        for (let i = 0; i < textWeekSchedule.length; i++) {

            //     formatearhorario(schedule[i]);
            weeklySchedule[i] = {
                days: textWeekSchedule[i],
                timeTable: formatearhorario(schedule[i])
            }
        }

        scheduleType[index] = {
            description: element.description,
            week: weeklySchedule
        }
    });
    return scheduleType
}

const formatearhorario = (horario) => {


    if (horario.substr(10, 5) === '00:00') {
        horario = horario.substr(0, 10);
        horario = horario.slice(0, 5) + '-' +
            horario.slice(5, 10);
    } else {
        horario = horario.slice(0, 5) + '-' +
            horario.slice(5, 10) + '  ' +
            horario.slice(10, 15) + '-' +
            horario.slice(15, 20);
    }
    return horario;

}


/**********************************
 *
 ** crea objeto error si la validacion de parametros lo requiere
 ** create error object if parameter validation requires it
 *
 *@param errorvalidation
 *?response validation result
 */
const paramValidation = (err, req, res) => {
    const __functionName = 'paramValidation';
    if (!err.isEmpty()) {
        let error = new Error.createValidationError(err.errors, req, __moduleName, __functionName, "1");
        res.status(400).json({
            result: false,
            message: error.userMessage,
        });
        error.alert();
        return false;
    }
    return true;

}

module.exports = {
    venuesByUser,
    venuesAndSitesByUser,
    getImageVenues,
    putImageVenues,
    insertVenue
}