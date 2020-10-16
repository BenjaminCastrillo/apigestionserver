class Venue {
    constructor(id_venue, name, id_customer, address, street_number, id_country,
        des_country, location, id_road_type, des_road_type, latitude, longitude, postal_code, id_brand, des_brand, id_market_region, des_market_region) {

        this.id = id_venue;
        this.id_customer = id_customer;
        this.name = name;
        this.country = {
            id: id_country,
            description: des_country
        };
        this.location = location;
        this.road_type = {
            id: id_road_type,
            description: des_road_type
        };
        this.address = address;
        this.streat_number = street_number;

        this.postal_code = postal_code;
        this.latitude = latitude;
        this.longitude = longitude;
        this.market_region = {
            id: id_market_region,
            description: des_market_region
        };
        this.brand = {
            id: id_brand,
            description: des_brand
        }
    }

}
module.exports.Venue = Venue;