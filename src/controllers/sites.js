const fs = require('fs');
const path = require('path');
const { ramdonNumber, deleteFile } = require('../modules/util');
const conectionDB = require('../modules/database');
const queries = require('../models/queries');
const config = require('../modules/config');

const Error = require('../modules/errors/index');

const clase = require('../models/site');
const {
    getNetworkById,
    getStatusById,
    getScreenLocationById,
    getScreenBrandById,
    getScreenModelById,
    getScreenTypeById,
    getOrientationById,
    getOsById,
    validLicense,
    getCategoryBySiteAndUserId
} = require('../modules/servicesdata');

const { createLogger } = require('winston');


//Definimos nombre del módulo
const __moduleName = 'src/controllers/sites';

//  languajes data
const validLanguajes = [];
const defaultLanguaje = [];
defaultLanguaje[0] = config.localization.defaultLang;
config.localization.langs.forEach(element => {
    validLanguajes.push(element.id.toString());
});

const validExtensions = config.validExtensions;
const imagenDirectory = config.storage.images;

/**********************************
 *
 ** Gestion de datos de emplazamientos 
 ** Site data management
 ** Tables: venue, site
 *
 ***********************************/

/**
*! Obtener lista de sites (con sus locales) de un usuario
*! Get list of sites (with their venues) of a user
*! EN DESUSO
*@Params user_id, languaje_id
 --------------------------------
 */
/*
const getSitesByUser = (req, res) => {
    const __functionName = arguments.callee.name;
    let error;
    let id = [req.params.user_id];
    //  req.params.languaje_id;

    conectionDB.pool.query(queries.getSitesByUser, id)
        .then((response) => {
            res.status(200).json(response.rows);
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName)
            res.status(500).json({
                result: false,
                message: error.userMessage
            });

        });

}
*/
/**
** Obtener lista de sites de un local
** Get list of sites  of a venue
*
*@Params venue_id, languaje_id
 --------------------------------
 *! NO LA ESTOY USANDO SIN EL USUARIO
 */
/* 
const getSitesByVenue = (req, res) => {
    const __functionName = 'getSitesByVenue';
    let error;
    const venueId = [req.params.venue_id];

    // if languaje_id not found to get default languaje

    let languaje = (validLanguajes.includes(req.params.languaje_id)) ? [req.params.languaje_id] : defaultLanguaje;

    conectionDB.pool.query(queries.getSitesByVenueId, venueId)
        .then((response) => {

            getSitesDescriptions(response.rows, languaje)
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
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName)
            res.status(500).json({
                result: false,
                message: error.userMessage
            });

        });
}

*/

/**
** Obtener lista de sites de un local y un usuario (mira las excepciones)
** Get list of sites  of a venue and user
*
*@Params venue_id, user_id, languaje_id
 --------------------------------
 */

const getSitesByVenueUser = (req, res) => {
    const __functionName = 'getsitesByVenueUser';
    let error;
    let removeExceptions = false;
    let userExceptions = [];
    let sites = [];
    const venueId = [req.params.venue_id];
    const userId = [req.params.user_id];


    // if languaje_id not found to get default languaje

    let languaje = (validLanguajes.includes(req.params.languaje_id)) ? [req.params.languaje_id] : defaultLanguaje;
    // Comprobamos  que el usuario tiene acceso a ese venue

    // FALTA POR HACER

    // Comprobamos sites prohibidos para el usuario 
    conectionDB.pool.query(queries.getExceptionSitesByUser, userId)
        .then((response) => {
            if (response.rows.length > 0) {
                removeExceptions = true;
                response.rows.forEach(element => {
                    userExceptions.push(element.id_site)
                })
            }
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName)
            res.status(500).json({
                result: false,
                message: error.userMessage
            });

        });
    conectionDB.pool.query(queries.getSitesByVenueId, venueId)
        .then((response) => {
            if (removeExceptions) {
                for (let i = 0; i < response.rows.length; i++) {
                    if (!userExceptions.includes(response.rows[i].id_site)) {
                        sites.push(response.rows[i]);
                    }
                }
            } else {
                sites = response.rows;
            }
            getSitesDescriptions(sites, languaje, userId)
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
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName)
            res.status(500).json({
                result: false,
                message: error.userMessage
            });

        });
}



/**
 ** Cargar imagen de un emplazamiento
 ** To load the  site's image
 
 *@Params site_id , imagenfile
 --------------------------------
 */

