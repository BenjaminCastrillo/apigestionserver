const { Router } = require('express');
const router = Router();
const { param, validationResult } = require('express-validator');
const multiparti = require('connect-multiparty')


// dependencias 
const config = require('../modules/config');
const users = require('../controllers/users');
const sites = require('../controllers/sites');
const venues = require('../controllers/venues');
const catalog = require('../controllers/catalog');
const catalog_customer = require('../controllers/catalog_customer');
const customers = require('../controllers/customers');

// para validar el usuario que llama al servicio en el futuro 
const { expressAuthentication } = require('../modules/middlwares');

// validaciones




/*******************************
 
  Rutas
 
********************************/

//* Generales
router.get('/', catalog.getInicio);

router.get('/countries/:languaje_id', expressAuthentication, [param('languaje_id').isInt().withMessage('Invalid parameter')],
    catalog.getCountries);
router.get('/roadtypes/:languaje_id', expressAuthentication, [param('languaje_id').isInt().withMessage('Invalid parameter')],
    catalog.getRoadTypes);
router.get('/status/:languaje_id', expressAuthentication, [param('languaje_id').isInt().withMessage('Invalid parameter')],
    catalog.getStatus);
router.get('/networks/:languaje_id', expressAuthentication, [param('languaje_id').isInt().withMessage('Invalid parameter')],
    catalog.getNetworks);
router.get('/territorialorganization/:country_id/:languaje_id', expressAuthentication, [param('languaje_id').isInt().withMessage('Invalid parameter')],
    catalog.getTerritorialOrganizationByIdCountry);
router.get('/territorialentities/:territorial_org_id/:languaje_id/:territorial_ent_id?', expressAuthentication, [param('languaje_id').isInt().withMessage('Invalid parameter')],
    catalog.getTerritorialEntitiesByIdTerritorialOrg);
router.get('/screenbrands', expressAuthentication, catalog.getScreenBrands);
router.get('/screenmodels/:screen_brand_id/:languaje_id', expressAuthentication, catalog.getScreenModels);
router.get('/screentypes/:languaje_id', expressAuthentication, catalog.getScreenTypes);
router.get('/orientations/:languaje_id', expressAuthentication, [param('languaje_id').isInt().withMessage('Invalid parameter')],
    catalog.getOrientations);
router.get('/os', expressAuthentication, catalog.getOs);


//* Customers
router.get('/customers', expressAuthentication, customers.getCustomers);
router.get('/customers/:id', expressAuthentication, [param('id').isInt().withMessage('invalid parameter')], customers.getCustomersByIdCustomer);
router.get('/customerbyidentification/:id', expressAuthentication, customers.getCustomersByIdentification);
router.post('/customers', expressAuthentication, customers.insertCustomer);
router.put('/customers', expressAuthentication, customers.updateCustomer);
router.delete('/customers/:id', expressAuthentication, [param('id').isInt().withMessage('invalid parameter')], customers.deleteCustomer);

//* Generales por customer
router.get('/marketregions/:customer_id', catalog_customer.getMarketRegionsByIdCustomer);
// router.get('/marketregionById/:id', catalog_customer.getMarketRegionsById);
router.get('/brands/:customer_id', catalog_customer.getBrandsByIdCustomer);
// router.get('/brandById/:id', catalog_customer.getBrandById);
router.get('/screenlocation/:customer_id', catalog_customer.getScreenLocationByIdCustomer);
router.get('/sitescode/:customer_id', catalog_customer.getSitesCodeByIdCustomer);
router.post('/brandimage', expressAuthentication, catalog_customer.insertImageBrand);
router.get('/brandimage/:image', expressAuthentication, catalog_customer.getImageBrand);

//* Users
router.get('/users', users.getUsers);
router.get('/user/:id', [param('id').isInt().withMessage('invalid parameter')], users.getUserById);
router.post('/users', users.insertUser);

// Venues 
//  param('languaje_id').isInt().withMessage('invalid parameter'), no es necesario se pone lenguaje por defecto
router.get('/venuesbyuser/:user_id/:languaje_id', expressAuthentication, [param('user_id').isInt().withMessage('invalid parameter')], venues.venuesByUser);
router.get('/venuesandsitesbyuser/:user_id/:languaje_id', expressAuthentication, [param('user_id').isInt().withMessage('invalid parameter')], venues.venuesAndSitesByUser);

router.get('/venueimage/:image_id', expressAuthentication, venues.getImageVenues);
router.put('/venueimage/:venue_id', expressAuthentication, venues.putImageVenues);
router.post('/venues', venues.insertVenue);

//* Sites
// router.get('/sitesbyvenue/:venue_id/:languaje_id', sites.getSitesByVenue);
router.get('/sitesbyvenueuser/:venue_id/:user_id/:languaje_id', sites.getSitesByVenueUser);
// router.get('/sitesbyuser/:user_id/:languaje_id', sites.getSitesByUser);
router.get('/siteimage/:image_id', expressAuthentication, sites.getImageSites);
router.put('/siteimage/:site_id', expressAuthentication, sites.putImageSites);


module.exports = router;