const { body, validationResult } = require('express-validator');
const validator = require('validator');
const fs = require('fs');
const path = require('path');
const conectionDB = require('../modules/database');
const moment = require('moment');
const { ramdonNumber, deleteFile, zeroFill } = require('../modules/util');
const config = require('../modules/config');
const queries = require('../models/queries');
const clase = require('../models/venue');

const Error = require('../modules/errors/index');
const {
    getBrandById,
    getComercialCode,
    getContactsByVenueId,
    getCountryById,
    getDefaultNetwork,
    getDefaultStatus,
    getExceptionSitesByUser,
    getLocationByVenueId,
    getMarketRegionById,
    getRoadTypeById,
    getScheduleByVenueId,
    getScheduleTypes,
    getSitesByVenueIdAndUserId,
    getVenueById,
    getVenuesByUserId,
    getWeekDays,
    validVenueByUser,

} = require('../modules/servicesdatavenuesandsites');

const { getCustomerById } = require('../modules/servicesdatacustomer');

const { getSitesDescriptions } = require('./sites');

//  languages data
const validLanguages = [];
const defaultLanguage = [];
defaultLanguage[0] = config.localization.defaultLang;
config.localization.langs.forEach(element => {
    validLanguages.push(element.id.toString());
});
// extensiones de ficheros de imagenes validas
const validExtensions = config.validExtensions;
const imagenDirectory = config.storage.images;


// module name
const __moduleName = 'src/controllers/venues';

/**
 ** Obtener lista de locales de un usuario
 ** To Get a user's venue list
 
 *@Params userId, languageId
 --------------------------------
 */

