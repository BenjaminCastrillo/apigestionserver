module.exports = {



    getCountries: 'SELECT a.id id_country,b.text_, a.code1, a.code2, a.code_iso FROM country a INNER JOIN language_description b ON a.id_description=b.id_description WHERE b.id_language IN ($1,0) AND NOT a.deleted ORDER BY b.text_',
    getCountryById: 'SELECT a.id id_country,b.text_, a.code1, a.code2, a.code_iso FROM country a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.id=$1 AND b.id_language IN ($2,0)',
    getLicenseById: 'SELECT id id_license, license_number, activation_date ,expiration_date, duration_months from license WHERE id=$1',

    getMonths: 'SELECT a.value_ id, b.text_ FROM parameter a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.column_=\'month\' AND b.id_language IN ($1,0) ORDER BY TO_NUMBER(a.value_,\'99\')',

    getNetworks: 'SELECT a.id,b.text_ FROM network a INNER JOIN language_description b ON a.id_description=b.id_description WHERE b.id_language IN ($1,0)',
    getNetworkById: 'SELECT a.id, b.text_ description FROM network a INNER JOIN language_description b ON a.id_description = b.id_description WHERE a.id = $1 AND b.id_language in ($2, 0)',
    getDefaultNetwork: 'SELECT id FROM network WHERE default_ LIMIT 1',
    getDefaultStatus: 'SELECT id FROM status WHERE default_ LIMIT 1',

    getTextLicenseById: 'SELECT a.value_ id, b.text_ description FROM parameter a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.column_=\'valid_license\' AND a.value_=$1 AND b.id_language IN ($2,0)',


    getOrientations: 'SELECT a.value_ id, b.text_ description FROM parameter a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.column_=\'orientation\' AND b.id_language IN ($1,0)',
    getOrientationById: 'SELECT a.value_ id, b.text_ description FROM parameter a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.column_=\'orientation\' AND a.value_=$1 AND b.id_language IN ($2,0)',
    getOs: 'SELECT id, description FROM operating_system WHERE NOT deleted',
    getOsById: 'SELECT id, description FROM operating_system WHERE id = $1 ',

    getRoadTypes: 'SELECT a.id id_road_type,b.text_ FROM road_type a INNER JOIN language_description b ON a.id_description=b.id_description WHERE b.id_language IN ($1,0)',
    getRoadTypeById: 'SELECT a.id id_road_type,b.text_ FROM road_type a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.id=$1 AND b.id_language IN ($2,0)',

    getRoles: 'SELECT a.value_ id, b.text_ description FROM parameter a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.column_=\'rol\' AND b.id_language IN ($1,0)',
    getRolById: 'SELECT a.value_ id, b.text_ description FROM parameter a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.column_=\'rol\' AND a.value_=$1 AND b.id_language IN ($2,0)',

    getScreenBrands: 'SELECT id, description FROM screen_brand WHERE NOT deleted',
    getScreenBrandById: 'SELECT id, description FROM screen_brand WHERE id = $1 ',
    getScreenModels: 'SELECT a.id id_screen_model,a.description,c.text_ screen_type,a.resolution_width,a.resolution_height,a.measure_width,a.measure_height,b.panel,a.pixel, a.inches,a.id_screen_brand,a.id_screen_type FROM screen_model a INNER JOIN screen_type b ON a.id_screen_type = b.id INNER JOIN language_description c ON b.id_description = c.id_description WHERE c.id_language in ($1, 0) AND NOT a.deleted ORDER BY a.description',
    //  getScreenModels: 'SELECT a.id id_screen_model,a.description,c.text_ screen_type,a.resolution_width,a.resolution_height,a.measure_width,a.measure_height,b.panel,a.pixel, a.inches,a.id_screen_brand,a.id_screen_type FROM screen_model a INNER JOIN screen_type b ON a.id_screen_type = b.id INNER JOIN language_description c ON b.id_description = c.id_description WHERE a.id_screen_brand = $1 AND a.id_screen_type=$3 AND c.id_language in ($2, 0) AND NOT a.deleted ORDER BY a.description',
    getScreenModelById: 'SELECT id, description,id_screen_type,resolution_width,resolution_height,measure_width,measure_height,pixel,inches FROM screen_model WHERE id = $1 ',

    getScreenTypeById: 'SELECT a.id,b.text_ description, a.panel FROM screen_type a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.id=$1 AND b.id_language IN ($2,0)',
    getScreenTypes: 'SELECT a.id,b.text_ description, a.panel FROM screen_type a  INNER JOIN language_description b ON a.id_description=b.id_description WHERE NOT a.deleted AND b.id_language IN ($1,0)',
    getLanguages: 'SELECT id, description FROM language WHERE NOT deleted',



    getScheduleTypes: 'SELECT a.value_ id, b.text_ FROM parameter a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.column_=\'schedule_type\' AND b.id_language IN ($1,0) ORDER BY a.value_',


    getStatus: 'SELECT a.id,b.text_ description FROM status a INNER JOIN language_description b ON a.id_description=b.id_description WHERE b.id_language IN ($1,0)',
    getStatusById: 'SELECT a.id,b.text_ description FROM status a INNER JOIN language_description b ON a.id_description = b.id_description WHERE a.id = $1 AND b.id_language in ($2, 0)',
    getAllTerritorialEntitiesByIdTerritorialOrg: 'SELECT a.id, b.text_,a.relation_id FROM territorial_entities a INNER JOIN language_description b ON a.id_description = b.id_description WHERE a.id_territorial_org = $1 AND b.id_language in ($2, 0)',
    getTerritorialEntitiesByIdTerritorialOrg: 'SELECT a.id, b.text_, a.relation_id FROM territorial_entities a INNER JOIN language_description b ON a.id_description = b.id_description WHERE a.id_territorial_org = $1 AND a.relation_id = $3 AND b.id_language in ($2, 0)',

    getTerritorialOrganizationById: 'SELECT a.id,b.text_  FROM territorial_organization a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.id=$1 AND b.id_language IN ($2,0)',
    getTerritorialOrganization: 'SELECT a.id,b.text_ FROM territorial_organization a INNER JOIN language_description b ON a.id_description=b.id_description WHERE b.id_language IN ($1,0)',
    getTerritorialOrganizationByIdCountry: 'select a.id, b.text_,a.hierarchy_ FROM territorial_organization a INNER JOIN language_description b ON a.id_description = b.id_description WHERE a.id_country = $1 AND b.id_language IN($2, 0) ORDER BY a.hierarchy_ ',



    getWeekDays: 'SELECT a.value_ id, b.text_ FROM parameter a INNER JOIN language_description b ON a.id_description=b.id_description WHERE a.column_=\'week_day\' AND b.id_language IN ($1,0) ORDER BY a.value_',

    // Venues and sites queries -------------


    getVenuesByCustomerId: 'SELECT b.id id_venue,b.id_customer,b.name,b.image,b.id_road_type,b.address,b.street_number,b.postal_code,b.id_brand,b.id_country,b.latitude,b.longitude,b.id_market_region,b.entry_date FROM venue b WHERE b.id_customer=$1 AND NOT b.deleted ORDER BY b.id',
    getVenuesByUser: 'SELECT b.id id_venue,b.id_customer,b.name,b.image,b.id_road_type,b.address,b.street_number,b.postal_code,b.id_brand,b.id_country,b.latitude,b.longitude,b.id_market_region,b.entry_date FROM user_customer a INNER JOIN venue b ON a.id_customer=b.id_customer WHERE a.id_user=$1 AND NOT a.deleted AND NOT b.deleted ORDER BY b.id',
    getAllVenues: 'SELECT b.id id_venue,b.id_customer,b.name,b.image,b.id_road_type,b.address,b.street_number,b.postal_code,b.id_brand,b.id_country,b.latitude,b.longitude,b.id_market_region,b.entry_date FROM venue b WHERE NOT b.deleted ORDER BY b.id',
    getVenueById: 'SELECT b.id id_venue,b.id_customer,b.name,b.image,b.id_road_type,b.address,b.street_number,b.postal_code,b.id_brand,b.id_country,b.latitude,b.longitude,b.id_market_region,b.entry_date FROM venue b WHERE id=$1 AND NOT b.deleted',

    getNextIdVenue: 'SELECT nextval(\'venue_id_seq\')',
    getIdVenuesByVenueAndUser: 'SELECT a.id FROM venue a INNER JOIN user_customer b ON a.id_customer = b.id_customer WHERE a.id = $1 AND b.id_user = $2',
    getSitesByUser: 'SELECT b.id id_venue, b.id_customer, b.name, b.id_road_type, b.address, b.id_country, b.postal_code, b.latitude ,b.longitude ,b.id_market_region, b.id_brand, c.id id_site, c.id_site_comercial, c.id_pti, c.id_network, c.id_status,c.image, c.public_,c.on_off, c.text_, c.id_screen_location FROM user_customer a INNER JOIN venue b ON a.id_customer=b.id_customer INNER JOIN site c ON b.id=c.id_venue RIGHT JOIN user_no_site d ON c.id!=d.id_site WHERE a.id_user=$1 AND NOT b.deleted AND NOT c.deleted ORDER BY b.id',
    getSitesByVenueId: 'SELECT a.id id_site, a.id_site_comercial,a.id_pti,a.id_venue,a.id_customer,a.id_network,a.id_status,a.entry_date,a.image,a.public_,a.on_off,a.text_,a.id_screen_location,b.id id_player,b.serial_number,b.mac,b.id_orientation id_orientation_player,b.id_os,b.os_version,b.app_version,b.license_id,c.id id_screen,c.inches,c.serial_number,c.id_screen_brand,c.id_screen_model,c.resolution_width,c.resolution_height,c.id_screen_type,c.pixel,c.id_orientation,c.screen_width, c.screen_height,c.modules_width,c.modules_height,c.situation FROM site a INNER JOIN player b ON a.id = b.id_site LEFT JOIN screen c ON a.id = c.id_site WHERE a.id_venue = $1 AND NOT a.deleted ORDER BY a.id',
    getSitesById: 'SELECT a.id id_site, a.id_site_comercial,a.id_pti,a.id_venue,a.id_customer,a.id_network,a.id_status,a.entry_date,a.image,a.public_,a.on_off,a.text_,a.id_screen_location,b.id id_player,b.serial_number,b.mac,b.id_orientation id_orientation_player,b.id_os,b.os_version,b.app_version,b.license_id,c.id id_screen,c.inches,c.serial_number serial_,c.id_screen_brand,c.id_screen_model,c.resolution_width,c.resolution_height,c.id_screen_type,c.pixel,c.id_orientation,c.screen_width, c.screen_height,c.modules_width,c.modules_height,c.situation FROM site a INNER JOIN player b ON a.id = b.id_site LEFT JOIN screen c ON a.id = c.id_site WHERE a.id = $1 AND NOT a.deleted',
    getNextIdSite: 'SELECT nextval(\'site_id_seq\')',


    getCategoryBySiteAndUser: ' SELECT b.id , b.description, b.color FROM site_user_category a INNER JOIN category b ON a.id_category=b.id WHERE a.id_site = $1 AND a.id_user = $2 AND NOT b.deleted ',
    getCategoryBySite: 'SELECT b.id , b.description, b.color,c.email email FROM site_user_category a INNER JOIN category b ON a.id_category = b.id INNER JOIN user_app c ON a.id_user = c.id WHERE a.id_site = $1 AND NOT b.deleted ',

    getLocationByVenue: 'SELECT a.id,a.id_territorial_ent,c.text_,a.id_territorial_org FROM location a INNER JOIN territorial_entities b ON  a.id_territorial_ent=b.id INNER JOIN language_description c ON b.id_description=c.id_description  WHERE a.id_venue=$1 AND c.id_language IN ($2,0) ORDER BY a.hierarchy_',
    getContactsByVenueIdBB: 'SELECT a.id,a.name,a.email,a.notes notes_contact, a.deleted deleted_contact,b.id id_contact_phone,b.phone_number,b.notes notes_phone,b.deleted deleted_phone FROM contact_venue a INNER JOIN contact_phone b ON a.id=b.id_contact_venue WHERE a.id_venue=$1 AND NOT a.deleted AND NOT b.deleted ORDER BY a.id',
    getContactsByVenueId: 'SELECT id,name,email,notes notes_contact, deleted FROM contact_venue a WHERE id_venue=$1 AND NOT deleted ORDER BY id',
    getPhonesByContactId: 'SELECT id id_contact_phone,phone_number,notes notes_phone, deleted FROM contact_phone WHERE id_contact_venue=$1 AND NOT deleted ORDER BY id',

    getSchedulesByVenueId: 'SELECT  id,id_customer_schedule,deleted FROM venue_schedule WHERE id_venue=$1 AND NOT deleted ORDER BY id_customer_schedule',

    getVenueByImage: 'SELECT id id_venue FROM venue WHERE image=$1 AND NOT deleted LIMIT 1',
    getSiteByImage: 'SELECT id id_site FROM site WHERE image=$1 AND NOT deleted LIMIT 1',

    getVenueImageByFileName: 'SELECT image FROM venue WHERE id=$1 AND NOT deleted',
    getSiteImageByFileName: 'SELECT image FROM site WHERE id=$1 AND NOT deleted',

    insertVenue: 'INSERT INTO venue(id, id_customer, name, id_road_type, address, street_number,id_country,postal_code,latitude,longitude,id_market_region,id_brand,image,entry_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,$12,$13,$14)',
    insertLocationVenue: 'INSERT INTO location(id_territorial_org,id_territorial_ent,id_venue,hierarchy_) VALUES($1, $2, $3, $4)',

    insertSite: 'INSERT INTO site(id, id_site_comercial, id_pti, id_venue, id_customer, id_network,entry_date, id_status) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    insertScheduleVenue: 'INSERT INTO venue_schedule(id_venue,id_customer_schedule) VALUES($1,$2)',

    insertPhoneContactVenue: 'INSERT INTO contact_phone(id_contact_venue,phone_number,notes) VALUES($1,$2,$3)',
    getNextIdContact: 'SELECT nextval(\'contact_venue_id_seq\')',
    insertContactVenue: 'INSERT INTO contact_venue(id,name,email,notes,id_venue) VALUES($1,$2,$3,$4,$5)',
    insertScreen: 'INSERT INTO screen(id_site) VALUES($1)',
    insertPlayer: 'INSERT INTO player(id_site,license_id) VALUES($1,$2)',

    getNextIdLicense: 'SELECT nextval(\'license_id_seq\')',

    insertLicense: 'INSERT INTO license(id,license_number,entry_date,duration_months) VALUES($1,$2,$3,$4)',

    deleteVenue: 'UPDATE venue SET delete_date = $2,deleted = true WHERE id=$1',
    deleteSite: 'UPDATE site SET delete_date = $2,deleted = true WHERE id=$1',
    deleteSiteByIdVenue: 'UPDATE site SET delete_date = $2,deleted = true WHERE id_venue=$1',
    updateStatusSite: 'UPDATE site SET status = $2 WHERE id=$1',

    updateVenue: 'UPDATE venue SET id_customer=$2 ,name=$3,id_road_type=$4,address=$5,street_number=$6,id_country=$7,postal_code=$8,latitude=$9,longitude=$10,id_market_region=$11,id_brand=$12,image=$13 WHERE id=$1',
    updateLocationVenue: 'UPDATE location SET id_territorial_org=$2,id_territorial_ent=$3 WHERE id=$1',
    updateScheduleVenue: 'UPDATE venue_schedule SET deleted=$2,delete_date=$3 WHERE id=$1',
    updateContactVenue: 'UPDATE contact_venue SET name=$2,email=$3,notes=$4,deleted=$5,delete_date=$6 WHERE id=$1',
    updatePhoneContactVenue: 'UPDATE contact_phone SET id_contact_venue=$2,phone_number=$3,notes=$4,deleted=$5,delete_date=$6 WHERE id=$1',

    updateSite: 'UPDATE site SET id_status=$2 ,public_=$3,on_off=$4,text_=$5,id_screen_location=$6,image=$7 WHERE id=$1',
    updateScreen: 'UPDATE screen SET inches=$2 ,serial_number=$3,id_screen_brand=$4,id_screen_model=$5,resolution_width=$6,resolution_height=$7,id_screen_type=$8,situation=$9,screen_width=$10,screen_height=$11,id_orientation=$12,pixel=$13,modules_width=$14,modules_height=$15 WHERE id=$1',
    updatePlayer: 'UPDATE player SET serial_number=$2,id_orientation=$3 WHERE id=$1',


    updateVenueImageById: 'UPDATE venue SET image = $2 WHERE id = $1',
    updateSiteImageById: 'UPDATE site SET image = $2 WHERE id = $1',
    updateStatusSite: 'UPDATE site SET id_status = $2 WHERE id = $1',

    // user queries ---------------

    getCategoriesByUser: 'SELECT id, description, color ,deleted FROM category WHERE id_user = $1 AND NOT deleted ',
    getCustomerByUser: 'SELECT a.id, a.id_customer, b.name,a.exception, a.deleted FROM user_customer a INNER JOIN customer b ON a.id_customer=b.id WHERE a.id_user= $1 AND NOT a.deleted',
    getExceptionSitesByUser: 'SELECT a.id_site id,b.id_site_comercial comercialCode FROM user_exception_site a INNER JOIN site b ON a.id_site=b.id WHERE a.id_user= $1',

    getUsers: 'SELECT id id_user,name,surname,last_access,notes,id_language,entry_date,email, password, user_relationship,rol,blocked FROM user_app WHERE NOT deleted AND NOT admin ORDER BY id',
    getUserById: 'SELECT id id_user, name, surname, last_access,notes, id_language, entry_date,email, password, user_relationship, rol,blocked  FROM user_app WHERE id=$1 AND NOT deleted',
    getUserEmail: 'SELECT id, name, surname, last_access,notes, id_language, entry_date,email, password, user_relationship, rol,blocked,admin,wrong_attemps FROM user_app WHERE email=$1 AND NOT deleted',
    getNextIdUser: 'SELECT nextval(\'user_app_id_seq\')',
    getCustomerByIdUser: 'SELECT id_customer,id_user,exception FROM user_customer WHERE id_user=$1 AND NOT deleted',

    insertUserApp: 'INSERT INTO user_app(id,name,surname,id_language,email,password,rol,user_relationship,notes,blocked) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
    insertUserCustomer: 'INSERT INTO user_customer(id_user,id_customer) VALUES ($1,$2)',
    insertCategory: 'INSERT INTO category(description,color,id_user) VALUES ($1,$2,$3)',

    updateUserPassword: 'UPDATE user_app SET name=$2 ,surname=$3,id_language=$4,email=$5,password=$6,rol=$7,user_relationship=$8,notes=$9,blocked=$10,wrong_attemps=$11 WHERE id=$1',
    updateUserNoPassword: 'UPDATE user_app SET name=$2 ,surname=$3,id_language=$4,email=$5,rol=$6,user_relationship=$7,notes=$8,blocked=$9,wrong_attemps=$10 WHERE id=$1',
    updateUserCustomer: 'UPDATE user_customer SET exception=$2, deleted=$3,delete_date=$4 WHERE id=$1',
    updateCategory: 'UPDATE category SET description=$2, color=$3, deleted=$4,delete_date=$5 WHERE id=$1',
    updateUserAccess: 'UPDATE user_app SET last_access=$2 ,blocked=$3, wrong_attemps=$4 WHERE id=$1',

    deleteUser: 'UPDATE user_app SET delete_date = $2, deleted = true WHERE id=$1',
    deleteCategoryByIdUser: 'UPDATE category SET delete_date = $2, deleted = true WHERE id_user=$1',
    deleteUserCustomerIdUser: 'UPDATE user_customer SET delete_date = $2, deleted = true WHERE id_user=$1',

    // ---------
    // customer queries -----------

    getCustomers: 'SELECT id, identification, name,phone_number,entry_date,contact_name FROM customer WHERE NOT deleted ORDER BY id ',
    getCustomersByIdCustomer: 'SELECT id, identification, name,phone_number,entry_date,contact_name FROM customer WHERE id = $1 AND NOT deleted',
    getCustomerById: 'SELECT id, identification, name,phone_number,entry_date,contact_name FROM customer WHERE id = $1',
    getCustomersByIdentification: 'SELECT id, identification, name,phone_number,entry_date ,contact_name FROM customer WHERE identification = $1 AND NOT deleted',
    getNextIdCustomer: 'SELECT nextval(\'customer_id_seq\')',


    getBrandsByIdCustomer: 'SELECT id, description,image,color, id_customer, deleted FROM brand WHERE id_customer= $1 AND NOT deleted ORDER BY id',
    getBrandsByIdCustomersDeleted: 'SELECT image FROM brand WHERE id_customer= $1 AND deleted',
    getBrandById: 'SELECT id id_brand, description,image,color, id_customer, deleted FROM brand WHERE id= $1',
    getBrandByImage: 'SELECT id id_brand,id_customer FROM brand WHERE image= $1 LIMIT 1',

    getMarketRegionsByIdCustomer: 'SELECT id, description, id_customer, deleted FROM market_region WHERE id_customer= $1 ORDER BY id',
    getMarketRegionsById: 'SELECT id id_market_region, description, id_customer,deleted FROM market_region WHERE id= $1',

    getScreenLocationById: 'SELECT id id_screen_location,description, deleted FROM screen_location WHERE id = $1 ',
    getScreenLocationByIdCustomer: 'SELECT id,description, id_customer, deleted  FROM screen_location WHERE id_customer = $1 AND NOT deleted ORDER BY id',

    getSiteComercialCodeByIdCustomer: 'SELECT id,acronym, id_customer,deleted  FROM site_comercial_code WHERE id_customer = $1 AND NOT deleted ORDER BY id',
    getSiteComercialCodeById: 'SELECT id,acronym, current_year, sequence  FROM site_comercial_code WHERE id = $1',



    getScheduleVenueByCustomerId: 'SELECT  id,description,week_schedule,start_date,deleted  FROM customer_schedule WHERE id_customer=$1 AND NOT deleted ORDER BY id',
    getScheduleVenueById: 'SELECT  id,description,week_schedule,start_date,deleted  FROM customer_schedule WHERE id=$1',

    insertCustomer: 'INSERT INTO customer(id,identification,name,phone_number,entry_date,contact_name) VALUES ($1,$2,$3,$4,$5,$6)',
    insertBrand: 'INSERT INTO brand (description,image,id_customer,color) VALUES ($1,$2,$3,$4)',
    insertMarketRegion: 'INSERT INTO market_region (description,id_customer) VALUES ($1,$2)',
    insertScreenLocation: 'INSERT INTO screen_location (description,id_customer) VALUES ($1,$2)',
    insertSiteComercialCode: 'INSERT INTO site_comercial_code (acronym,id_customer,current_year,sequence) VALUES ($1,$2,$3,1)',
    insertScheduleCustomer: 'INSERT INTO customer_schedule (description,start_date,week_schedule,id_customer) VALUES ($1,$2,$3,$4)',

    updateCustomer: 'UPDATE customer SET name=$2 ,phone_number=$3,contact_name=$4 WHERE id=$1',
    updateMarketRegion: 'UPDATE market_region SET description=$2, deleted=$3,delete_date=$4 WHERE id=$1',
    updateScreenLocation: 'UPDATE screen_location SET description=$2, deleted=$3,delete_date=$4 WHERE id=$1',
    updateSiteComercialCode: 'UPDATE site_comercial_code SET acronym=$2, deleted=$3,delete_date=$4 WHERE id=$1',
    updateBrand: 'UPDATE brand SET description=$2,image=$3,color=$4, deleted=$5,delete_date=$6 WHERE id=$1',
    updateBrand2: 'UPDATE brand SET description=$2,color=$4, deleted=$5 WHERE id=$1',
    updateBrandImageById: 'UPDATE brand SET image = $2 WHERE id = $1',
    updateSchedules: 'UPDATE customer_schedule SET description=$2, start_date=$3,week_schedule=$4,deleted=$5,delete_date=$6 WHERE id=$1',
    increaseSiteComercialCode: 'UPDATE site_comercial_code SET sequence=$2 ,current_year=$3 WHERE id=$1',

    deleteCustomer: 'UPDATE customer SET delete_date = $2, deleted = true WHERE id=$1',
    deleteBrandByIdCustomer: 'UPDATE brand SET delete_date = $2,deleted = true WHERE id_customer = $1 ',
    deleteMarketRegionByIdCustomer: 'UPDATE market_region SET delete_date = $2,deleted = true WHERE id_customer=$1',
    deleteScreenLocationByIdCustomer: 'UPDATE screen_location SET delete_date = $2,deleted = true WHERE id_customer=$1',
    deleteSiteComercialCodeByIdCustomer: 'UPDATE site_comercial_code SET delete_date = $2,deleted = true WHERE id_customer=$1',
    deleteSchedulesByIdCustomer: 'UPDATE customer_schedule SET delete_date = $2,deleted = true WHERE id_customer=$1',

    deleteUserByIdCustomer: 'UPDATE user_customer SET delete_date = $2,deleted = true WHERE id_customer=$1',

    // ---------
}