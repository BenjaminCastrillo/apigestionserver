const fs = require('fs');
const { body, validationResult } = require('express-validator');
const path = require('path');
const { ramdonNumber, deleteFile, paramValidation } = require('../modules/util');
const conectionDB = require('../modules/database');
const queries = require('../models/queries');
const config = require('../modules/config');

const Error = require('../modules/errors/index');

const clase = require('../models/site');
const {
    getCategoryBySiteAndUserId,

    getCategoryBySite,
    getExceptionSitesByUser,
    getOrientationById,
    getOsById,
    getLicenseById,
    getNetworkById,
    getStatusById,
    getScreenLocationById,
    getScreenBrandById,
    getScreenModelById,
    getScreenTypeById,
    getSiteById,

    validVenueByUser,
} = require('../modules/servicesdatavenuesandsites');

const { getCustomerById } = require('../modules/servicesdatacustomer');

const { createLogger } = require('winston');


//Definimos nombre del módulo
const __moduleName = 'src/controllers/sites';

//  languajes data
const validLanguages = [];
const defaultLanguage = [];
defaultLanguage[0] = config.localization.defaultLang;
config.localization.langs.forEach(element => {
    validLanguages.push(element.id.toString());
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
** Obtener emplazamiento por id
** Get site by id
** 
*@Params site_id, user_id, language_id
 --------------------------------
 */

const sitesById = (req, res) => {
    const __functionName = 'getSitesById';
    const err = validationResult(req); // result of param evaluation 
    const returnSites = true;
    if (!paramValidation(err, req, res, 1)) return
    const userId = req.params.user_id;
    const siteId = req.params.site_id;

    // if language_id not found to get default language
    let language = (validLanguages.includes(req.params.language_id)) ? [req.params.language_id] : defaultLanguage;

    getOneSite(siteId, userId, language[0])
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
        });


}



/**
 ** Actualizacion datos de emplazamientos 
 ** Sites update 

 --------------------------------
 */
const updateSite = (req, res) => {
    const __functionName = 'updateSite';
    let error;
    const fecha = new Date();

    const siteObject = new clase.Site(req.body.id,
        req.body.siteComercialId, req.body.idpti, req.body.venueId,
        req.body.customer.id, req.body.identification, req.body.customer.name,
        req.body.network.id, req.body.network.description, req.body.status.id, req.body.status.description,
        req.body.entryDate, req.body.image, req.body.publicScreen, req.body.on_off, req.body.text,
        req.body.screenLocation.id, req.body.screenLocation.description, req.body.screenLocation.deleted, null,
        req.body.screen.id, req.body.screen.inches, req.body.screen.serialNumber, req.body.screen.screenBrand.id,
        req.body.screen.screenBrand.description, req.body.screen.screenModel.id, req.body.screen.screenModel.description,
        req.body.screen.resolutionWidth, req.body.screen.resolutionHeight, req.body.screen.screenType.id,
        req.body.screen.screenType.description, req.body.screen.situation, req.body.screen.screenType.panel, req.body.screen.pixel, req.body.screen.orientation.id,
        req.body.screen.orientation.description, req.body.screen.screenWidth, req.body.screen.screenHeight,
        req.body.screen.modulesWidth, req.body.screen.modulesHeight,
        req.body.player.id, req.body.player.serialNumber, req.body.player.mac, req.body.player.orientation.id,
        req.body.player.orientation.description, req.body.player.os.id, req.body.player.os.description,
        req.body.player.osVersion, req.body.player.appVersion, req.body.player.license);


    updateSiteData(siteObject)
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
        });

    return
}