const venuesByUser = (req, res) => {
    const __functionName = 'venuesByUser';
    const err = validationResult(req); // result of param evaluation 
    const returnSites = false;
    if (!paramValidation(err, req, res, 1)) return

    const userId = req.params.user_id;

    // if languajg_id not found to get default language

    let language = (validLanguages.includes(req.params.language_id)) ? req.params.language_id : defaultLanguage;

    getAllVenues(userId, language, returnSites)
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
 *@Params userId, languageId
 --------------------------------
 */

const venuesAndSitesByUser = (req, res) => {
    const __functionName = 'venuesAndSitesByUser';
    const err = validationResult(req); // result of param evaluation 
    const returnSites = true;
    if (!paramValidation(err, req, res, 1)) return
    const userId = req.params.user_id;

    // if language_id not found to get default language
    let language = (validLanguages.includes(req.params.language_id)) ? [req.params.language_id] : defaultLanguage;

    getAllVenues(userId, language, returnSites)
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

/**
 ** Obtener los datos de un local por id
 ** Get the data venue for venue id
 **
 *@Params venueId,userId, languageId
 --------------------------------
 */

const venueAndSitesById = (req, res) => {
    const __functionName = 'venueAndSitesById';
    const err = validationResult(req); // result of param evaluation 
    const returnSites = true;
    if (!paramValidation(err, req, res, 1)) return
    const userId = req.params.user_id;
    const venueId = req.params.venue_id;

    // if language_id not found to get default language
    let language = (validLanguages.includes(req.params.language_id)) ? [req.params.language_id] : defaultLanguage;

    getOneVenue(venueId, userId, language, returnSites)
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

/**
 ** Obtener los datos de un local  por id
 ** Get the data venue for venue id
 **
 *@Params venueId,userId, languageId
 --------------------------------
 */

const venueById = (req, res) => {
    const __functionName = 'venueById';
    const err = validationResult(req); // result of param evaluation 
    const returnSites = false;
    if (!paramValidation(err, req, res, 1)) return
    const userId = req.params.user_id;
    const venueId = req.params.venue_id;

    // if language_id not found to get default language
    let language = (validLanguages.includes(req.params.language_id)) ? [req.params.language_id] : defaultLanguage;

    getOneVenue(venueId, userId, language, returnSites)
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


/**
 ** Alta de locales 
 ** Venues registration 
 TENGO QUE ESPERAR A HACER EL FRONT ya lo he hecho
 --------------------------------
 */
const insertVenue = (req, res) => {
    const __functionName = 'insertVenue';
    let error;
    const fecha = new Date();


    const venueObject = new clase.Venue(req.body.id,
        req.body.name, req.body.image, req.body.customer.id, req.body.customer.identification,
        req.body.customer.name, req.body.address, req.body.streetNumber,
        req.body.country.id, req.body.country.description, req.body.location,
        req.body.roadType.id, req.body.roadType.description, req.body.latitude, req.body.longitude,
        req.body.postalCode, req.body.brand.id,
        req.body.brand.description, req.body.brand.color, req.body.brand.image,
        req.body.brand.deleted, req.body.marketRegion.id, req.body.marketRegion.description,
        req.body.marketRegion.deleted, fecha, req.body.contact,
        req.body.schedule, req.body.sites);



    conectionDB.pool.query(queries.getNextIdVenue)
        .then((response) => {
            insertVenueData(venueObject, req.body.newSite, response.rows[0].nextval)
                .then(response => {
                    res.json({
                        result: true,
                        data: response,
                        message: null
                    });
                })
                .catch(err => {

                    res.status(500).json({
                        result: false,
                        message: 'Error interno del servidor'
                    });
                })
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: 'Error interno del servidor'
            });
            error.alert();
        });

    return;
}



/**
 ** Actualizacion datos de locales 
 ** Venues update 

 --------------------------------
 */
const updateVenue = (req, res) => {
    const __functionName = 'updateVenue';
    let error;
    const fecha = new Date();

    const venueObject = new clase.Venue(req.body.id,
        req.body.name, req.body.image, req.body.customer.id, req.body.customer.identification,
        req.body.customer.name, req.body.address, req.body.streetNumber,
        req.body.country.id, req.body.country.description, req.body.location,
        req.body.roadType.id, req.body.roadType.description, req.body.latitude, req.body.longitude,
        req.body.postalCode, req.body.brand.id,
        req.body.brand.description, req.body.brand.color, req.body.brand.image,
        req.body.brand.deleted, req.body.marketRegion.id, req.body.marketRegion.description,
        req.body.marketRegion.deleted, fecha, req.body.contact,
        req.body.schedule, req.body.sites);



    updateVenueData(venueObject, req.body.newSite)
        .then(response => {
            res.json({
                result: true,
                data: response,
                message: null
            });
        })
        .catch(err => {
            res.status(500).json({
                result: false,
                message: 'Error interno del servidor'
            });
        })

    return;
}



/**
 ** Borrar un local
 ** delete the venue by id
 ** Tables: venue
 
 --------------------------------
 */


const deleteVenue = (req, res) => {

    const __functionName = 'deleteVenue';
    const err = validationResult(req); // result of param evaluation 
    if (!paramValidation(err, req, res)) return
    let error;
    const param = parseInt(req.params.id, 10);


    deleteVenueData(param)
        .then(response => {
            res.json({
                result: true,
                data: response,
                message: null
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                result: false,
                message: 'Error interno del servidor'
            });
        })

    return


}




/**
 ** Obtener imagen de  uun local de una empresa
 ** To Get the  brand's image
 
 *@Params VenueId
 --------------------------------
 */

const getImageVenue = (req, res) => {
    const __functionName = 'getImageVenue';
    let imagen = req.params.image;
    let pathImagen = `${imagenDirectory}/venues/${imagen}`;

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noPathImage = path.resolve(__dirname, '../../assets/no-image.jpg');
        res.sendFile(noPathImage);
    };

}


/**
 ** Cargar imagen de un local
 ** To load the  venue's image
 
 *@Params  file
 --------------------------------
 */

const insertImageVenue = (req, res) => {

    const __functionName = 'insertImageVenue';
    const expresion = /B|V|C|S/g;



    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({
            result: false,
            message: 'No se ha seleccionado ningun archivo'
        });
        return
    }

    let file = Array.isArray(req.files.image) ? req.files.image : [req.files.image];
    let imageCodeArray = Array.isArray(req.body.imageCode) ? req.body.imageCode : [req.body.imageCode];

    let hora = new Date();

    file.forEach(element => {
        let arrayNameFile = element.name.split('.');
        let extension = arrayNameFile[arrayNameFile.length - 1];
        if (validExtensions.indexOf(extension) < 0) {
            res.status(400).json({
                result: false,
                message: 'Las extension validas son ' + validExtensions.join(', ')
            });
            return
        }
    });

    try {
        saveImageFileVenue(file, imageCodeArray, () => {

            res.json({
                result: true,
                message: `ficheros grabados con éxito`
            });
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            result: false,
            message: "No se ha salvado el fichero de la imagen"
        });


    }
    return
}



