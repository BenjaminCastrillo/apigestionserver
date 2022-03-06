class Location {
    constructor(id_location, id_organization_territorial, name_organization_territorial, id_entity_territorial,
        name_entity_territorial, hierarchy_) {

        this.id = id_location;
        this.territorialOrganizationId = id_organization_territorial;
        this.territorialOrganizationName = name_organization_territorial;
        this.territorialEntityId = id_entity_territorial;
        this.territorialEntityName = name_entity_territorial;
        this.hierarchy = hierarchy_

    };

}
module.exports.Location = Location