const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v4');

const conectionDB = require('../modules/database');
const queries = require('../models/queries');
const Error = require('../modules/errors/index');
const __moduleName = 'src/controllers/catalog_customer';

const config = require('../modules/config');


// extensiones de ficheros de imagenes validas
const validExtensions = config.validExtensions;
const imagenDirectory = config.storage.images;

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
    const __functionName = arguments.callee.name;
    let error;
    let customerId = [req.params.customer_id];

    conectionDB.pool.query(queries.getMarketRegionsByIdCustomer, customerId)
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
 ** Obtener la lista de marcas comerciales para un id de cliente
 ** Get list of trademarks customer id customer
 ** Tablas: brand
 *@Params customerId
 --------------------------------
 */

const getBrandsByIdCustomer = (req, res) => {
    const __functionName = arguments.callee.name;
    let error;
    let customerId = [req.params.customer_id];

    conectionDB.pool.query(queries.getBrandsByIdCustomer, customerId)
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
 ** Obtener la lista de localizaciones interiores de pantallas para un id de cliente
 ** Get list of indor screen location  for a  id client
 ** Tablas: screen_location
 *@Params customerId
 --------------------------------
 */

const getScreenLocationByIdCustomer = (req, res) => {
    const __functionName = 'getScreenLocationByIdCustomer';
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
 ** Obtener la lista de codigos validos para el codigo de emplazamiento para un id de cliente
 ** Get list of sites codes  for a  id client
 ** Tablas: site_comercial_code
 *@Params customerId
 --------------------------------
 */

const getSitesCodeByIdCustomer = (req, res) => {
    const __functionName = 'getSitesCodeByIdCustomer';
    let error;
    let customerId = [req.params.customer_id];

    conectionDB.pool.query(queries.getSiteComercialCodeByIdCustomer, customerId)
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
    // console.log(req.files);
    // console.log(req.body);

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

    console.log('-----------------------------------------------------', hora);
    console.log('los datos que recibimos en formato tabla:');
    console.log(file);
    console.log(imageCodeArray);

    try {
        saveImageFile(file, imageCodeArray, () => {
            console.log('envio resultado');
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

    console.log('salgo por el final');

    return
}


async function saveImageFile(file, imageCodeArray, resultadoOk) {
    const __functionName = 'saveImageFile';

    let arrayNameFile = [];


    for (let i = 0; i < file.length; i++) {
        console.log(i);

        // obtenemos el codigo de brand y customer a partir del codigo de imagen

        try {

            resp = await conectionDB.pool.query(queries.getBrandsByIdCustomer, [1])
            console.log('las brands que hay ahora', resp.rows);


            console.log('vamos a actualizar la tabla de brand', imageCodeArray[i]);
            respuesta = await conectionDB.pool.query(queries.getBrandByImage, [imageCodeArray[i]]);
            console.log('lo que encuentro para el codigo de imagen ', respuesta);

            let idBrand = respuesta.rows[0].id_brand.toString();
            let idCustomer = respuesta.rows[0].id_customer.toString();

            // formamos el  nombre archivo de imagen definitivo
            arrayNameFile = file[i].name.split('.');
            let imageFileName = idCustomer.padStart(4, '0') + idBrand.padStart(4, '0') + '-' + imageCodeArray[i] + 'B.' + arrayNameFile[arrayNameFile.length - 1];

            // actualizamos bbdd con el nombre de la imagen
            let param = [idBrand, imageFileName];
            console.log('los datos para actualizar la tabla brand', param);
            response = await conectionDB.pool.query(queries.updateBrandImageById, param);

            // Guardamos el archivo
            file[i].mv(`${imagenDirectory}/brands/${imageFileName}`, function(e) {
                if (e) throw e;
            })

        } catch (err) {
            throw err;
        }



    } // for

    console.log('estoy al final de la funcion saveImageFile');
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

*/


module.exports = {
    getMarketRegionsByIdCustomer,
    getBrandsByIdCustomer,
    getScreenLocationByIdCustomer,
    getSitesCodeByIdCustomer,
    insertImageBrand,
    getImageBrand,

}