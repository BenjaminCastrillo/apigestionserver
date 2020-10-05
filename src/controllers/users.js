const conectionDB = require('../modules/database');
const queries = require('../models/queries');
const colors = require('colors/safe');



/************************************
 *
 ** Gestion de datos de usuarios 
 ** Tablas: user_app
 *
 ***********************************/

/**
 ** Obtener usuarios de la tabla user_app
 
 --------------------------------
 */
const getUsers = (req, res) => {

    conectionDB.pool.query(queries.getUsers)
        .then(response => {
            res.status(200).json(response.rows);
        })
        .catch(e => {
            res.status(500).json({
                result: false,
                message: 'error interno de acceso a datos',
                body: {
                    error: e
                }
            });
            console.log(colors.red(`ERR: ${e}, ${req.method} ${req.headers.host}${req.url}`));

        });
}

/**
 ** Alta de usuarios en la tabla user_app
 
 --------------------------------
 */
const insertUser = (req, res) => {

    const fecha = new Date();
    const dataQuery = [req.body.id, req.body.id_customer, req.body.name, req.body.surname, req.body.id_languaje, fecha];
    conectionDB.pool.query(queries.insertUserApp, dataQuery)
        .then(() => {
            res.status(200).json({
                result: true,
                message: 'usuario añadido correctamente',
                body: {
                    user: {
                        dataQuery: dataQuery,
                    }
                }
            });
        })
        .catch(e => {
            res.status(200).json({
                result: false,
                message: 'Usuario no grabado',
                body: {
                    error: e
                }
            });
            console.log(colors.red(`ERR: ${e}, ${req.method} ${req.headers.host}${req.url}`));
        });
    return;
};


module.exports = {
    getUsers,
    insertUser,

}