/**
 ** Cargar imagen de un local
 ** To load the  venue's image
 
 *@Params venue_id , imagenfile
 --------------------------------
 */

const putImageVenue = (req, res) => {
    const __functionName = 'putImageVenue';
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

    // Obtenemos el nombre del archivo

    let param = [venueId];
    conectionDB.pool.query(queries.getVenueImageByFileName, param)
        .then((response) => {
            if (response.rowCount != 0) {
                let fileName = response.rows[0].image;
                archivo.mv(`${imagenDirectory}/venues/${fileName}`, function(e) { // queda pendiente ver si sustituyye el fichero
                    if (e) {
                        error = new Error.createSysError(e, req, __moduleName, __functionName, "3");
                        res.status(500).json({
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
                });
            } else {
                error = new Error.createValidationError({
                    value: venueId,
                    msg: 'El codigo no existe',
                    param: 'venueId',
                    location: 'putImageVenue'
                }, req, __moduleName, __functionName, "2");
                res.status(400).json({
                    result: false,
                    message: error.userMessage
                });
                error.alert();

            }
        });

    // deleteFile(fileName, imagenDirectory + '/venues/');
    // error = new Error.createPgError(err, __moduleName, __functionName);
    // res.status(500).json({
    //     result: false,
    //     message: error.userMessage
    // });
    // error.alert();

    return


}



/*--------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------*/



/**********************************
 *
 ** Devuelve lal lista de venues y sites permitidos para el usuario
 ** 
 ** Tablas: 
 *@param userId,language, returnSites
 **
 *?response array de objetos Venue
 ***********************************/

async function getAllVenues(userId, language, returnSites) {
    const __functionName = 'getAllVenues';
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
                userExceptions.push(element.id)
            });
        }


        // to get venues's list
        venues = await getVenuesByUserId(userId);


        if (returnSites) {

            // to get sites for each venue
            for (let i = 0; i < venues.length; i++) {

                result = await getSitesByVenueIdAndUserId(venues[i].id_venue, userId, userExceptions, venues[i].id_customer);

                sites[i] = await getSitesDescriptions(result, language, userId);

            }
            // to get venues's description and put  the sites in

        }

        dataVenues = await getVenueDescriptions(venues, language, sites);

    } catch (err) {
        throw err;
    }
    return dataVenues;
}

/**********************************
 *
 ** Devuelve lal lista de venues y sites permitidos para el usuario
 ** 
 ** Tablas: 
 *@param venueId, userId,language, returnSites
 **
 *?response un objeto Venue
 ***********************************/

async function getOneVenue(venueId, userId, language, returnSites) {
    const __functionName = 'getOneVenue';
    let sites = [];
    let venues = []
    let dataVenue = {};
    let exceptions = [];
    let userExceptions = [];
    let result = [];;


    let validVenue = await validVenueByUser(venueId, userId);

    if (!validVenue) {
        return venues;
    }
    try {

        // to get venues's list

        venues = await getVenueById(venueId);
        if (returnSites) {

            // to get exception by user
            exceptions = await getExceptionSitesByUser(userId);

            if (exceptions.length > 0) {
                exceptions.forEach(element => {
                    userExceptions.push(element.id)
                });
            }
            // to get sites for each venue
            for (let i = 0; i < venues.length; i++) {

                result = await getSitesByVenueIdAndUserId(venues[i].id_venue, userId, userExceptions, venues[i].id_customer);
                sites[i] = await getSitesDescriptions(result, language, userId);

            }
            // to get venues's description and put  the sites in
        }
        dataVenue = await getVenueDescriptions(venues, language, sites);

    } catch (err) {
        throw err;
    }
    return dataVenue;
}




