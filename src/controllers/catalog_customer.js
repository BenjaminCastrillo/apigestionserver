const conectionDB = require('../modules/database');
const queries = require('../models/queries');
const colors = require('colors/safe');

/**********************************
 *
 ** Catalogo de datos generales de la aplicación por cliente
 *
 ***********************************/
/**
 ** Obtener lista de regiones comerciales de un cliente
 ** Tablas: country
 *@Params customer_id
 --------------------------------
 */

const getMarketRegionsByIdCustomer = (req, res) => {

    let id = [req.params.customer_id];

    conectionDB.pool.query(queries.getMarketRegionsByIdCustomer, id)
        .then(response => {
            res.status(200).json(response.rows);
        })
        .catch(e => {
            res.status(500).json({
                result: false,
                message: 'Error interno de acceso a datos',
                body: {
                    error: e
                }
            })
            console.log(colors.red(`ERR: ${e}, ${req.method} ${req.headers.host}${req.url}`));

        });
}

module.exports = {
    getMarketRegionsByIdCustomer,
}