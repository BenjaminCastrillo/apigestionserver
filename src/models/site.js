class Site {
    constructor(id, id_site_comercial, id_pti, id_venue, id_customer,
        id_network, des_network, id_status,
        des_status, entry_date, public_, on_off, text_,
        id_screen_location, des_screen_location, category,
        id_screen, inches, serial_, id_screen_brand,
        des_screen_brand, id_screen_model,
        des_screen_model, resolution_width, resolution_heigth,
        id_screen_type, des_screen_type,
        situation, id_orientation, des_orientation, cabinets_width,
        cabinets_heigth, id_player, serial_number, mac,
        id_orientation_player, des_orientation_player, id_os, des_os,
        os_version, app_version, license
    )

    {
        this.id = id;
        this.siteComercialId = id_site_comercial;
        this.idpti = id_pti;
        this.venueId = id_venue;
        this.customerId = id_customer;
        this.network = {
            id: id_network,
            description: des_network
        }
        this.status = {
            id: id_status,
            description: des_status
        };
        this.entry_date = entry_date;
        this.public_ = public_;
        this.on_off = on_off;
        this.text_ = text_;
        this.screenLocation = {
            id: id_screen_location,
            description: des_screen_location
        };
        this.category = category;
        this.screen = {
            id: id_screen,
            inches: inches,
            serialNumber: serial_,
            screenBrand: {
                id: id_screen_brand,
                description: des_screen_brand
            },

            screenModel: {
                id: id_screen_model,
                description: des_screen_model
            },

            resolutionWidth: resolution_width,
            resolutionHeigth: resolution_heigth,
            screenType: {
                id: id_screen_type,
                description: des_screen_type
            },

            situation: situation,
            orientation: {
                id: id_orientation,
                description: des_orientation
            },
            cabinetsWidth: cabinets_width,
            cabinetsHeigth: cabinets_heigth
        };
        this.player = {
            id: id_player,
            serialNumber: serial_number,
            mac: mac,
            orientation: {
                id: id_orientation_player,
                description: des_orientation_player
            },
            os: {
                id: id_os,
                description: des_os
            },
            osVersion: os_version,
            appVersion: app_version,
            activeLicense: license

        }

    }

}
module.exports.Site = Site;