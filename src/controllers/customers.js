const { body, validationResult } = require('express-validator');
const validator = require('validator');
const conectionDB = require('../modules/database');
const queries = require('../models/queries');
const Error = require('../modules/errors/index');
const clase = require('../models/customer');
const config = require('../modules/config');
const { ramdonNumber, deleteFile } = require('../modules/util');

const {
    getCustomerBrands,
    getCustomerMarketRegions,
    getCustomerScreenLocations,
    getCustomerSiteComercialCodes

} = require('../modules/servicesdatacustomer');

const imagenDirectory = config.storage.images;

// module name
const __moduleName = 'src/controllers/customers';

/************************************
 *
 ** Gestion de datos de clientes 
 ** Customer data management

 ** Tablas: customer
 *
 ***********************************/

/**
 ** Obtener lista de clientes
 ** Get the customer list
 ** Tables: customer
 
 --------------------------------
 */


const getCustomers = (req, res) => {

    const __functionName = 'getCustomers';
    let error;


    conectionDB.pool.query(queries.getCustomers)
        .then((response) => {

            getCustomerDescriptions(response.rows)
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
                        message: err
                    });
                })
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();
        });

    return

}

/**
 ** Obtener un cliente por id de cliente
 ** Get the customer by id
 ** Tables: customer
 
 --------------------------------
 */
const getCustomersByIdCustomer = (req, res) => {

    const __functionName = 'getCustomersByIdCustomer';
    const err = validationResult(req); // result of param evaluation 
    if (!paramValidation(err, req, res)) return
    let error;
    const param = [req.params.id];

    conectionDB.pool.query(queries.getCustomersByIdCustomer, param)
        .then((response) => {
            getCustomerDescriptions(response.rows)
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
                        message: err
                    });
                })
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();
        });

    return

}


/**
 ** Obtener un cliente por id de cliente
 ** Get the customer by id
 ** Tables: customer, brand, location_screen, market_regions, site_comercial_code
 
 --------------------------------
 */


const getCustomersByIdentification = (req, res) => {

    const __functionName = 'getCustomersByIdentification';
    let error;
    const param = [req.params.id];

    conectionDB.pool.query(queries.getCustomersByIdentification, param)
        .then((response) => {

            getCustomerDescriptions(response.rows)
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
                        message: err
                    });
                })
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();
        });

    return

}

/**
 ** Alta de clientes 
 ** Customer registration in the customers tables
 
 Tables:
    customer
    brand
    market_region
    screen_location 
    site_comercial_code
 --------------------------------
 */
