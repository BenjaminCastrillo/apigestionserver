module.exports = {


    getContactsByVenueId: 'SELECT a.id,a.name,a.email,a.notes notes_contact, b.id id_contact_phone,b.phone_number,b.notes notes_phone FROM contact_venue a INNER JOIN contact_phone b ON a.id=b.id_contact_venue WHERE a.id_venue=$1 AND NOT a.deleted AND NOT b.deleted ORDER BY a.id',

    getCountries: 'SELECT a.id id_country,b.text_, a.code1, a.code2, a.code_iso FROM country a INNER JOIN language_description b ON a.id_description=b.id_description WHERE b.id_language IN ($1,0)',
    getCountryById: 'SELECT a.id id_country,b.text_, a.code1, a.code2, a.code_iso FROM country a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.id=$1 AND b.id_language IN ($2,0)',


    getTerritorialEntitiesByIdTerritorialOrg: 'SELECT a.id, b.text_ FROM territorial_entities a INNER JOIN language_description b ON a.id_description = b.id_description WHERE a.id_territorial_org = $1 AND a.relation_id = $3 AND b.id_language in ($2, 0)',
    getLocationByVenue: 'SELECT a.id,a.id_territorial_ent,c.text_,a.id_territorial_org FROM location a INNER JOIN territorial_entities b ON  a.id_territorial_ent=b.id INNER JOIN language_description c ON b.id_description=c.id_description  WHERE a.id_venue=$1 AND c.id_language IN ($2,0) ORDER BY a.hierarchy_',
    getLicenseById: 'SELECT id id_license, license_number, activation_date ,expiration_date from license WHERE id=$1',
    getNetworks: 'SELECT a.id,b.text_ FROM network a INNER JOIN language_description b ON a.id_description=b.id_description WHERE b.id_language IN ($1,0)',
    getNetworkById: 'SELECT a.id, b.text_ description FROM network a INNER JOIN language_description b ON a.id_description = b.id_description WHERE a.id = $1 AND b.id_language in ($2, 0)',
    getOrientationById: 'SELECT a.value_ id, b.text_ description FROM parameter a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.column_=\'orientation\' AND a.value_=$1 AND b.id_language IN ($2,0)',
    getOrientations: 'SELECT a.value_ id, b.text_ description FROM parameter a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.column_=\'orientation\' AND b.id_language IN ($1,0)',
    getOs: 'SELECT id, description FROM operating_system WHERE NOT deleted',
    getOsById: 'SELECT id, description FROM operating_system WHERE id = $1 ',

    getRoadTypes: 'SELECT a.id id_road_type,b.text_ FROM road_type a INNER JOIN language_description b ON a.id_description=b.id_description WHERE b.id_language IN ($1,0)',
    getRoadTypeById: 'SELECT a.id id_road_type,b.text_ FROM road_type a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.id=$1 AND b.id_language IN ($2,0)',



    getScreenBrands: 'SELECT id, description FROM screen_brand WHERE NOT deleted',
    getScreenBrandById: 'SELECT id, description FROM screen_brand WHERE id = $1 ',
    getScreenModels: 'SELECT a.id id_screen_model,a.description,c.text_ screen_type,a.resolution_width,a.resolution_heigth,a.measure_width,a.measure_heigth,b.panel FROM screen_model a INNER JOIN screen_type b ON a.id_screen_type = b.id INNER JOIN language_description c ON b.id_description = c.id_description WHERE a.id_screen_brand = $1 AND c.id_language in ($2, 0) AND NOT a.deleted ORDER BY a.description',
    getScreenModelById: 'SELECT id, description FROM screen_model WHERE id = $1 ',

    getScreenTypeById: 'SELECT a.id,b.text_ description, a.panel FROM screen_type a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.id=$1 AND b.id_language IN ($2,0)',
    getScreenTypes: 'SELECT a.id,b.text_ description, a.panel FROM screen_type a  INNER JOIN language_description b ON a.id_description=b.id_description WHERE NOT a.deleted AND b.id_language IN ($1,0)',


    getScheduleTypes: 'SELECT a.value_ id, b.text_ FROM parameter a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.column_=\'schedule_type\' AND b.id_language IN ($1,0) ORDER BY a.value_',
    getScheduleVenueByVenueId: 'SELECT  week_schedule,schedule_type FROM venue_schedule WHERE id_venue=$1',

    getSitesByUser: 'SELECT b.id id_venue, b.id_customer, b.name, b.id_road_type, b.address, b.id_country, b.postal_code, b.latitude ,b.longitude ,b.id_market_region, b.id_brand, c.id id_site, c.id_site_comercial, c.id_pti, c.id_network, c.id_status, c.public_,c.on_off, c.text_, c.id_screen_location FROM user_customer a INNER JOIN venue b ON a.id_customer=b.id_customer INNER JOIN site c ON b.id=c.id_venue RIGHT JOIN user_no_site d ON c.id!=d.id_site WHERE a.id_user=$1 AND NOT b.deleted AND NOT c.deleted ORDER BY b.id',
    getSitesByVenueId: 'SELECT a.id id_site, a.id_site_comercial,a.id_pti,a.id_venue,a.id_customer,a.id_network,a.id_status,a.entry_date,a.public_,a.on_off,a.text_,a.id_screen_location,b.id id_player,b.serial_number,b.mac,b.id_orientation id_orientation_player,b.id_os,b.os_version,b.app_version,b.license_id,c.id id_screen,c.inches,c.serial_number,c.id_screen_brand,c.id_screen_model,c.resolution_width,c.resolution_heigth,c.id_screen_type,c.situation,c.id_orientation,c.cabinets_width, c.cabinets_heigth  FROM site a INNER JOIN player b ON a.id = b.id_site LEFT JOIN screen c ON a.id = c.id_site WHERE a.id_venue = $1 AND NOT a.deleted ORDER BY a.id',

    getStatus: 'SELECT a.id,b.text_ description FROM status a INNER JOIN language_description b ON a.id_description=b.id_description WHERE b.id_language IN ($1,0)',
    getStatusById: 'SELECT a.id,b.text_ description FROM status a INNER JOIN language_description b ON a.id_description = b.id_description WHERE a.id = $1 AND b.id_language in ($2, 0)',
    getTerritorialOrganizationById: 'SELECT a.id,b.text_  FROM territorial_organization a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.id=$1 AND b.id_language IN ($2,0)',
    getTerritorialOrganization: 'SELECT a.id,b.text_  FROM territorial_organization a INNER JOIN language_description b ON a.id_description=b.id_description WHERE b.id_language IN ($1,0)',
    getTerritorialOrganizationByIdCountry: 'select a.id, b.text_,a.hierarchy_ FROM territorial_organization a INNER JOIN language_description b ON a.id_description = b.id_description WHERE a.id_country = $1 AND b.id_language IN($2, 0) ORDER BY a.hierarchy_ ',


    putSitesImageById: 'UPDATE site SET image = $2 WHERE id = $1',
    putVenuesImageById: 'UPDATE venue SET image = $2 WHERE id = $1',

    getAllVenues: 'SELECT b.id id_venue,b.id_customer,b.name,b.image,b.id_road_type,b.address,b.street_number,b.postal_code,b.id_brand,b.id_country,b.latitude,b.longitude,b.id_market_region FROM venue b WHERE NOT b.deleted ORDER BY b.id',
    // Venues por codigo de cliente para propietarios
    getVenuesByCustomerId: 'SELECT b.id id_venue,b.id_customer,b.name,b.image,b.id_road_type,b.address,b.street_number,b.postal_code,b.id_brand,b.id_country,b.latitude,b.longitude,b.id_market_region FROM venue b WHERE b.id_customer=$1 AND NOT b.deleted ORDER BY b.id',
    getVenuesByUser: 'SELECT b.id id_venue,b.id_customer,b.name,b.image,b.id_road_type,b.address,b.street_number,b.postal_code,b.id_brand,b.id_country,b.latitude,b.longitude,b.id_market_region FROM user_customer a INNER JOIN venue b ON a.id_customer=b.id_customer WHERE a.id_user=$1 AND NOT b.deleted ORDER BY b.id',

    insertVenue: 'INSERT INTO venue(id_customer, name, id_road_type, address, street_number,id_country,postal_code,latitude,longitude,id_market,id_brand) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
    getWeekDays: 'SELECT a.value_ id, b.text_ FROM parameter a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.column_=\'week_day\' AND b.id_language IN ($1,0) ORDER BY a.value_',


    // user queries ---------------

    getUsers: 'SELECT id id_user,name,surname,last_access,id_language,entry_date,super_user ,email, password, user_relationship,owner_user FROM user_app WHERE NOT deleted',
    getUserById: 'SELECT id id_user,name,surname,last_access,id_language,entry_date,super_user ,email, password, user_relationship,owner_user FROM user_app WHERE id=$1 AND NOT deleted',
    getExceptionSitesByUser: 'SELECT id_site FROM user_exception_site WHERE id_user=$1',
    insertUserApp: 'INSERT INTO user_app(id,id_customer,name,surname,id_language,start_date) VALUES ($1,$2,$3,$4,$5,$6)',
    getCustomerByIdUser: 'SELECT id_customer,id_user,exception FROM user_customer WHERE id_user=$1',

    // ---------
    // customer queries -----------

    getCustomers: 'SELECT id, identification, name,phone_number FROM customer WHERE NOT deleted ORDER BY id ',
    getCustomersByIdCustomer: 'SELECT id, identification, name,phone_number FROM customer WHERE id = $1 AND NOT deleted',
    getCustomersByIdentification: 'SELECT id, identification, name,phone_number FROM customer WHERE identification = $1 AND NOT deleted',
    getNextIdCustomer: 'SELECT nextval(\'customer_id_seq\')',

    getBrandsByIdCustomer: 'SELECT id, description,image,color, id_customer, deleted FROM brand WHERE id_customer= $1 AND NOT deleted ORDER BY id',
    getBrandsByIdCustomersDeleted: 'SELECT image FROM brand WHERE id_customer= $1 AND deleted',
    getBrandById: 'SELECT id id_brand, description,image,color, id_customer FROM brand WHERE id= $1 AND NOT deleted',
    getBrandByImage: 'SELECT id id_brand,id_customer FROM brand WHERE image= $1 AND NOT deleted LIMIT 1',

    getMarketRegionsByIdCustomer: 'SELECT id, description, id_customer, deleted FROM market_region WHERE id_customer= $1 AND NOT deleted ORDER BY id',
    getMarketRegionsById: 'SELECT id id_market_region, description, id_customer FROM market_region WHERE id= $1 AND NOT deleted',

    getScreenLocationById: 'SELECT id,description, deleted FROM screen_location WHERE id = $1 ',
    getScreenLocationByIdCustomer: 'SELECT id,description, id_customer, deleted  FROM screen_location WHERE id_customer = $1 AND NOT deleted ORDER BY id',

    getSiteComercialCodeByIdCustomer: 'SELECT id,acronym, id_customer,deleted  FROM site_comercial_code WHERE id_customer = $1 AND NOT deleted ORDER BY id',

    insertCustomer: 'INSERT INTO customer(id,identification,name,phone_number) VALUES ($1,$2,$3,$4)',
    insertBrand: 'INSERT INTO brand (description,image,id_customer,color) VALUES ($1,$2,$3,$4)',
    insertMarketRegion: 'INSERT INTO market_region (description,id_customer) VALUES ($1,$2)',
    insertScreenLocation: 'INSERT INTO screen_location (description,id_customer) VALUES ($1,$2)',
    insertSiteComercialCode: 'INSERT INTO site_comercial_code (acronym,id_customer,current_year,sequence) VALUES ($1,$2,$3,1)',

    updateCustomer: 'UPDATE customer SET name=$2 ,phone_number=$3 WHERE id=$1',
    updateMarketRegion: 'UPDATE market_region SET description=$2, deleted=$3 WHERE id=$1',
    updateScreenLocation: 'UPDATE screen_location SET description=$2, deleted=$3 WHERE id=$1',
    updateSiteComercialCode: 'UPDATE site_comercial_code SET acronym=$2, deleted=$3 WHERE id=$1',
    updateBrand: 'UPDATE brand SET description=$2,image=$3,color=$4, deleted=$5 WHERE id=$1',
    updateBrand2: 'UPDATE brand SET description=$2,color=$4, deleted=$5 WHERE id=$1',
    updateBrandImageById: 'UPDATE brand SET image = $2 WHERE id = $1',

    deleteCustomer: 'UPDATE customer SET deleted = true WHERE id=$1',
    deleteBrandByIdCustomer: 'UPDATE brand SET deleted = true WHERE id_customer = $1 ',
    deleteMarketRegionByIdCustomer: 'UPDATE market_region SET deleted = true WHERE id_customer=$1',
    deleteScreenLocationByIdCustomer: 'UPDATE screen_location SET deleted = true WHERE id_customer=$1',
    deleteSiteComercialCodeByIdCustomer: 'UPDATE site_comercial_code SET deleted = true WHERE id_customer=$1',

    // ---------
    getCategoryBySiteAndUser: ' SELECT b.id , b.description, b.color FROM site_user_category a INNER JOIN category b ON a.id_category=b.id WHERE a.id_site = $1 AND a.id_user = $2 AND NOT b.deleted '

}