// Private functions

/**********************************
 *
 ** Obtencion de las descripciones de las propiedades de los locales
 ** Get the property descriptions of venues
 ** Tablas: 
 *@param venues[],language[],sites[][]
 *
 *?response array de objetos Venue
 ***********************************/

async function getVenueDescriptions(venues, language, sites) {
    const __functionName = 'getVenueDescriptions';
    let roadTypeObject = {};
    let brandObject = {};
    let marketRegionObject = {};
    let countryObject = {};
    let customerObject = {};
    let location = new Array();
    let schedule = new Array();
    let venueObject = new Array();
    let week = new Array();
    let sitesList = new Array();

    let returnSites = (arguments.length === 3) ? true : false;
    const codigoLenguaje = config.localization.langs.find(element =>
        element.id === Number(language[0]));

    // moment.locale('es');
    moment.locale(codigoLenguaje.code)



    try {
        week = await getWeekDays(language[0]);
        //       scheduleType = await getScheduleTypes(language[0]);
    } catch (err) {
        throw err;
    }

    for (let i = 0; i < venues.length; i++) {


        try {

            roadTypeObject = await getRoadTypeById(venues[i].id_road_type, language[0]);
            countryObject = await getCountryById(venues[i].id_country, language[0]);
            brandObject = await getBrandById(venues[i].id_brand);
            marketRegionObject = await getMarketRegionById(venues[i].id_market_region);

            location = await getLocationByVenueId(venues[i].id_venue, language[0]);

            customerObject = await getCustomerById(venues[i].id_customer);

            contacts = await getContactsByVenueId(venues[i].id_venue);


            schedule = await getScheduleByVenueId(venues[i].id_venue, week);

            sitesList = (returnSites) ? sites[i] : [];

        } catch (err) {

            throw err;
        }

        let fecha = moment(venues[i].entry_date).format('DD-MM-YYYY HH:mm:ss');

        venueObject[i] = new clase.Venue(venues[i].id_venue, venues[i].name, venues[i].image,
            venues[i].id_customer, customerObject.identification, customerObject.name, venues[i].address,
            venues[i].street_number, venues[i].id_country, countryObject.description, location,
            venues[i].id_road_type, roadTypeObject.description, venues[i].latitude, venues[i].longitude,
            venues[i].postal_code, venues[i].id_brand, brandObject.description, brandObject.color,
            brandObject.image, brandObject.deleted, venues[i].id_market_region, marketRegionObject.description,
            marketRegionObject.deleted, fecha, contacts, schedule, sitesList);
    }

    return venueObject;
}



/**********************************
 *
 ** Insercion de los datos de locales
 ** insert   data venues
 ** Tablas:  venue, venue_schedule, contact_venue, contact_phone, location,
 *@param venue, newSites,idVenue
 *
 *?response resul transaction
 ***********************************/

