const conectionDB = require('../modules/database');
const queries = require('../models/queries');
const colors = require('colors/safe');

/**********************************
 *
 ** Catalogo de datos generales de cliente
 *
 ***********************************/
/**
 ** Obtener lista de regiones comerciales de un cliente
 ** Tablas: market_region
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
    /**
     ** Obtener la region comercial pedida por id
     ** Tablas: market_region
     *@Params id
     --------------------------------
     */

const getMarketRegionsById = (req, res) => {

    let id = [req.params.id];

    conectionDB.pool.query(queries.getMarketRegionsById, id)
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

/**
 ** Obtener lista de marcas comerciales de un cliente
 ** Tablas: brand
 *@Params customer_id
 --------------------------------
 */

const getBrandsByIdCustomer = (req, res) => {

        let id = [req.params.customer_id];

        conectionDB.pool.query(queries.getBrandsByIdCustomer, id)
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
    /**
     ** Obtener la marca comercial por id
     ** Tablas: brand
     *@Params id
     --------------------------------
     */

const getBrandById = (req, res) => {

    let id = [req.params];
    conectionDB.pool.query(queries.getBrandById, id)
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
    getMarketRegionsById,
    getBrandsByIdCustomer,
    getBrandById,
}