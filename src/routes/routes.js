const { Router } = require('express');
const router = Router();
const { param, validationResult } = require('express-validator');


// dependencias 
const config = require('../modules/config');
const users = require('../controllers/users');
const sites = require('../controllers/sites');
const venues = require('../controllers/venues');
const catalog = require('../controllers/catalog');
const catalog_customer = require('../controllers/catalog_customer');

const { expressAuthentication } = require('../modules/middlwares');

// validaciones




/*******************************
 
  Rutas
 
********************************/

//* Generales
router.get('/', catalog.getInicio);

router.get('/countries/:languaje_id', expressAuthentication, [param('languaje_id').isInt().withMessage('Parametro invalido')],
    catalog.getCountries);
router.get('/roadtypes/:languaje_id', [param('languaje_id').isInt().withMessage('Parametro invalido')],
    catalog.getRoadTypes);
router.get('/status/:languaje_id', [param('languaje_id').isInt().withMessage('Parametro invalido')],
    catalog.getStatus);
router.get('/networks/:languaje_id', [param('languaje_id').isInt().withMessage('Parametro invalido')],
    catalog.getNetworks);

//* Generales por cliente
router.get('/marketregions/:customer_id', catalog_customer.getMarketRegionsByIdCustomer);
router.get('/marketregionById/:id', catalog_customer.getMarketRegionsById);

router.get('/brands/:customer_id', catalog_customer.getBrandsByIdCustomer);
router.get('/brandById/:id', catalog_customer.getBrandById);



//* Users
router.get('/users', users.getUsers);
router.post('/users', users.insertUser);

// Venues 

router.get('/venues/:user_id/:languaje_id', [param('user_id').isInt().withMessage('Parametro invalido'),
    param('languaje_id').isInt().withMessage('Parametro invalido')
], venues.getVenuesByUser);

//* Sites
router.get('/sites/:user_id/:languaje_id', sites.getSitesByUser);


module.exports = router;