async function insertVenueData(venueData, newSites, idVenue) {
    const __functionName = 'insertVenueData';
    const dataQuery = [idVenue, venueData.customer.id, venueData.name, venueData.roadType.id,
        venueData.address, venueData.streetNumber, venueData.country.id,
        venueData.postalCode, venueData.latitude, venueData.longitude, venueData.marketRegion.id,
        venueData.brand.id, venueData.image, venueData.entryDate
    ];
    const location = venueData.location;
    const schedule = venueData.schedule;
    const contact = venueData.contact;
    const site = newSites;


    let fecha = new Date();

    let ano = fecha.getFullYear().toString().substring(2);
    let dataInsert = [];
    let respuesta;
    let comercialCode = null;
    let idpti = null;
    let licenseNumber = null;


    try {
        // Obtenemos la network y status por defecto para grabar en los sites
        let defaultNetwork = await getDefaultNetwork();
        let defaultStatus = await getDefaultStatus();

        await conectionDB.pool.query('BEGIN');

        await conectionDB.pool.query(queries.insertVenue, dataQuery);

        for (let i = 0; i < location.length; i++) {
            try {
                dataInsert = [location[i].territorialOrganizationId, location[i].territorialEntityId,
                    idVenue, location[i].hierarchy
                ];
                await conectionDB.pool.query(queries.insertLocationVenue, dataInsert);
            } catch (err) {
                throw err;
            }
        }

        for (let i = 0; i < schedule.length; i++) {
            try {
                dataInsert = [idVenue, schedule[i].idCustomerSchedule];
                await conectionDB.pool.query(queries.insertScheduleVenue, dataInsert);
            } catch (err) {
                throw err;
            }
        }

        for (let i = 0; i < contact.length; i++) {

            try {
                //obtener el codigo de contacto
                respuesta = await conectionDB.pool.query(queries.getNextIdContact);
                // insertar los numeros de telefono
                for (let ii = 0; ii < contact[i].phoneNumbers.length; ii++) {

                    dataInsert = [respuesta.rows[0].nextval, contact[i].phoneNumbers[ii].number, contact[i].phoneNumbers[ii].notes];
                    await conectionDB.pool.query(queries.insertPhoneContactVenue, dataInsert);
                }
                // insertar contacto
                dataInsert = [respuesta.rows[0].nextval, contact[i].name, contact[i].email, contact[i].notes, idVenue];

                await conectionDB.pool.query(queries.insertContactVenue, dataInsert);
            } catch (err) {
                throw err;
            }
        }

        for (let i = 0; i < site.length; i++) {

            try {
                //obtener el id de site
                idSite = await conectionDB.pool.query(queries.getNextIdSite);
                idpti = '6174' + ramdonNumber(2000000, 9999999) + zeroFill(idSite.rows[0].nextval.toString(), 7)
                comercialCode = await getComercialCode(site[i].comercialCodeId);

                // grabamos tabla sites
                dataInsert = [idSite.rows[0].nextval, comercialCode, idpti, idVenue, venueData.customer.id, defaultNetwork, venueData.entryDate, defaultStatus];
                await conectionDB.pool.query(queries.insertSite, dataInsert);

                //obtener el id licencia
                let idlicencia = await conectionDB.pool.query(queries.getNextIdLicense);
                licenseNumber = '73' + ano + ramdonNumber(200000000, 999999999);

                // grabamos  lincense
                dataInsert = [idlicencia.rows[0].nextval, licenseNumber, venueData.entryDate, parseInt(site[i].licenseDuration, 10)];
                await conectionDB.pool.query(queries.insertLicense, dataInsert);

                // grabamos  player
                dataInsert = [idSite.rows[0].nextval, idlicencia.rows[0].nextval];
                await conectionDB.pool.query(queries.insertPlayer, dataInsert);

                // grabamos  screen
                dataInsert = [idSite.rows[0].nextval];
                await conectionDB.pool.query(queries.insertScreen, dataInsert);
            } catch (err) {
                throw err;
            }
        }


        await conectionDB.pool.query('COMMIT');
    } catch (err) {
        console.log('error ', __functionName, err);
        conectionDB.pool.query('ROLLBACK');
        throw err;
    }

    return venueData;



}

/**********************************
 *
 ** Actualizacion de los datos de locales
 ** update data venue
 ** Tablas:  venue, venue_schedule, contact_venue, contact_phone, location,
 *@param venue, 
 *
 *?response resul transaction
 ***********************************/

