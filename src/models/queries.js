module.exports = {

    insertUserApp: 'INSERT INTO user_app(id,id_customer,name,surname,id_languaje,start_date) VALUES ($1,$2,$3,$4,$5,$6)',

    getCountries: 'SELECT a.id,b.text_, a.code1, a.code2, a.code_iso FROM country a INNER JOIN languaje_description b ON a.id_description=b.id_description WHERE b.id_languaje IN ($1,0)',
    getRoadTypes: 'SELECT a.id,b.text_ FROM road_type a INNER JOIN languaje_description b ON a.id_description=b.id_description WHERE b.id_languaje IN ($1,0)',
    getSitesByUser: 'SELECT b.id id_place, b.id_customer, b.name, b.road_type, b.address, b.id_country, b.postal_code, b.latitude ,b.longitude ,b.id_market_region,b.id_brand, c.id id_site, c.id_site_comercial, c.id_pti, c.id_net, c.id_status, c.id_brand,c.on_off, c.text_, c.id_screen_location FROM user_customer a INNER JOIN place b ON a.id_customer=b.id_customer INNER JOIN site c ON b.id=c.id_place RIGHT JOIN user_no_site d ON c.id!=d.id_site WHERE a.id_user=$1 AND NOT b.deleted AND NOT c.deleted',
    getStatus: 'SELECT a.id,b.text_ FROM status a INNER JOIN languaje_description b ON a.id_description=b.id_description WHERE b.id_languaje IN ($1,0)',
    getUsers: 'SELECT id id_user,id_customer,name,surname,id_languaje,start_date FROM user_app',
    getNetworks: 'SELECT a.id,b.text_ FROM network a INNER JOIN languaje_description b ON a.id_description=b.id_description WHERE b.id_languaje IN ($1,0)',
    getMarketRegionsByIdCustomer: 'SELECT id id_market_region, description, id_customer FROM market_region WHERE id_customer= $1 AND NOT deleted',
    getMarketRegionsById: 'SELECT id id_market_region, description, id_customer FROM market_region WHERE id= $1 AND NOT deleted',

}