const insertCustomer = (req, res) => {
    const __functionName = 'insertCustomer';
    let error;
    const customerObject = new clase.Customer(req.body.id, req.body.identification,
        req.body.name, req.body.phoneNumber, req.body.brands, req.body.marketRegions, req.body.locationsScreen,
        req.body.sitesComercialCodes);

    console.log('estoy en insertCustomer');
    console.log(customerObject);

    conectionDB.pool.query(queries.getNextIdCustomer)
        .then((response) => {
            insertCustomerData(customerObject, response.rows[0].nextval)
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

** actualizacion de datos de clientes
** updates customers tables 

Tables:
    customer
    brand
    market_region
    screen_location 
    site_comercial_code
*/


const updateCustomer = (req, res) => {
    const __functionName = 'updateCustomer';
    let error;
    const customerObject = new clase.Customer(req.body.id, req.body.identification,
        req.body.name, req.body.phoneNumber, req.body.brands, req.body.marketRegions, req.body.locationsScreen,
        req.body.sitesComercialCodes);

    updateCustomerData(customerObject)
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


    return;

}

/**
 ** Borrar un cliente por id de cliente y sus datos asociados
 ** delete the customer by id
 ** Tables: customer, brand, location_screen, market_regions, site_comercial_code
 
 --------------------------------
 */


const deleteCustomer = (req, res) => {

    const __functionName = 'deleteCustomer';
    const err = validationResult(req); // result of param evaluation 
    if (!paramValidation(err, req, res)) return
    let error;
    const param = [req.params.id];

    deleteCustomerData(param)
        .then(response => {
            console.log('Borrado ok de la bbdd 2', response)
            console.log('voy a borrar ficheros fisicos 3');
            borrarficherosBrands(param);
            console.log('vuelvo de borrar ficheros fisicos 6');
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


// Private functions

/**********************************
 *
 ** Obtencion de las descripciones de las propiedades de los clientes
 ** Get the property descriptions of customers
 ** Tablas:  customer, brand, location_screen, market_regions, site_comercial_code
 *@param customers[]
 *
 *?response array de objetos customer
 ***********************************/

async function getCustomerDescriptions(customers) {
    const __functionName = 'getCustomerDescriptions';

    let customerObject = new Array();
    let brand = new Array();
    let marketRegion = new Array();
    let screenLocation = new Array();
    let siteComercialCode = new Array();

    for (let i = 0; i < customers.length; i++) {
        try {
            brand = await getCustomerBrands(customers[i].id);
            marketRegion = await getCustomerMarketRegions(customers[i].id);
            screenLocation = await getCustomerScreenLocations(customers[i].id);
            siteComercialCode = await getCustomerSiteComercialCodes(customers[i].id);
        } catch (err) {
            throw err;
        }
        customerObject[i] = new clase.Customer(customers[i].id, customers[i].identification, customers[i].name, customers[i].phone_number, brand, marketRegion, screenLocation, siteComercialCode);
    }
    return customerObject;

}

/**********************************
 *
 ** Insercion de los datos de clientes
 ** insert   data customers
 ** Tablas:  customer, brand, location_screen, market_regions, site_comercial_code
 *@param customer,idCustomer
 *
 *?response resul transaction
 ***********************************/

async function insertCustomerData(customerData, idCustomer) {
    const __functionName = 'insertCustomerData';
    const dataQuery = [idCustomer, customerData.identification, customerData.name, customerData.phoneNumber];
    const brands = customerData.brands;
    const marketRegions = customerData.marketRegions;
    const locationsScreen = customerData.locationsScreen;
    const sitesComercialCodes = customerData.sitesComercialCodes;
    let fecha = new Date();
    let ano = fecha.getFullYear();
    let dataInsert = [];

    try {
        await conectionDB.pool.query('BEGIN');

        await conectionDB.pool.query(queries.insertCustomer, dataQuery);

        for (let i = 0; i < brands.length; i++) {
            try {
                dataInsert = [brands[i].description, brands[i].image, idCustomer, brands[i].color];
                await conectionDB.pool.query(queries.insertBrand, dataInsert);
            } catch (err) {
                throw err;
            }
        }
        console.log('he insertado las brands');
        for (let i = 0; i < marketRegions.length; i++) {
            try {
                dataInsert = [marketRegions[i].description, idCustomer];
                await conectionDB.pool.query(queries.insertMarketRegion, dataInsert);
            } catch (err) {
                throw err;
            }
        }
        for (let i = 0; i < locationsScreen.length; i++) {
            try {
                dataInsert = [locationsScreen[i].description, idCustomer];
                await conectionDB.pool.query(queries.insertScreenLocation, dataInsert);
            } catch (err) {
                throw err;
            }
        }
        for (let i = 0; i < sitesComercialCodes.length; i++) {
            try {
                dataInsert = [sitesComercialCodes[i].acronym, idCustomer, ano];
                await conectionDB.pool.query(queries.insertSiteComercialCode, dataInsert);
            } catch (err) {
                throw err;
            }
        }
        await conectionDB.pool.query('COMMIT');
    } catch (err) {
        console.log('hay error ', err);
        conectionDB.pool.query('ROLLBACK');
        throw err;
    }

    return customerData;
}


/**********************************
 *
 ** Actualizacion de los datos de clientes
 ** update data customers
 ** Tablas:  customer, brand, location_screen, market_regions, site_comercial_code
 *@param customer, 
 *
 *?response resul transaction
 ***********************************/

async function updateCustomerData(customerData) {
    const __functionName = 'updateCustomerData';
    let dataQuery = [customerData.id, customerData.name, customerData.phoneNumber];
    const brands = customerData.brands;
    const marketRegions = customerData.marketRegions;
    const locationsScreen = customerData.locationsScreen;
    const sitesComercialCodes = customerData.sitesComercialCodes;
    let fecha = new Date();
    let ano = fecha.getFullYear();

    try {
        await conectionDB.pool.query('BEGIN');
        await conectionDB.pool.query(queries.updateCustomer, dataQuery);
        for (let i = 0; i < brands.length; i++) {
            try {
                if (brands[i].id) {
                    dataQuery = [brands[i].id, brands[i].description, brands[i].image, brands[i].color, brands[i].deleted];
                    await conectionDB.pool.query(queries.updateBrand, dataQuery);
                } else { // registro nuevo
                    dataQuery = [brands[i].description, brands[i].image, customerData.id, brands[i].color];
                    await conectionDB.pool.query(queries.insertBrand, dataQuery);
                }
            } catch (err) {
                throw err;
            }
        }
        for (let i = 0; i < marketRegions.length; i++) {
            try {

                if (marketRegions[i].id) {
                    dataQuery = [marketRegions[i].id, marketRegions[i].description, marketRegions[i].deleted];
                    await conectionDB.pool.query(queries.updateMarketRegion, dataQuery);

                } else { // registro nuevo
                    dataQuery = [marketRegions[i].description, customerData.id];
                    await conectionDB.pool.query(queries.insertMarketRegion, dataQuery);

                }
            } catch (err) {
                throw err;
            }
        }
        for (let i = 0; i < locationsScreen.length; i++) {
            try {
                if (locationsScreen[i].id) {
                    dataQuery = [locationsScreen[i].id, locationsScreen[i].description, locationsScreen[i].deleted];
                    await conectionDB.pool.query(queries.updateScreenLocation, dataQuery);

                } else { // registro nuevo
                    dataQuery = [locationsScreen[i].description, customerData.id];
                    await conectionDB.pool.query(queries.insertScreenLocation, dataQuery);

                }
            } catch (err) {
                throw err;
            }
        }
        for (let i = 0; i < sitesComercialCodes.length; i++) {
            try {
                if (sitesComercialCodes[i].id) {
                    dataQuery = [sitesComercialCodes[i].id, sitesComercialCodes[i].acronym, sitesComercialCodes[i].deleted];
                    await conectionDB.pool.query(queries.updateSiteComercialCode, dataQuery);

                } else { // registro nuevo
                    dataQuery = [sitesComercialCodes[i].acronym, customerData.id, ano];
                    await conectionDB.pool.query(queries.insertSiteComercialCode, dataQuery);

                }
            } catch (err) {
                throw err;
            }
        }
        await conectionDB.pool.query('COMMIT');
    } catch (err) {
        console.log('hay error ', err);
        conectionDB.pool.query('ROLLBACK');
        throw err;
    }

    return customerData;
}



/**********************************
 *
 ** Borrado  de los datos de clientes
 ** delete data customers
 ** Tablas: customer, brand, location_screen, market_regions, site_comercial_code
 *@param customer
 
 *
 *?response resul transaction
 ***********************************/

async function deleteCustomerData(customerId) {
    const __functionName = 'deleteCustomerData';

    console.log('esta tiene que ser 1')

    let fecha = new Date();

    try {
        console.log('comienzo la transaccion')
        await conectionDB.pool.query('BEGIN');
        await conectionDB.pool.query(queries.deleteCustomer, customerId);
        await conectionDB.pool.query(queries.deleteBrandByIdCustomer, customerId);
        await conectionDB.pool.query(queries.deleteMarketRegionByIdCustomer, customerId);
        await conectionDB.pool.query(queries.deleteScreenLocationByIdCustomer, customerId);
        await conectionDB.pool.query(queries.deleteSiteComercialCodeByIdCustomer, customerId);
        await conectionDB.pool.query('COMMIT');
        console.log('fin de la transaccion');
    } catch (err) {
        conectionDB.pool.query('ROLLBACK');
        throw err;
    }

    return customerId;
}


/**********************************
 *
 ** Borrado  de los ficheros de imagnes de marcas
 ** delete image brands files
 ** Tablas: brand
 *@param customer
 
 *
 *?response resul transaction
 ***********************************/
async function borrarficherosBrands(customerId) {
    const __functionName = 'borrarficherosBrands';

    console.log('estoy en la funcion ultima de borrado de fichero 4', customerId);

    conectionDB.pool.query(queries.getBrandsByIdCustomersDeleted, customerId)
        .then(response => {
            response.rows.forEach(elem => {
                deleteFile(elem.image, imagenDirectory + '/brands/');
            })
        })
        .catch(e => {
            error = new Error.createPgError(e, __moduleName, __functionName);
            error.alert();
        });

    return
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
    getCustomers,
    getCustomersByIdCustomer,
    getCustomersByIdentification,
    insertCustomer,
    updateCustomer,
    deleteCustomer,
}