async function updateVenueData(venueData, newSites) {

    const __functionName = 'updateVenueData';
    const dataQuery = [venueData.id, venueData.customer.id, venueData.name, venueData.roadType.id,
        venueData.address, venueData.streetNumber, venueData.country.id,
        venueData.postalCode, venueData.latitude, venueData.longitude, venueData.marketRegion.id,
        venueData.brand.id, venueData.image
    ];
    const location = venueData.location;
    const schedule = venueData.schedule;
    const contact = venueData.contact;
    const site = newSites;

    let fecha = new Date();
    let ano = fecha.getFullYear().toString().substring(2);
    let dataUpdate = [];
    let dataInsert = [];
    let licenseNumber = null;
    let respuesta;
    let comercialCode = null;
    let idpti = null;



    try {
        // Obtenemos la network y status por defecto para grabar en los sites
        let defaultNetwork = await getDefaultNetwork();
        let defaultStatus = await getDefaultStatus();

        await conectionDB.pool.query('BEGIN');

        await conectionDB.pool.query(queries.updateVenue, dataQuery);
        for (let i = 0; i < location.length; i++) {
            try {
                dataUpdate = [location[i].id, location[i].territorialOrganizationId, location[i].territorialEntityId];
                await conectionDB.pool.query(queries.updateLocationVenue, dataUpdate);
            } catch (err) {
                throw err;
            }
        }

        for (let i = 0; i < schedule.length; i++) {
            try {
                if (schedule[i].id) {
                    dataUpdate = [schedule[i].id, schedule[i].deleted, schedule[i].deleted ? fecha : null];
                    await conectionDB.pool.query(queries.updateScheduleVenue, dataUpdate);

                } else { // registro nuevo
                    dataInsert = [venueData.id, schedule[i].idCustomerSchedule];

                    await conectionDB.pool.query(queries.insertScheduleVenue, dataInsert);

                }
            } catch (err) {
                throw err;
            }
        }


        for (let i = 0; i < contact.length; i++) {

            try {

                if (contact[i].id) {
                    dataUpdate = [contact[i].id, contact[i].name, contact[i].email, contact[i].notes, contact[i].deleted, contact[i].deleted ? fecha : null];
                    await conectionDB.pool.query(queries.updateContactVenue, dataUpdate);
                    for (let ii = 0; ii < contact[i].phoneNumbers.length; ii++) {
                        if (contact[i].phoneNumbers[ii].id) {
                            dataUpdate = [contact[i].phoneNumbers[ii].id, contact[i].id, contact[i].phoneNumbers[ii].number, contact[i].phoneNumbers[ii].notes, contact[i].phoneNumbers[ii].deleted, contact[i].phoneNumbers[ii].deleted ? fecha : null];
                            await conectionDB.pool.query(queries.updatePhoneContactVenue, dataUpdate);

                        } else { //Registro nuevo
                            dataInsert = [contact[i].id, contact[i].phoneNumbers[ii].number, contact[i].phoneNumbers[ii].notes];
                            await conectionDB.pool.query(queries.insertPhoneContactVenue, dataInsert);

                        }

                    }

                } else { // registro nuevo
                    respuesta = await conectionDB.pool.query(queries.getNextIdContact);
                    dataInsert = [respuesta.rows[0].nextval, contact[i].name, contact[i].email, contact[i].notes, venueData.id];

                    await conectionDB.pool.query(queries.insertContactVenue, dataInsert);
                    // insertar los numeros de telefono
                    for (let ii = 0; ii < contact[i].phoneNumbers.length; ii++) {

                        dataInsert = [respuesta.rows[0].nextval, contact[i].phoneNumbers[ii].number, contact[i].phoneNumbers[ii].notes];
                        await conectionDB.pool.query(queries.insertPhoneContactVenue, dataInsert);

                    }
                }
            } catch (err) {
                throw err;
            }
        }
        for (let i = 0; i < site.length; i++) {

            try {
                //obtener el id de site
                idSite = await conectionDB.pool.query(queries.getNextIdSite);
                idpti = '6174' + ramdonNumber(2000000, 9999999) + zeroFill(idSite.rows[0].nextval.toString(), 7)
                comercialCode = await getComercialCode(site[i].comercialCodeId);

                // grabamos tabla sites
                dataInsert = [idSite.rows[0].nextval, comercialCode, idpti, venueData.id, venueData.customer.id, defaultNetwork, venueData.entryDate, defaultStatus];
                await conectionDB.pool.query(queries.insertSite, dataInsert);

                //obtener el id licencia
                let idlicencia = await conectionDB.pool.query(queries.getNextIdLicense);
                licenseNumber = '73' + ano + ramdonNumber(200000000, 999999999);

                // grabamos  license
                dataInsert = [idlicencia.rows[0].nextval, licenseNumber, venueData.entryDate, parseInt(site[i].licenseDuration, 10)];
                await conectionDB.pool.query(queries.insertLicense, dataInsert);

                // grabamos  player
                dataInsert = [idSite.rows[0].nextval, idlicencia.rows[0].nextval];
                await conectionDB.pool.query(queries.insertPlayer, dataInsert);

                // grabamos  screen
                dataInsert = [idSite.rows[0].nextval];
                await conectionDB.pool.query(queries.insertScreen, dataInsert);
            } catch (err) {
                throw err;
            }
        }

        await conectionDB.pool.query('COMMIT');
    } catch (err) {

        conectionDB.pool.query('ROLLBACK');
        throw err;
    }
    return venueData;
}


