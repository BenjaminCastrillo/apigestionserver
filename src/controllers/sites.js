const conectionDB = require('../modules/database');

const valid = require('../modules/validation');
const queries = require('../models/queries');
const colors = require('colors/safe');
const { validationresult } = require('express-validator');

/**********************************
 *
 ** Gestion de datos de emplazamientos 
 ** Tablas: place, site
 *
 ***********************************/

/**
 ** Obtener lista de sites (con sus places) de un usuario
 
 *@Params id user
 --------------------------------
 */

const getSitesByUser = (req, res) => {



    /* if (!valid.valorNumerico(req.params.user_id)) {
        return res.status(203).json({
            result: false,
            message: 'tipo de dato en parametro incorrecto',
            body: ''
        });
    }
*/
    let valerr = req.validationErrors(true);

    console.log(valerr);
    let id = [req.params.user_id];

    conectionDB.pool.query(queries.getSitesByUser, id)
        .then((response) => {
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

module.exports = {

    getSitesByUser
}