const putImageSites = (req, res) => {
    const __functionName = 'putImageSites';
    const siteId = req.params.site_id;
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

    let fileName = siteId.padStart(8, '0') + '-' + cadenaNumero + '-S.' + extension;
    // guardamos el archivo
    archivo.mv(`${imagenDirectory}/sites/${fileName}`, function(e) {
        if (e) {
            error = new Error.createSysError(e, req, __moduleName, __functionName, "3");
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        } else {
            // grabar nombre fichero en base de datos
            let param = [siteId, fileName];
            conectionDB.pool.query(queries.putSitesImageById, param)
                .then((response) => {
                    if (response.rowCount == 0) {
                        deleteFile(fileName, imagenDirectory + '/sites/');
                        error = new Error.createValidationError({
                            value: siteId,
                            msg: 'El codigo no existe',
                            param: 'siteId',
                            location: 'putImageSites'
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
                    deleteFile(fileName, imagenDirectory + '/sites/');
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
 ** Obtener imagen de un emplazamiento
 ** To Get the  site's image
 
 *@Params imageId
 --------------------------------
 */

const getImageSites = (req, res) => {
    const __functionName = 'getImageSites';

    let imagen = req.params.image_id;
    let error;
    let pathImagen = `${imagenDirectory}/sites/${imagen}`;
    console.log(imagenDirectory);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noPathImage = path.resolve(__dirname, '../../assets/no-image.jpg');
        res.sendFile(noPathImage);
    };

}

/**********************************
 *
 ** Obtencion de las descripciones de las propiedades de los sites
 ** Get the property descriptions of sites
 ** Tablas: 
 *@param venues[],languaje[],user
 *
 *?response array de objetos sites
 ***********************************/

async function getSitesDescriptions(sites, languaje, user) {
    const __functionName = 'getSitesDescriptions';

    let networkObject = {};
    let statusObject = {};
    let screenLocationObject = {};
    let screenBrandObject = {};
    let screenModelObject = {};
    let screenTypeObject = {};
    let playerOrientationObject = {};
    let osObject = {};
    let site = {};
    let siteObject = new Array();
    let category = new Array();



    let networkName;
    let statusDescription;
    let screenLocationDescription;
    let screenBrandName;
    let screenModelName;
    let screenTypeDescription;
    let screenOrientationDescription;
    let playerOrientationDescription;
    let osName;
    let statusLicense;

    for (let i = 0; i < sites.length; i++) {

        try {

            networkObject = await getNetworkById(sites[i].id_network, languaje[0]);
            statusObject = await getStatusById(sites[i].id_status, languaje[0]);
            screenLocationObject = await getScreenLocationById(sites[i].id_screen_location);
            screenBrandObject = await getScreenBrandById(sites[i].id_screen_brand);
            screenModelObject = await getScreenModelById(sites[i].id_screen_model);
            screenTypeObject = await getScreenTypeById(sites[i].id_screen_type, languaje[0]);
            screenOrientationObject = await getOrientationById(sites[i].id_orientation, languaje[0]);
            playerOrientationObject = await getOrientationById(sites[i].id_orientation_player, languaje[0]);
            osObject = await getOsById(sites[i].id_os);
            statusLicense = await validLicense(sites[i].license_id);
            category = await getCategoryBySiteAndUserId(sites[i].id_site, Number(user[0]));

            networkName = networkObject.description;
            statusDescription = statusObject.description;
            screenLocationDescription = (JSON.stringify(screenLocationObject) == '{}') ? null : screenLocationObject.description;
            screenBrandName = (JSON.stringify(screenBrandObject) == '{}') ? null : screenBrandObject.description;
            screenModelName = (JSON.stringify(screenModelObject) == '{}') ? null : screenModelObject.description;
            screenTypeDescription = (JSON.stringify(screenTypeObject) == '{}') ? null : screenTypeObject.description;
            screenOrientationDescription = (JSON.stringify(screenOrientationObject) == '{}') ? null : screenOrientationObject.description;
            playerOrientationDescription = playerOrientationObject.description;
            osName = osObject.description;

        } catch (err) {
            throw err;
        }
        site = new clase.Site(sites[i].id_site,
            sites[i].id_site_comercial,
            sites[i].id_pti,
            sites[i].id_venue,
            sites[i].id_customer,
            sites[i].id_network,
            networkName,
            sites[i].id_status,
            statusDescription,
            sites[i].entry_date,
            sites[i].public_,
            sites[i].on_off,
            sites[i].text_,
            sites[i].id_screen_location,
            screenLocationDescription,
            category,
            sites[i].id_screen,
            sites[i].inches,
            sites[i].serial_,
            sites[i].id_screen_brand,
            screenBrandName,
            sites[i].id_screen_model,
            screenModelName,
            sites[i].resolution_width,
            sites[i].resolution_heigth,
            sites[i].id_screen_type,
            screenTypeDescription,
            sites[i].situation,
            sites[i].id_orientation,
            screenOrientationDescription,
            sites[i].cabinets_width,
            sites[i].cabinets_heigth,
            sites[i].id_player,
            sites[i].serial_number,
            sites[i].mac,
            sites[i].id_orientation_player,
            playerOrientationDescription,
            sites[i].id_os,
            osName, sites[i].os_version,
            sites[i].app_version,
            statusLicense
        );
        siteObject.push(site);


    }
    return siteObject;
}


module.exports = {
    // getSitesByUser,
    // getSitesByVenue,
    getImageSites,
    putImageSites,
    getSitesByVenueUser,
    getSitesDescriptions
}