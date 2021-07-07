class user {
    constructor(id_user, name, surname, last_access, notes,
        id_language, super_user, email, password, customers, owner_user, user_relationship, sites, categories) {

        this.id = id_user;

        this.name = name;
        this.surname = surname;
        this.lastAccess = last_access;
        this.notes = notes;
        this.languageId = id_language;
        this.superUser = super_user;
        this.email = email;
        this.password = password;
        this.customerUserList = customers;
        this.ownerUser = owner_user;
        this.relationship = user_relationship;
        this.sitesLists = sites;
        this.categories = categories;
    }

}
module.exports.User = User;