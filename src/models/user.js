class User {
    constructor(id_user, name, surname, last_access, id_language, email, password, id_rol, desc_rol,
        user_relationship, notes, entry_date, blocked,

        customers, sites, categories) {

        this.id = id_user;
        this.name = name;
        this.surname = surname;
        this.lastAccess = last_access;
        this.languageId = id_language;
        this.email = email;
        this.password = password;
        this.rol = {
            id: id_rol,
            description: desc_rol
        };
        this.relationship = user_relationship;
        this.notes = notes;
        this.entryDate = entry_date;
        this.blocked = blocked;
        this.customerUserList = customers;
        this.sitesList = sites;
        this.categories = categories;
    }

}
module.exports.User = User;