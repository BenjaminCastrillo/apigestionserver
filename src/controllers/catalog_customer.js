const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v4');
const moment = require('moment');
const { body, validationResult } = require('express-validator');

const conectionDB = require('../modules/database');
const queries = require('../models/queries');
const Error = require('../modules/errors/index');
const __moduleName = 'src/controllers/catalog_customer';

const config = require('../modules/config');


// extensiones de ficheros de imagenes validas
const validExtensions = config.validExtensions;
const imagenDirectory = config.storage.images;
const {
    getWeekDays

} = require('../modules/servicesdatavenuesandsites');

const {
    getCustomerSchedules

} = require('../modules/servicesdatacustomer');



/**********************************
 *
 ** Catalogo de datos generales de cliente
 ** General customer data catalog
 *
 ***********************************/
/**
 ** Obtener lista de regiones comerciales de un cliente
 ** Get list of business regions from a customer

 ** Tables: market_region
 *@Params customerId
 --------------------------------
 */

const getMarketRegionsByIdCustomer = (req, res) => {
    const __functionName = 'getMarketRegionsByIdCustomer';

    const err = validationResult(req); // result of param evaluation 
    if (!paramValidation(err, req, res, 1)) return
    letmarketRegions = []
    let error;
    let customerId = [req.params.customer_id];

    conectionDB.pool.query(queries.getMarketRegionsByIdCustomer, customerId)
        .then(response => {

            marketRegions = response.rows.map(elem => {
                return {
                    id: elem.id,
                    description: elem.description,
                    customerId: elem.id_customer,
                    deleted: elem.deleted
                }
            });
            res.status(200).json({
                result: true,
                data: marketRegions
            });
        })
        .catch(e => {
            error = new Error.createPgError(e, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        });
}



/**
 ** Obtener la lista de marcas comerciales para un id de cliente
 ** Get list of trademarks customer id customer
 ** Tablas: brand
 *@Params customerId
 --------------------------------
 */

const getBrandsByIdCustomer = (req, res) => {
    const __functionName = 'getBrandsByIdCustomer';

    const err = validationResult(req); // result of param evaluation 
    let brands = []
    let error;
    let customerId = [req.params.customer_id];

    conectionDB.pool.query(queries.getBrandsByIdCustomer, customerId)
        .then(response => {

            brands = response.rows.map(elem => {
                return {
                    id: elem.id,
                    description: elem.description,
                    image: elem.image,
                    color: elem.color,
                    customerId: elem.id_customer,
                    deleted: elem.deleted
                }
            });


            res.status(200).json({
                result: true,
                data: brands
            })
        })
        .catch(e => {
            error = new Error.createPgError(e, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        });


}


/**
 ** Obtener la lista de localizaciones interiores de pantallas para un id de cliente
 ** Get list of indoor screen location  for a  id client
 ** Tablas: screen_location
 *@Params customerId
 --------------------------------
 */

const getScreenLocationByIdCustomer = (req, res) => {
    const __functionName = 'getScreenLocationByIdCustomer';
    const err = validationResult(req); // result of param evaluation 
    if (!paramValidation(err, req, res, 1)) return
    let error;
    let customerId = [req.params.customer_id];

    conectionDB.pool.query(queries.getScreenLocationByIdCustomer, customerId)
        .then(response => {
            res.status(200).json({
                result: true,
                data: response.rows
            });
        })
        .catch(e => {
            error = new Error.createPgError(e, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        });
}

/**
** Obtener lista de horarios de un un cliente en un idioma
**
**   Get list of schedulers by customer and language *
**    Tables: customer_schedules 
**    @Params customerId,languageId
    -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
**/

const getSchedulesByIdCustomer = (req, res) => {
    const __functionName = 'getSchedulesByIdCustomer';
    let error;
    let languageId = req.params.language_id;
    const err = validationResult(req); // validacion del parametro languaje_id numerico
    if (!paramValidation(err, req, res, 1)) return
    let customerId = req.params.customer_id;

    const codigoLenguaje = config.localization.langs.find(element =>
        element.id === Number(languageId));

    moment.locale(codigoLenguaje.code)


    getSchedulesData(customerId, languageId)
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

async function getSchedulesData(customerId, languageId) {
    let week = new Array();
    let schedule = new Array();
    try {
        week = await getWeekDays(languageId);
        schedule = await getCustomerSchedules(customerId, week);
    } catch (err) {
        throw err;
    }

    return schedule
}

/**
 ** Obtener la lista de codigos validos para el codigo de emplazamiento para un id de cliente
 ** Get list of sites codes  for a  id client
 ** Tablas: site_comercial_code
 *@Params customerId
 --------------------------------
 */

const getSitesCodeByIdCustomer = (req, res) => {
    const __functionName = 'getSitesCodeByIdCustomer';
    const err = validationResult(req); // result of param evaluation 
    if (!paramValidation(err, req, res, 1)) return
    let error;
    let customerId = [req.params.customer_id];

    conectionDB.pool.query(queries.getSiteComercialCodeByIdCustomer, customerId)
        .then(response => {
            if (response.rowCount == 0) {
                customerId = ['0'];
                response = conectionDB.pool.query(queries.getSiteComercialCodeByIdCustomer, customerId)
                    .then(response => {
                        res.status(200).json({
                            result: true,
                            data: response.rows
                        });
                    })
                    .catch(e => {
                        error = new Error.createPgError(e, __moduleName, __functionName);
                        res.status(500).json({
                            result: false,
                            message: error.userMessage
                        });
                        error.alert();
                    })
            } else {
                res.status(200).json({
                    result: true,
                    data: response.rows
                });
            }
        })
        .catch(e => {
            error = new Error.createPgError(e, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        });
}

/**
 ** Cargar imagen de una marca
 ** To load the  brand's image
 
 *@Params  file
 --------------------------------
 */

const insertImageBrand = (req, res) => {

    const __functionName = 'insertImageBrand';
    const expresion = /B|V|C/g;

    // let imageType = req.params.image_type.charAt(0);
    // if (!imageType.toUpperCase().match(expresion)) imageType = 'T';


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
        saveImageFile(file, imageCodeArray, () => {

            res.json({
                result: true,
                message: `ficheros grabados con éxito`
            });
        });

    } catch (e) {
        res.status(500).json({
            result: false,
            message: "No se ha salvado el fichero de la imagen"
        });


    }
    return
}


async function saveImageFile(file, imageCodeArray, resultadoOk) {
    const __functionName = 'saveImageFile';

    let arrayNameFile = [];

    for (let i = 0; i < file.length; i++) {


        // obtenemos el codigo de brand y customer a partir del codigo de imagen

        try {

            //   resp = await conectionDB.pool.query(queries.getBrandsByIdCustomer, [1])

            console.log('codigo de imagen a buscar', imageCodeArray[i])

            respuesta = await conectionDB.pool.query(queries.getBrandByImage, [imageCodeArray[i]]);
            console.log('marca  y cliente ', respuesta.rows[0].id_brand, respuesta.rows[0].id_customer);

            let idBrand = respuesta.rows[0].id_brand.toString();

            let idCustomer = respuesta.rows[0].id_customer.toString();

            // formamos el  nombre archivo de imagen definitivo
            arrayNameFile = file[i].name.split('.');
            let imageFileName = idCustomer.padStart(4, '0') + idBrand.padStart(4, '0') + '-' + imageCodeArray[i] + 'B.' + arrayNameFile[arrayNameFile.length - 1];

            // actualizamos bbdd con el nombre de la imagen
            let param = [idBrand, imageFileName];

            response = await conectionDB.pool.query(queries.updateBrandImageById, param);

            // Guardamos el archivo
            file[i].mv(`${imagenDirectory}/brands/${imageFileName}`, function(e) {
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
 ** Obtener imagen de una empresa
 ** To Get the  brand's image
 
 *@Params brandId
 --------------------------------
 */

const getImageBrand = (req, res) => {
    const __functionName = 'getImageBrand';
    let imagen = req.params.image;
    let pathImagen = `${imagenDirectory}/brands/${imagen}`;

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noPathImage = path.resolve(__dirname, '../../assets/no-image.jpg');
        res.sendFile(noPathImage);
    };

}



/**
 ** Obtener la marca comercial por id de marca
 ** Get the trademark by brand id
 ** Tables: brand
 *@Params brandId
 --------------------------------
 */
/*
const getBrandById = (req, res) => {
    const __functionName = arguments.callee.name;
    let error;
    let brandId = [req.params];
    conectionDB.pool.query(queries.getBrandById, brandId)
        .then(response => {
            res.status(200).json({
                result: true,
                data: response.rows
            });
        })
        .catch(e => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        });
}



*
/
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
        })
        error.alert();
        return false;
    }
    return true;

}

module.exports = {
    getMarketRegionsByIdCustomer,
    getBrandsByIdCustomer,
    getScreenLocationByIdCustomer,
    getSitesCodeByIdCustomer,
    getSchedulesByIdCustomer,
    insertImageBrand,
    getImageBrand,

}