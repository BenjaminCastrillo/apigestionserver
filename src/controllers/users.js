const { body, validationResult } = require('express-validator');
const validator = require('validator');
const clase = require('../models/user');


const moment = require('moment');
const bcryptjs = require('bcryptjs');
const conectionDB = require('../modules/database');
const queries = require('../models/queries');
const Error = require('../modules/errors/index');
const config = require('../modules/config');


const {
    getUserCustomer,
    getUserExceptionsSites,
    getUserCategories,
    getRolById,
    getExceptionDescriptions
} = require('../modules/servicesdatauser');



//  languajes data
const validLanguages = [];
const defaultLanguage = [];
defaultLanguage[0] = config.localization.defaultLang;
config.localization.langs.forEach(element => {
    validLanguages.push(element.id.toString());
});

// module name
const __moduleName = 'src/controllers/users';

/************************************
 *
 ** Gestion de datos de usuarios 
 ** User data management

 ** Tablas: user_app
 *
 ***********************************/

/**
 ** Obtener usuarios de la tabla user_app
 ** Get users list from user_app table
 
 --------------------------------
 */
const getUsers = (req, res) => {
    const __functionName = 'getUsers';
    const err = validationResult(req); // result of param evaluation 
    if (!paramValidation(err, req, res, 1)) return
    let language = (validLanguages.includes(req.params.language_id)) ? [req.params.language_id] : defaultLanguage;
    let error;

    conectionDB.pool.query(queries.getUsers)
        .then((response) => {

            getUserDescriptions(response.rows, language)
                .then(response => {
                    res.json({
                        result: true,
                        data: response,
                        message: null
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        result: false,
                        message: err
                    });
                })
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();
        });

    return

}


/**
** Obtener usuario por id   
** Get users by id
--------------------------------
*/
const getUserById = (req, res) => {
    const __functionName = 'getUserById';
    const err = validationResult(req); // result of param evaluation 
    if (!paramValidation(err, req, res, 1)) return
    let language = (validLanguages.includes(req.params.language_id)) ? [req.params.language_id] : defaultLanguage;
    let error;
    const param = [req.params.id];

    conectionDB.pool.query(queries.getUserById, param)
        .then((response) => {
            getUserDescriptions(response.rows, language)
                .then(response => {
                    res.json({
                        result: true,
                        data: response,
                        message: null
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        result: false,
                        message: err
                    });
                })
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();
        });
    return
}




/**
** Obtener usuario por email
** Get users by email
--------------------------------
*/
const getUserByEmail = (req, res) => {
    const __functionName = 'getUserByEmail';

    const err = validationResult(req); // result of param evaluation 
    if (!paramValidation(err, req, res, 1)) return
    let language = (validLanguages.includes(req.params.language_id)) ? [req.params.language_id] : defaultLanguage;
    let error;
    const param = [req.params.email];

    conectionDB.pool.query(queries.getUserEmail, param)
        .then((response) => {
            getUserDescriptions(response.rows, language)
                .then(response => {
                    res.json({
                        result: true,
                        data: response,
                        message: null
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        result: false,
                        message: err
                    });
                })
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();
        });
    return
}

/**
 ** Alta de usuarios en la tabla user_app
 ** User registration in the user_app table
 
 --------------------------------
 */
const insertUser = async(req, res) => {
    const __functionName = 'insertUser';
    let error;
    const fecha = new Date();
    let passwordHash = '';

    let salt = await bcryptjs.genSalt(10);
    passwordHash = await bcryptjs.hash(req.body.password, salt);
    console.log('salt', salt)

    const userObject = new clase.User(req.body.id, req.body.name,
        req.body.surname, req.body.lastAccess, req.body.languageId, req.body.email, passwordHash,
        req.body.rol.id, req.body.rol.description, req.body.relationship, req.body.notes, req.body.entryDate,
        req.body.blocked, req.body.customerUserList,
        req.body.sitesList, req.body.categories);

    conectionDB.pool.query(queries.getNextIdUser)
        .then((response) => {
            insertUserData(userObject, response.rows[0].nextval)
                .then(response => {
                    res.json({
                        result: true,
                        data: response,
                        message: null
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        result: false,
                        message: 'Error interno del servidor'
                    });
                })
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: 'Error interno del servidor'
            });
            error.alert();
        });
    return;
}

/**

** actualizacion de datos de usuario
** updates users tables 

Tables:
    user_app
    category
    user_customers

*/


const updateUser = (req, res) => {
    const __functionName = 'updateUser';
    let error;


    const userObject = new clase.User(req.body.id, req.body.name,
        req.body.surname, req.body.lastAccess, req.body.languageId, req.body.email, req.body.password,
        req.body.rol.id, req.body.rol.description, req.body.relationship, req.body.notes, req.body.entryDate,
        req.body.blocked, req.body.customerUserList,
        req.body.sitesList, req.body.categories)

    updateUserData(userObject, req.body.newPassword)
        .then(response => {
            res.json({
                result: true,
                data: response,
                message: null
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                result: false,
                message: 'Error interno del servidor'
            });
        })


    return;
}

