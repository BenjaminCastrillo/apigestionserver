const { param, validationResult } = require('express-validator');

const verificaParams = (req, res, next) => {

    param('languaje_id').isInt();

    let id = [req.params.languaje_id];


    const error = validationResult(req);
    console.log(err);

    next();

}
module.exports = {

    verificaParams
}