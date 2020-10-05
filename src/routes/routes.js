const { Router } = require('express');
const router = Router();
const { param, validationResult } = require('express-validator');

// dependencias 

const users = require('../controllers/users');
const sites = require('../controllers/sites');
const catalog = require('../controllers/catalog');
const catalog_customer = require('../controllers/catalog_customer');

const verifica = require('../modules/middlwares');

// validaciones

//let validator = [param(languaje_id).isInt().withMessage('Parametro incorrecto')]

/*******************************
 
  Rutas
 
********************************/

//* Generales
router.get('/', catalog.getInicio);
router.get('/countries/:languaje_id', verifica.verificaParams, catalog.getCountries);
router.get('/roadtypes/:languaje_id', catalog.getRoadTypes);
router.get('/status/:languaje_id', catalog.getStatus);
router.get('/networks/:languaje_id', catalog.getNetworks);

//* Generales por cliente
router.get('/marketregions/:customer_id', catalog_customer.getMarketRegionsByIdCustomer);
router.get('/marketregionsbyid/:market_region_id', catalog_customer.getMarketRegionsById);

//* Users
router.get('/users', users.getUsers);
router.post('/users', users.insertUser);

//* Sites
router.get('/sites/:user_id', sites.getSitesByUser);


module.exports = router;