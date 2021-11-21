const { body, validationResult } = require('express-validator');
const validator = require('validator');
const conectionDB = require('../modules/database');
const moment = require('moment');
const queries = require('../models/queries');
const Error = require('../modules/errors/index');
const clase = require('../models/customer');
const config = require('../modules/config');
const { ramdonNumber, deleteFile } = require('../modules/util');

const {
    getCustomerBrands,
    getCustomerMarketRegions,
    getCustomerScreenLocations,
    getCustomerSiteComercialCodes,
    getCustomerSchedules

} = require('../modules/servicesdatacustomer');


const {
    getWeekDays

} = require('../modules/servicesdatavenuesandsites');

const imagenDirectory = config.storage.images;

//  languages data
const validLanguages = [];
const defaultLanguage = [];
defaultLanguage[0] = config.localization.defaultLang;
config.localization.langs.forEach(element => {
    validLanguages.push(element.id.toString());
});

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
    let language = (validLanguages.includes(req.params.language_id)) ? req.params.language_id : defaultLanguage;


    conectionDB.pool.query(queries.getCustomers)
        .then((response) => {

            getCustomerDescriptions(response.rows, language)
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
    if (!paramValidation(err, req, res, 1)) return
    let error;
    const param = [req.params.id];
    let language = (validLanguages.includes(req.params.language_id)) ? req.params.language_id : defaultLanguage;


    conectionDB.pool.query(queries.getCustomersByIdCustomer, param)
        .then((response) => {
            getCustomerDescriptions(response.rows, language)
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
    let language = (validLanguages.includes(req.params.language_id)) ? req.params.language_id : defaultLanguage;

    conectionDB.pool.query(queries.getCustomersByIdentification, param)
        .then((response) => {

            getCustomerDescriptions(response.rows, language)
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
    schedule_customer
 --------------------------------
 */
const insertCustomer = (req, res) => {
    const __functionName = 'insertCustomer';
    let error;
    let fecha = new Date();

    const customerObject = new clase.Customer(req.body.id, req.body.identification,
        req.body.name, req.body.phoneNumber, fecha, req.body.brands, req.body.marketRegions, req.body.locationsScreen,
        req.body.sitesComercialCodes, req.body.schedules, req.body.contactName);

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
    schedule_customer
*/


const updateCustomer = (req, res) => {
    const __functionName = 'updateCustomer';
    let error;


    const customerObject = new clase.Customer(req.body.id, req.body.identification,
        req.body.name, req.body.phoneNumber, req.body.entryDate, req.body.brands, req.body.marketRegions,
        req.body.locationsScreen, req.body.sitesComercialCodes, req.body.schedules, req.body.contactName);

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
    const param = parseInt(req.params.id, 10);


    deleteCustomerData(param)
        .then(response => {
            borrarficherosBrands(param);
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
 *@param customers[], language
 *
 *?response array de objetos customer
 ***********************************/

async function getCustomerDescriptions(customers, language) {
    const __functionName = 'getCustomerDescriptions';

    let customerObject = new Array();
    let brand = new Array();
    let marketRegion = new Array();
    let screenLocation = new Array();
    let siteComercialCode = new Array();
    let schedule = new Array();
    let week = new Array();
    try {
        week = await getWeekDays(language[0]);
    } catch (err) {
        throw err;
    }
    for (let i = 0; i < customers.length; i++) {
        try {
            brand = await getCustomerBrands(customers[i].id);
            marketRegion = await getCustomerMarketRegions(customers[i].id);
            screenLocation = await getCustomerScreenLocations(customers[i].id);
            siteComercialCode = await getCustomerSiteComercialCodes(customers[i].id);
            schedule = await getCustomerSchedules(customers[i].id, week);

        } catch (err) {
            throw err;
        }
        let fecha = moment(customers[i].entry_date).format('DD-MM-YYYY HH:mm:ss');


        customerObject[i] = new clase.Customer(customers[i].id, customers[i].identification,
            customers[i].name, customers[i].phone_number, fecha,
            brand, marketRegion, screenLocation, siteComercialCode, schedule, customers[i].contact_name);
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
    const dataQuery = [idCustomer, customerData.identification, customerData.name, customerData.phoneNumber, customerData.entryDate, customerData.contactName];
    const brands = customerData.brands;
    const marketRegions = customerData.marketRegions;
    const locationsScreen = customerData.locationsScreen;
    const sitesComercialCodes = customerData.sitesComercialCodes;
    const schedules = customerData.schedules;
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
        for (let i = 0; i < schedules.length; i++) {
            let horario = '';
            for (let ii = 0; ii < schedules[i].weekly.length; ii++) {

                let h1 = schedules[i].weekly[ii].openingTime1 ? schedules[i].weekly[ii].openingTime1.replace(':', '') : '----';
                let h2 = schedules[i].weekly[ii].closingTime1 ? schedules[i].weekly[ii].closingTime1.replace(':', '') : '----';
                let h3 = schedules[i].weekly[ii].openingTime2 ? schedules[i].weekly[ii].openingTime2.replace(':', '') : '----';
                let h4 = schedules[i].weekly[ii].closingTime2 ? schedules[i].weekly[ii].closingTime2.replace(':', '') : '----';

                horario += 'D' + schedules[i].weekly[ii].day + h1 + h2 + h3 + h4;
            }
            try {
                dataInsert = [schedules[i].description, schedules[i].startDate.id, horario, idCustomer];
                await conectionDB.pool.query(queries.insertScheduleustomer, dataInsert);
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
    let dataQuery = [customerData.id, customerData.name, customerData.phoneNumber, customerData.contactName];
    const brands = customerData.brands;
    const marketRegions = customerData.marketRegions;
    const locationsScreen = customerData.locationsScreen;
    const sitesComercialCodes = customerData.sitesComercialCodes;
    const schedules = customerData.schedules;
    let fecha = new Date();
    let ano = fecha.getFullYear();

    try {
        await conectionDB.pool.query('BEGIN');
        await conectionDB.pool.query(queries.updateCustomer, dataQuery);
        for (let i = 0; i < brands.length; i++) {
            try {
                if (brands[i].id) {
                    dataQuery = [brands[i].id, brands[i].description, brands[i].image, brands[i].color, brands[i].deleted, brands[i].deleted ? fecha : null];
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
                    dataQuery = [marketRegions[i].id, marketRegions[i].description, marketRegions[i].deleted, marketRegions[i].deleted ? fecha : null];
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
                    dataQuery = [locationsScreen[i].id, locationsScreen[i].description, locationsScreen[i].deleted, locationsScreen[i].deleted ? fecha : null];
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
                    dataQuery = [sitesComercialCodes[i].id, sitesComercialCodes[i].acronym, sitesComercialCodes[i].deleted, sitesComercialCodes[i].deleted ? fecha : null];
                    await conectionDB.pool.query(queries.updateSiteComercialCode, dataQuery);

                } else { // registro nuevo
                    dataQuery = [sitesComercialCodes[i].acronym, customerData.id, ano];
                    await conectionDB.pool.query(queries.insertSiteComercialCode, dataQuery);

                }
            } catch (err) {
                throw err;
            }
        }
        // horario
        for (let i = 0; i < schedules.length; i++) {

            let horario = '';
            for (let ii = 0; ii < schedules[i].weekly.length; ii++) {

                let h1 = schedules[i].weekly[ii].openingTime1 ? schedules[i].weekly[ii].openingTime1.replace(':', '') : '----';
                let h2 = schedules[i].weekly[ii].closingTime1 ? schedules[i].weekly[ii].closingTime1.replace(':', '') : '----';
                let h3 = schedules[i].weekly[ii].openingTime2 ? schedules[i].weekly[ii].openingTime2.replace(':', '') : '----';
                let h4 = schedules[i].weekly[ii].closingTime2 ? schedules[i].weekly[ii].closingTime2.replace(':', '') : '----';

                horario += 'D' + schedules[i].weekly[ii].day + h1 + h2 + h3 + h4;
            }
            try {
                if (schedules[i].id) {
                    dataQuery = [schedules[i].id, schedules[i].description, schedules[i].startDate.id, horario, schedules[i].deleted, schedules[i].deleted ? fecha : null];

                    await conectionDB.pool.query(queries.updateSchedules, dataQuery);

                } else { // registro nuevo
                    dataQuery = [schedules[i].description, schedules[i].startDate.id, horario, customerData.id];
                    await conectionDB.pool.query(queries.insertScheduleCustomer, dataQuery);

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
 *@param customerId
 
 *
 *?response resul transaction
 ***********************************/

async function deleteCustomerData(customerId) {
    const __functionName = 'deleteCustomerData';

    let fecha = new Date();
    const dataQuery = [customerId, fecha];

    try {
        await conectionDB.pool.query('BEGIN');
        await conectionDB.pool.query(queries.deleteCustomer, dataQuery);
        await conectionDB.pool.query(queries.deleteBrandByIdCustomer, dataQuery);
        await conectionDB.pool.query(queries.deleteMarketRegionByIdCustomer, dataQuery);
        await conectionDB.pool.query(queries.deleteScreenLocationByIdCustomer, dataQuery);
        await conectionDB.pool.query(queries.deleteSiteComercialCodeByIdCustomer, dataQuery);
        await conectionDB.pool.query(queries.deleteUserByIdCustomer, dataQuery);
        await conectionDB.pool.query(queries.deleteSchedulesByIdCustomer, dataQuery)

        await conectionDB.pool.query('COMMIT');

    } catch (err) {
        conectionDB.pool.query('ROLLBACK');
        throw err;
    }

    return customerId;
}


/**********************************
 *
 ** Borrado  de los ficheros de imagenes de marcas
 ** delete image brands files
 ** Tablas: brand
 *@param customerId
 
 *
 *?response resul transaction
 ***********************************/
async function borrarficherosBrands(customerId) {
    const __functionName = 'borrarficherosBrands';
    const dataQuery = [customerId];


    conectionDB.pool.query(queries.getBrandsByIdCustomersDeleted, dataQuery)
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

/****** ** ** ** ** ** ** ** ** ** ** ** ** ** **
*
PARA UTILIZAR EN EL FRONTEND
    **
    crea objeto horario del establecimiento agrupado por dias iguales **
    create schedule object of venue group by weekdays *
    *
    @param schedule *
    ?
    response schedulerObject *
***********************************/

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
        let error = new Error.createValidationError(err.errors, req, __moduleName, __functionName);
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
    groupScheduler
}