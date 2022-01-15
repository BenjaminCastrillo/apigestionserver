class ExceptionsSites {
    constructor(id, id_site, id_site_comercial, name_venue, id_customer, identification_customer, name_customer,
        //       id_screen_location, des_screen_location, deleted_location,
        deleted_exception
    )

    {
        this.id = id;
        this.siteId = id_site;
        this.siteComercialId = id_site_comercial;

        this.venueName = name_venue;
        this.customer = {
            id: id_customer,
            identification: identification_customer,
            name: name_customer
        };

        // this.screenLocation = {
        //     id: id_screen_location,
        //     description: des_screen_location,
        //     deleted: deleted_location
        // };
        this.deleted = deleted_exception



    }

}
module.exports.ExceptionsSites = ExceptionsSites;