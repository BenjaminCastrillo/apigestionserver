class Category {
    constructor(id_category, des_category, id_user, color) {

        this.id = id_category;
        this.description = des_category;
        this.userId = id_user;
        this.color = color;
    };

}
module.exports.Category = Category