const updateStatusSite = (req, res) => {
    const __functionName = 'updateStatusSite';
    let error;
    const fecha = new Date();

    const a = req.body.siteId;
    const b = req.body.newStatus;


    console.log(req.body)

    changeStatusSite(a, b)
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
 ** Borrar un emplazamiento
 ** delete the site by id
 ** Tables: site
 
 --------------------------------
 */


const deleteSite = (req, res) => {

    const __functionName = 'deleteSite';
    const err = validationResult(req); // result of param evaluation 
    if (!paramValidation(err, req, res)) return
    let error;
    const param = parseInt(req.params.id, 10);


    deleteSiteData(param)
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
 ** Obtener imagen de un emplazamiento
 ** To Get the  site's image
 
 *@Params imageId
 --------------------------------
 */

const getImageSite = (req, res) => {
    const __functionName = 'getImageSite';

    let imagen = req.params.image;
    let error;
    let pathImagen = `${imagenDirectory}/sites/${imagen}`;

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noPathImage = path.resolve(__dirname, '../../assets/no-image.jpg');
        res.sendFile(noPathImage);
    };

}



/**
 ** Cargar imagen de un emplazamiento
 ** To load the  site's image
 
 *@Params  file
 --------------------------------
 */

const insertImageSite = (req, res) => {

    const __functionName = 'insertImageSite';
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
        saveImageFileSite(file, imageCodeArray, () => {

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
 ** To load the  site's image
 
 *@Params site_id , imagenfile
 --------------------------------
 */

const putImageSite = (req, res) => {
    const __functionName = 'putImageSite';
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

    // Obtenemos el nombre del archivo

    let param = [siteId];
    conectionDB.pool.query(queries.getSiteImageByFileName, param)
        .then((response) => {
            if (response.rowCount != 0) {
                let fileName = response.rows[0].image;
                archivo.mv(`${imagenDirectory}/sites/${fileName}`, function(e) { // queda pendiente ver si sustituyye el fichero
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
                    value: siteId,
                    msg: 'El codigo no existe',
                    param: 'siteId',
                    location: 'putImageSite'
                }, req, __moduleName, __functionName, "2");
                res.status(400).json({
                    result: false,
                    message: error.userMessage
                });
                error.alert();

            }
        });

    // deleteFile(fileName, imagenDirectory + '/sites/');
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
 *@param venueId, userId,language, returnSites
 **
 *?response un objeto Venue
 ***********************************/

async function getOneSite(siteId, userId, language) {
    const __functionName = 'getOneSite';
    let sites = [];

    let exceptions = [];
    let userExceptions = [];
    let result = [];;



    try {

        // to get exception by user
        exceptions = await getExceptionSitesByUser(userId);

        if (exceptions.length > 0) {
            exceptions.forEach(element => {
                userExceptions.push(element.id)
            });
        }

        result = await getSiteById(siteId, userId, userExceptions);

        if (result.length == 0) {

            return sites;
        }
        let validVenue = await validVenueByUser(result[0].id_venue, userId);
        if (validVenue) {
            sites = await getSitesDescriptions(result, language, userId);

        }

    } catch (err) {
        throw err;

    }
    return sites;
}



/**********************************
 *
 ** Obtencion de las descripciones de las propiedades de los sites
 ** Get the property descriptions of sites
 ** Tablas: 
 *@param venues[],language[],user
 *
 *?response array de objetos sites
 ***********************************/

async function getSitesDescriptions(sites, language, user) {
    const __functionName = 'getSitesDescriptions';

    let networkObject = {};
    let statusObject = {};
    let screenLocationObject = {};
    let screenBrandObject = {};
    let screenModelObject = {};
    let screenTypeObject = {};
    let playerOrientationObject = {};
    let customerObject = {}
    let license = {};
    let osObject = {};
    let site = {};
    let siteObject = new Array();
    let category = new Array();



    let networkName;
    let statusDescription;
    let screenLocationDescription;
    let screenLocationDeleted;
    let screenBrandName;
    let screenModelName;
    let screenTypeDescription;
    let screenTypePanel;
    let screenOrientationDescription;
    let playerOrientationDescription;
    let osName;
    let customerName;
    let identificationCustomer;

    for (let i = 0; i < sites.length; i++) {

        try {

            networkObject = await getNetworkById(sites[i].id_network, language[0]);
            statusObject = await getStatusById(sites[i].id_status, language[0]);
            screenLocationObject = await getScreenLocationById(sites[i].id_screen_location);
            screenBrandObject = await getScreenBrandById(sites[i].id_screen_brand);
            screenModelObject = await getScreenModelById(sites[i].id_screen_model);
            screenTypeObject = await getScreenTypeById(sites[i].id_screen_type, language[0]);
            screenOrientationObject = await getOrientationById(sites[i].id_orientation, language[0]);
            playerOrientationObject = await getOrientationById(sites[i].id_orientation_player, language[0]);
            osObject = await getOsById(sites[i].id_os);
            license = await getLicenseById(sites[i].license_id, language[0]);
            category = await getCategoryBySite(sites[i].id_site);
            customerObject = await getCustomerById(sites[i].id_customer);

            networkName = networkObject.description;
            statusDescription = statusObject.description;
            screenLocationDescription = (JSON.stringify(screenLocationObject) == '{}') ? null : screenLocationObject.description;
            screenLocationDeleted = (JSON.stringify(screenLocationObject) == '{}') ? null : screenLocationObject.deleted;
            screenBrandName = (JSON.stringify(screenBrandObject) == '{}') ? null : screenBrandObject.description;
            screenModelName = (JSON.stringify(screenModelObject) == '{}') ? null : screenModelObject.description;
            screenTypePanel = (JSON.stringify(screenTypeObject) == '{}') ? null : screenTypeObject.panel;
            screenTypeDescription = (JSON.stringify(screenTypeObject) == '{}') ? null : screenTypeObject.description;
            screenOrientationDescription = (JSON.stringify(screenOrientationObject) == '{}') ? null : screenOrientationObject.description;
            playerOrientationDescription = playerOrientationObject.description;
            osName = osObject.description;
            customerName = (JSON.stringify(customerObject) == '{}') ? null : customerObject.name;
            identificationCustomer = (JSON.stringify(customerObject) == '{}') ? null : customerObject.identification;


        } catch (err) {
            throw err;
        }



        site = new clase.Site(sites[i].id_site,
            sites[i].id_site_comercial,
            sites[i].id_pti,
            sites[i].id_venue,
            sites[i].id_customer,
            identificationCustomer,
            customerName,
            sites[i].id_network,
            networkName,
            sites[i].id_status,
            statusDescription,
            sites[i].entry_date,
            sites[i].image,
            sites[i].public_,
            sites[i].on_off,
            sites[i].text_,
            sites[i].id_screen_location,
            screenLocationDescription,
            screenLocationDeleted,
            category,
            sites[i].id_screen,
            sites[i].inches,
            sites[i].serial_,
            sites[i].id_screen_brand,
            screenBrandName,
            sites[i].id_screen_model,
            screenModelName,
            sites[i].resolution_width,
            sites[i].resolution_height,
            sites[i].id_screen_type,
            screenTypeDescription,
            sites[i].situation,
            screenTypePanel,
            sites[i].pixel,
            sites[i].id_orientation,
            screenOrientationDescription,
            sites[i].screen_width,
            sites[i].screen_height,
            sites[i].modules_width,
            sites[i].modules_height,
            sites[i].id_player,
            sites[i].serial_number,
            sites[i].mac,
            sites[i].id_orientation_player,
            playerOrientationDescription,
            sites[i].id_os,
            osName, sites[i].os_version,
            sites[i].app_version,
            license
        );
        siteObject.push(site);


    }


    return siteObject;
}


/**********************************
 *
 ** Actualización datos  de los sites
 ** Update sites data
 ** Tablas: 
 *@param site
 *
 *?response array de objetos sites
 ***********************************/
async function updateSiteData(siteData) {
    const __functionName = 'updateSiteData';


    console.log('site recibido', siteData);


    let fecha = new Date();
    let ano = fecha.getFullYear().toString().substring(2);
    let dataUpdate = [];





    try {
        await conectionDB.pool.query('BEGIN');


        dataUpdate = [siteData.id, siteData.status.id, siteData.publicScreen, siteData.on_off, siteData.text, siteData.screenLocation.id, siteData.image];
        console.log('datos cargados', dataUpdate);
        await conectionDB.pool.query(queries.updateSite, dataUpdate);

        console.log('site actualizado');
        dataUpdate = [siteData.screen.id, siteData.screen.inches, siteData.screen.serialNumber, siteData.screen.screenBrand.id,
            siteData.screen.screenModel.id, siteData.screen.resolutionWidth, siteData.screen.resolutionHeight,
            siteData.screen.screenType.id, siteData.screen.situation, siteData.screen.screenWidth, siteData.screen.screenHeight,
            siteData.screen.orientation.id, siteData.screen.pixel, siteData.screen.modulesWidth, siteData.screen.modulesHeight
        ];
        console.log('datos cargados');
        await conectionDB.pool.query(queries.updateScreen, dataUpdate);
        console.log('screen actualizado');

        dataUpdate = [siteData.player.id, siteData.player.serialNumber, siteData.player.orientation.id];
        console.log('datos cargados');
        await conectionDB.pool.query(queries.updatePlayer, dataUpdate);
        console.log('player actualizado');

        await conectionDB.pool.query('COMMIT');
    } catch (err) {
        conectionDB.pool.query('ROLLBACK');
        throw err;
    }

    return siteData

}



/**********************************
 *
 ** Borrado  de site
 ** delete data site
 ** Tablas: site
 *@param siteId
 
 *
 *?response siteId
 ***********************************/

async function deleteSiteData(siteId) {
    const __functionName = 'deleteSiteData';

    let fecha = new Date();
    const dataQuery = [siteId, fecha];

    try {

        await conectionDB.pool.query(queries.deleteSite, dataQuery);

    } catch (err) {

        throw err;
    }

    return siteId;
}




/**********************************
 *
 ** Cambio estado de site
 ** change status   site
 ** Tablas: site
 *@param siteId, newstatus
 
 *
 *?response siteId
 ***********************************/

async function changeStatusSite(id, newStatus) {
    const __functionName = 'changeStatusSite';

    let fecha = new Date();
    const dataQuery = [id, newStatus];

    console.log('xxxx', dataQuery);

    try {

        await conectionDB.pool.query(queries.updateStatusSite, dataQuery);

    } catch (err) {

        throw err;
    }

    return id;
}


async function saveImageFileSite(file, imageCodeArray, resultadoOk) {
    const __functionName = 'saveImageFileSite';

    let arrayNameFile = [];

    for (let i = 0; i < file.length; i++) {


        // obtenemos el codigo de brand y customer a partir del codigo de imagen

        try {


            respuesta = await conectionDB.pool.query(queries.getSiteByImage, imageCodeArray);

            let idSite = respuesta.rows[0].id_site.toString();

            // formamos el  nombre archivo de imagen definitivo
            arrayNameFile = file[i].name.split('.');
            let imageFileName = idSite.padStart(8, '0') + '-' + imageCodeArray[i] + 'S.' + arrayNameFile[arrayNameFile.length - 1];


            // actualizamos bbdd con el nombre de la imagen
            let param = [idSite, imageFileName];

            response = await conectionDB.pool.query(queries.updateSiteImageById, param);

            // Guardamos el archivo
            file[i].mv(`${imagenDirectory}/sites/${imageFileName}`, function(e) {
                if (e) throw e;
            })

        } catch (err) {
            throw err;
        }



    } // for


    resultadoOk();
    return;
}


module.exports = {
    sitesById,
    updateSite,
    updateStatusSite,
    deleteSite,
    getImageSite,
    insertImageSite,
    putImageSite,
    getSitesDescriptions,

}