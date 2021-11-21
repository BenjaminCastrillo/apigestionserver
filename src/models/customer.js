class Customer {
    constructor(id_customer, identification, name, phone_number, entry_date, brands, marketRegions,
        locationsScreen, sitesComercialCodes, schedules, contact_name) {

        this.id = id_customer;
        this.identification = identification;
        this.name = name;
        this.contactName = contact_name;
        this.phoneNumber = phone_number;
        this.entryDate = entry_date;
        this.brands = brands;
        this.marketRegions = marketRegions;
        this.locationsScreen = locationsScreen;
        this.sitesComercialCodes = sitesComercialCodes;
        this.schedules = schedules;
    }

}
module.exports.Customer = Customer;