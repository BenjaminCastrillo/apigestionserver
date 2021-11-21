class Venue {
    constructor(id_venue, name, image_Venue, id_customer, identification_customer, name_customer, address, street_number,
        id_country, des_country, location, id_road_type, des_road_type, latitude, longitude, postal_code, id_brand,
        des_brand, color, image_brand, deleted_brand, id_market_region, des_market_region, deleted_market_region, entry_date, contacts,
        schedule, sites) {

        this.id = id_venue;
        this.name = name;
        this.image = image_Venue;
        this.country = {
            id: id_country,
            description: des_country
        };
        this.customer = {
            id: id_customer,
            identification: identification_customer,
            name: name_customer
        };

        this.location = location;
        this.roadType = {
            id: id_road_type,
            description: des_road_type
        };
        this.address = address;
        this.streetNumber = street_number;

        this.postalCode = postal_code;
        this.latitude = latitude;
        this.longitude = longitude;
        this.marketRegion = {
            id: id_market_region,
            description: des_market_region,
            deleted: deleted_market_region
        };
        this.brand = {
            id: id_brand,
            description: des_brand,
            color: color,
            image: image_brand,
            deleted: deleted_brand
        };
        this.entryDate = entry_date;
        this.contact = contacts;

        this.schedule = schedule;
        this.sites = sites
    }

}
module.exports.Venue = Venue;