/**
 ** Borrar un usuario  y sus datos asociados
 ** delete the user by id
 ** Tables:     user_app, category, user_customers

 
 --------------------------------
 */


const deleteUser = (req, res) => {

    const __functionName = 'deleteUser';
    const err = validationResult(req); // result of param evaluation 
    if (!paramValidation(err, req, res)) return
    let error;
    const param = Number(req.params.id);

    deleteUserData(param)
        .then(response => {
            res.json({
                result: true,
                data: response,
                message: null
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                result: false,
                message: 'Error interno del servidor'
            });
        })

    return


}


/**
 ** Retorna las excepciones de un usuario
 ** Return exceptions sites  by userid

 
 --------------------------------
 */


const siteExceptionsByUser = (req, res) => {

    const __functionName = 'siteExceptionsByUser';
    const err = validationResult(req); // result of param evaluation 
    if (!paramValidation(err, req, res)) return

    let language = (validLanguages.includes(req.params.language_id)) ? [req.params.language_id] : defaultLanguage;
    let error;
    const param = [req.params.user_id];
    let sites = [];

    conectionDB.pool.query(queries.getExceptionSitesByUser, param)
        .then((response) => {
            getExceptionDescriptions(response.rows)
                .then(response => {
                    res.json({
                        result: true,
                        data: response,
                        message: null
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        result: false,
                        message: err
                    });
                })

        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: 'Error interno del servidor'
            });
            error.alert();
        });

    return

}

// Private functions

/**********************************
 *
 ** Obtencion de las descripciones de las propiedades de los usuarios
 ** Get the property descriptions of users
 ** Tablas:  user_app, user_customer, user_exception_site
 *@param users[]
 *
 *?response array de objetos user
 ***********************************/

async function getUserDescriptions(users, language) {
    const __functionName = 'getUserDescriptions';

    let userObject = new Array();
    let customers = new Array();
    let exceptions = new Array();
    let categories = new Array();
    let rolObject = {};
    let rolDescription = '';
    let date = new Date()



    for (let i = 0; i < users.length; i++) {
        try {

            rolObject = await getRolById(users[i].rol, language[0]);
            customers = await getUserCustomer(users[i].id_user);
            exceptions = await getUserExceptionsSites(users[i].id_user);
            categories = await getUserCategories(users[i].id_user);
        } catch (err) {
            throw err;
        }
        rolDescription = (JSON.stringify(rolObject) == '{}') ? null : rolObject.description;

        let ultimoAcceso = users[i].last_access != null ? moment(users[i].last_access).format('DD-MM-YYYY HH:mm:ss') : null;
        let fechaEntrada = moment(users[i].entry_date).format('DD-MM-YYYY HH:mm:ss');

        userObject[i] = new clase.User(users[i].id_user, users[i].name, users[i].surname,
            ultimoAcceso, users[i].id_language, users[i].email, null, users[i].rol, rolDescription, // password null
            users[i].user_relationship, users[i].notes, fechaEntrada, users[i].blocked,
            customers, exceptions, categories);

    }
    return userObject;

}


/**********************************
 *
 ** Insercion de los datos de usuarios
 ** insert   data users
 ** Tablas:  user_app, user_customer, category
 *@param user object,idUser
 *
 *?response resul transaction
 ***********************************/

async function insertUserData(userData, idUser) {
    const __functionName = 'insertUserData';
    const dataQuery = [idUser, userData.name, userData.surname, userData.languageId,
        userData.email, userData.password, userData.rol.id, userData.relationship,
        userData.notes, userData.blocked,
    ];
    const userCustomer = userData.customerUserList;
    const categories = userData.categories;
    const excepciones = userData.sitesList;
    let fecha = new Date();
    let dataInsert = [];

    try {
        await conectionDB.pool.query('BEGIN');
        await conectionDB.pool.query(queries.insertUserApp, dataQuery);


        for (let i = 0; i < userCustomer.length; i++) {
            try {
                dataInsert = [idUser, userCustomer[i].customerId];
                await conectionDB.pool.query(queries.insertUserCustomer, dataInsert);
            } catch (err) {
                throw err;
            }
        }
        for (let i = 0; i < categories.length; i++) {
            try {
                dataInsert = [categories[i].description, categories[i].color, idUser];
                await conectionDB.pool.query(queries.insertCategory, dataInsert);
            } catch (err) {
                throw err;
            }
        }
        for (let i = 0; i < excepciones.length; i++) {
            try {
                dataInsert = [idUser, excepciones[i].siteId];
                await conectionDB.pool.query(queries.insertException, dataInsert);
            } catch (err) {
                throw err;
            }
        }

        await conectionDB.pool.query('COMMIT');
    } catch (err) {

        conectionDB.pool.query('ROLLBACK');
        throw err;
    }

    return userData;
}



