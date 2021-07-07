const { body, validationResult } = require('express-validator');
const validator = require('validator');
const conectionDB = require('../modules/database');
const queries = require('../models/queries');
const Error = require('../modules/errors/index');

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
        let error;

        conectionDB.pool.query(queries.getUsers)
            .then(response => {
                res.status(200).json({
                    result: true,
                    data: response.rows
                });
            })
            .catch(err => {
                error = new Error.createPgError(err, __moduleName, __functionName);
                res.status(500).json({
                    result: false,
                    message: error.userMessage
                });
                error.alert();

            });
    }
    /**
        ** Obtener usuario por id
        ** Get users by id
        
        --------------------------------
        */
const getUserById = (req, res) => {
    const __functionName = 'getUserById';
    const err = validationResult(req); // result of param evaluation 
    if (!paramValidation(err, req, res)) return
    let error;
    const param = [req.params.id];
    conectionDB.pool.query(queries.getUserById, param)
        .then(response => {
            res.status(200).json({
                result: true,
                data: response.rows
            });
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();

        });
}


/**
 ** Alta de usuarios en la tabla user_app
 ** User registration in the user_app table
 
 --------------------------------
 */
const insertUser = (req, res) => {
    const __functionName = 'insertUser';
    let error;
    const fecha = new Date();
    console.log(req.body);
    const dataQuery = [req.body.id, req.body.id_customer, req.body.name, req.body.surname, req.body.id_languaje, fecha];
    conectionDB.pool.query(queries.insertUserApp, dataQuery)
        .then(() => {
            res.status(200).json({
                result: true,
                data: dataQuery
            });
        })
        .catch(err => {
            error = new Error.createPgError(err, __moduleName, __functionName);
            res.status(500).json({
                result: false,
                message: error.userMessage
            });
            error.alert();
        });
    return;
}


/**********************************
 *
 ** crea objeto error si la validacion de parametros lo requiere
 ** create error object if parameter validation requires it
 *
 *@param errorvalidation
 *?response validation result
 */

const paramValidation = (err, req, res) => {
    const __functionName = 'paramValidation';
    if (!err.isEmpty()) {
        let error = new Error.createValidationError(err, req, __moduleName, __functionName);
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
    getUserById
}