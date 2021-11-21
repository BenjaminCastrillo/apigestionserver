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

router.get('/countries/:language_id', expressAuthentication, [param('language_id').isInt().withMessage('Invalid parameter')],
    catalog.getCountries);
router.get('/roadtypes/:language_id', expressAuthentication, [param('language_id').isInt().withMessage('Invalid parameter')],
    catalog.getRoadTypes);
router.get('/status/:language_id', expressAuthentication, [param('language_id').isInt().withMessage('Invalid parameter')],
    catalog.getStatus);
router.get('/networks/:language_id', expressAuthentication, [param('language_id').isInt().withMessage('Invalid parameter')],
    catalog.getNetworks);
router.get('/territorialorganization/:country_id/:language_id', expressAuthentication, [param('language_id').isInt().withMessage('Invalid parameter')],
    catalog.getTerritorialOrganizationByIdCountry);
router.get('/territorialentities/:territorial_org_id/:language_id/:territorial_ent_id?', expressAuthentication, [param('language_id').isInt().withMessage('Invalid parameter')],
    catalog.getTerritorialEntitiesByIdTerritorialOrg);
router.get('/screenbrands', expressAuthentication, catalog.getScreenBrands);
// router.get('/screenmodels/:screen_brand_id/:language_id/:screen_type_id', expressAuthentication, catalog.getScreenModels);
router.get('/screenmodels/:language_id', expressAuthentication, catalog.getScreenModels);
router.get('/screentypes/:language_id', expressAuthentication, catalog.getScreenTypes);
router.get('/orientations/:language_id', expressAuthentication, [param('language_id').isInt().withMessage('Invalid parameter')],
    catalog.getOrientations);
router.get('/os', expressAuthentication, catalog.getOs);
router.get('/languages', expressAuthentication, catalog.getLanguages);
router.get('/roles/:language_id', expressAuthentication, [param('language_id').isInt().withMessage('Invalid parameter')], catalog.getRoles);
router.get('/weekdays/:language_id', expressAuthentication, [param('language_id').isInt().withMessage('Invalid parameter')],
    catalog.getWeek);

router.get('/months/:language_id', expressAuthentication, [param('language_id').isInt().withMessage('Invalid parameter')],
    catalog.getMonth);
router.get('/durationlicenses', expressAuthentication, catalog.getDurationLicenses);

//* ---------------------------------------------------------------------------
//* Customers
router.get('/customers/:language_id', expressAuthentication, customers.getCustomers);
router.get('/customers/:id/:language_id', expressAuthentication, [param('id').isInt().withMessage('invalid parameter')], customers.getCustomersByIdCustomer);
router.get('/customerbyidentification/:id/:language_id', expressAuthentication, customers.getCustomersByIdentification);
router.post('/customers', expressAuthentication, customers.insertCustomer);
router.put('/customers', expressAuthentication, customers.updateCustomer);
router.delete('/customers/:id', expressAuthentication, [param('id').isInt().withMessage('invalid parameter')], customers.deleteCustomer);

//* Generales por customer
router.get('/marketregions/:customer_id', expressAuthentication, [param('customer_id').isInt().withMessage('Invalid parameter')], catalog_customer.getMarketRegionsByIdCustomer);
// router.get('/marketregionById/:id', catalog_customer.getMarketRegionsById);
router.get('/brands/:customer_id', expressAuthentication, [param('customer_id').isInt().withMessage('Invalid parameter')], catalog_customer.getBrandsByIdCustomer);
// router.get('/brandById/:id', catalog_customer.getBrandById);
router.get('/screenlocation/:customer_id', expressAuthentication, [param('customer_id').isInt().withMessage('Invalid parameter')], catalog_customer.getScreenLocationByIdCustomer);
router.get('/sitescode/:customer_id', expressAuthentication, [param('customer_id').isInt().withMessage('Invalid parameter')], catalog_customer.getSitesCodeByIdCustomer);
router.post('/brandimage', expressAuthentication, catalog_customer.insertImageBrand);
router.get('/brandimage/:image', expressAuthentication, catalog_customer.getImageBrand);
router.get('/schedules/:customer_id/:language_id', expressAuthentication, [param('language_id').isInt().withMessage('Invalid parameter')], catalog_customer.getSchedulesByIdCustomer);


//* ---------------------------------------------------------------------------
//* Users
router.get('/users/:language_id', [param('language_id').isInt().withMessage('Invalid parameter')], users.getUsers);
router.get('/userbyid/:id/:language_id', [param('id').isInt().withMessage('invalid parameter'), param('language_id').isInt().withMessage('invalid parameter')], users.getUserById);
router.get('/userbyemail/:email/:language_id', [param('language_id').isInt().withMessage('invalid parameter')], users.getUserByEmail);
router.post('/users', expressAuthentication, users.insertUser);
router.put('/users', expressAuthentication, users.updateUser);
router.delete('/users/:id', expressAuthentication, [param('id').isInt().withMessage('invalid parameter')], users.deleteUser);

//* ---------------------------------------------------------------------------
// Venues 
//  param('language_id').isInt().withMessage('invalid parameter'), no es necesario se pone lenguaje por defecto
router.get('/venuesandsitesbyuser/:user_id/:language_id', expressAuthentication, [param('user_id').isInt().withMessage('invalid parameter')], venues.venuesAndSitesByUser);
router.get('/venueandsitesbyid/:venue_id/:user_id/:language_id', expressAuthentication, [param('venue_id').isInt().withMessage('invalid parameter')], venues.venueAndSitesById);
router.get('/venuebyid/:venue_id/:user_id/:language_id', expressAuthentication, [param('venue_id').isInt().withMessage('invalid parameter')], venues.venueById);
router.get('/venuesbyuser/:user_id/:language_id', expressAuthentication, [param('user_id').isInt().withMessage('invalid parameter')], venues.venuesByUser);

router.post('/venues', expressAuthentication, venues.insertVenue);
router.put('/venues', expressAuthentication, venues.updateVenue);
router.delete('/venues/:id', expressAuthentication, [param('id').isInt().withMessage('invalid parameter')], venues.deleteVenue);

// image venues
router.get('/venueimage/:image', expressAuthentication, venues.getImageVenue);
router.post('/venueimage', expressAuthentication, venues.insertImageVenue);
router.put('/venueimage/:venue_id', expressAuthentication, venues.putImageVenue);

//* ---------------------------------------------------------------------------
//* Sites
router.get('/sitesbyid/:site_id/:user_id/:language_id', expressAuthentication, [param('site_id').isInt().withMessage('invalid parameter')], sites.sitesById);
router.put('/sites', expressAuthentication, sites.updateSite);
router.delete('/sites/:id', expressAuthentication, [param('id').isInt().withMessage('invalid parameter')], sites.deleteSite);

// image sites
router.get('/siteimage/:image', expressAuthentication, sites.getImageSite);
router.post('/siteimage', expressAuthentication, sites.insertImageSite);
router.put('/siteimage/:site_id', expressAuthentication, sites.putImageSite);


module.exports = router;