/**********************************
 *
 ** Borrado  de venue
 ** delete data site
 ** Tablas: site
 *@param venueId
 
 *
 *?response venueId
 ***********************************/

async function deleteVenueData(venueId) {
    const __functionName = 'deleteVenueData';

    let fecha = new Date();
    const dataQuery = [venueId, fecha];

    try {
        await conectionDB.pool.query('BEGIN');
        await conectionDB.pool.query(queries.deleteVenue, dataQuery);
        await conectionDB.pool.query(queries.deleteSiteByIdVenue, dataQuery);
        await conectionDB.pool.query('COMMIT');

    } catch (err) {
        conectionDB.pool.query('ROLLBACK');
        throw err;
    }

    return venueId;
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

async function saveImageFileVenue(file, imageCodeArray, resultadoOk) {
    const __functionName = 'saveImageFileVenue';

    let arrayNameFile = [];

    for (let i = 0; i < file.length; i++) {


        // obtenemos el codigo de brand y customer a partir del codigo de imagen

        try {


            respuesta = await conectionDB.pool.query(queries.getVenueByImage, imageCodeArray);

            let idVenue = respuesta.rows[0].id_venue.toString();

            // formamos el  nombre archivo de imagen definitivo
            arrayNameFile = file[i].name.split('.');
            let imageFileName = idVenue.padStart(8, '0') + '-' + imageCodeArray[i] + 'V.' + arrayNameFile[arrayNameFile.length - 1];


            // actualizamos bbdd con el nombre de la imagen
            let param = [idVenue, imageFileName];

            response = await conectionDB.pool.query(queries.updateVenueImageById, param);

            // Guardamos el archivo
            file[i].mv(`${imagenDirectory}/venues/${imageFileName}`, function(e) {
                if (e) throw e;
            })

        } catch (err) {
            throw err;
        }



    } // for


    resultadoOk();
    return;
}





/**
 ** Obtener imagen de un local
 ** To Get the  venue's image
 
 *@Params imageId
 --------------------------------
 */

// const getImageVenues = (req, res) => {
//     const __functionName = 'getImageVenues';
//     let imagen = req.params.image_id;
//     let pathImagen = `${imagenDirectory}/venues/${imagen}`;

//     if (fs.existsSync(pathImagen)) {
//         res.sendFile(pathImagen);
//     } else {
//         let noPathImage = path.resolve(__dirname, '../../assets/no-image.jpg');
//         res.sendFile(noPathImage);
//     };

// }





/**********************************
 *
 ** crea objeto error si la validacion de parametros lo requiere
 ** create error object if parameter validation requires it
 *
 *@param errorvalidation
 *?response validation result
 */
const paramValidation = (err, req, res, errorCode) => {
    const __functionName = 'paramValidation';
    if (!err.isEmpty()) {
        let error = new Error.createValidationError(err.errors, req, __moduleName, __functionName, errorCode);
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
    venueAndSitesById,
    venueById,
    insertVenue,
    updateVenue,
    deleteVenue,
    getImageVenue,
    putImageVenue,
    insertImageVenue,
}