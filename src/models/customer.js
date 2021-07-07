class Customer {
    constructor(id_customer, identification, name, phone_number, brands, marketRegions,
        locationsScreen, sitesComercialCodes) {

        this.id = id_customer;
        this.identification = identification;
        this.name = name;
        this.phoneNumber = phone_number;
        this.brands = brands;
        this.marketRegions = marketRegions;
        this.locationsScreen = locationsScreen;
        this.sitesComercialCodes = sitesComercialCodes;
    }

}
module.exports.Customer = Customer;