/**********************************
 *
 ** Actualizacion de los datos de usuario
 ** update data users
 ** Tablas:  user_app, user_customer, category
 *@param user, 
 *
 *?response resul transaction
 ***********************************/

async function updateUserData(userData, newPassword) {
    const __functionName = 'updateUserData';

    let passwordHash = '';
    let fecha = new Date();
    let ano = fecha.getFullYear();
    let datatQuery = '';

    if (newPassword) {
        passwordHash = await bcryptjs.hash(userData.password, 8);
    }

    const userCustomer = userData.customerUserList;
    const categories = userData.categories;
    const exceptions = userData.sitesList;


    try {
        await conectionDB.pool.query('BEGIN');
        if (newPassword) {
            dataQuery = [userData.id, userData.name, userData.surname, userData.languageId,
                userData.email, passwordHash, userData.rol.id, userData.relationship,
                userData.notes, userData.blocked, 0
            ];
            await conectionDB.pool.query(queries.updateUserPassword, dataQuery);
        } else {
            dataQuery = [userData.id, userData.name, userData.surname, userData.languageId,
                userData.email, userData.rol.id, userData.relationship,
                userData.notes, userData.blocked, 0
            ];
            await conectionDB.pool.query(queries.updateUserNoPassword, dataQuery);
        }
        for (let i = 0; i < userCustomer.length; i++) {
            try {
                if (userCustomer[i].id) {
                    dataQuery = [userCustomer[i].id, userCustomer[i].exception, userCustomer[i].deleted, userCustomer[i].deleted ? fecha : null];
                    await conectionDB.pool.query(queries.updateUserCustomer, dataQuery);
                } else { // registro nuevo
                    dataQuery = [userData.id, userCustomer[i].customerId];
                    await conectionDB.pool.query(queries.insertUserCustomer, dataQuery);
                }
            } catch (err) {
                throw err;
            }
        }
        for (let i = 0; i < categories.length; i++) {
            try {
                if (categories[i].id) {
                    dataQuery = [categories[i].id, categories[i].description, categories[i].color, categories[i].deleted, categories[i].deleted ? fecha : null];
                    await conectionDB.pool.query(queries.updateCategory, dataQuery);

                } else { // registro nuevo
                    dataQuery = [categories[i].description, categories[i].color, userData.id];
                    await conectionDB.pool.query(queries.insertCategory, dataQuery);

                }
            } catch (err) {
                throw err;
            }
        }
        for (let i = 0; i < exceptions.length; i++) {
            try {
                if (exceptions[i].id && exceptions[i].deleted) {
                    dataQuery = [exceptions[i].id];
                    await conectionDB.pool.query(queries.deleteException, dataQuery);

                } else if (!exceptions[i].id) { // registro nuevo
                    dataQuery = [userData.id, exceptions[i].siteId];
                    await conectionDB.pool.query(queries.insertException, dataQuery);

                }
            } catch (err) {
                throw err;
            }
        }
        await conectionDB.pool.query('COMMIT');
    } catch (err) {

        conectionDB.pool.query('ROLLBACK');
        throw err;
    }

    return userData;
}



/**********************************
 *
 ** Borrado  de los datos de usuarios
 ** delete data users
 ** Tablas: user_app, user_customer, category
 *@param user
 
 *
 *?response resul transaction
 ***********************************/

async function deleteUserData(userId) {
    const __functionName = 'deleteUserData';

    let fecha = new Date();

    const dataQuery = [userId, fecha];


    try {

        await conectionDB.pool.query('BEGIN');
        await conectionDB.pool.query(queries.deleteUser, dataQuery);
        await conectionDB.pool.query(queries.deleteCategoryByIdUser, dataQuery);
        await conectionDB.pool.query(queries.deleteUserCustomerIdUser, dataQuery);
        await conectionDB.pool.query(queries.deleteExceptionByIdUser, [userId]);

        await conectionDB.pool.query('COMMIT');
    } catch (err) {
        conectionDB.pool.query('ROLLBACK');
        throw err;
    }

    return userId;
}



/**********************************
 *
 ** crea objeto error si la validacion de parametros lo requiere
 ** create error object if parameter validation requires it
 *
 *@param errorvalidation
 *?response validation result
 */

const paramValidation = (err, req, res, errorCode) => {
    const __functionName = 'paramValidation';

    if (!err.isEmpty()) {
        let error = new Error.createValidationError(err.errors, req, __moduleName, __functionName, errorCode);
        res.status(400).json({
            result: false,
            message: error.userMessage,
        })
        error.alert();
        return false;
    }
    return true;

}
module.exports = {
    getUsers,
    insertUser,
    updateUser,
    deleteUser,
    getUserById,
    getUserByEmail,
    siteExceptionsByUser,
    getExceptionDescriptions
}