const bcryptjs = require('bcryptjs');
const queries = require('../models/queries');
const config = require('../modules/config');
const jwt = require('jsonwebtoken');
const conectionDB = require('../modules/database');
const Error = require('../modules/errors/index');

const __moduleName = 'src/controllers/login';
let accesoPermitido = true;



const validUser = async(req, res) => {
    const __functionName = 'validUser';
    let error;
    const fecha = new Date();
    const key = config.authentication_key;
    const user = req.body.user;
    const appOrigin = req.body.app;
    let numIntentos;
    console.log('lo que recibo', req.body)
    let param = [user];
    console.log(user);

    conectionDB.pool.query(queries.getUserEmail, param)
        .then((response) => {


            if (response.rowCount === 1) {
                const passwordOk = bcryptjs.compareSync(req.body.password, response.rows[0].password)

                numIntentos = response.rows[0].wrong_attemps;

                if (passwordOk && !response.rows[0].blocked) {
                    if (appOrigin == 1 || (appOrigin == 0 && response.rows[0].admin)) {
                        console.log('todo correcto');
                        numIntentos = 0;
                        ''
                        // creamos token 
                        // actualizamos fecha de entrada

                        const usuario = {
                            id: response.rows[0].id,
                            name: response.rows[0].name,
                            surname: response.rows[0].surname,
                            email: response.rows[0].email,
                        }

                        const token = jwt.sign(usuario, key, { expiresIn: '5m' })
                            //   res.header('authorization', token).json({
                        console.log('token:', token);
                        res.json({
                            result: true,
                            data: usuario,
                            token: token
                        });

                    } else {
                        console.log('usuario no autorizado a la aplicacion de admin');
                        numIntentos++;
                        res.status(401).json({
                            result: false,
                            data: 'usuario no autorizado'
                        });
                    }
                } else {
                    console.log('usuario incorrecto o bloqueado');
                    // incrementar contador
                    numIntentos++;
                    res.status(401).json({
                        result: false,
                        data: 'Usuario no autorizado'
                    });
                }
                param = [response.rows[0].id, fecha, numIntentos > 3 ? true : false, numIntentos];
                console.log('los parametros del update', param);


                conectionDB.pool.query(queries.updateUserAccess, param)


            } else if (response.rowCount === 0) {
                res.status(401).json({
                    result: false,
                    data: 'Usuario no autorizado a'
                });

            } else {
                res.status(500).json({ // error interno existe mas de un usuario con el mismo email
                    result: false,
                    data: 'Error interno del servidor *x'
                });
            }
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



module.exports = {
    validUser,

}