const bcryptjs = require('bcryptjs');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const queries = require('../models/queries');
const config = require('../modules/config');
const conectionDB = require('../modules/database');
const Error = require('../modules/errors/index');

const __moduleName = 'src/controllers/login';



const validUser = async(req, res) => {
    const __functionName = 'validUser';
    let error;
    let ahora;
    const fecha = new Date();
    const key = config.authentication_key;
    const user = req.body.user;
    const appOrigin = req.body.app;
    let numIntentos;
    let param = [user];


    conectionDB.pool.query(queries.getUserEmail, param)
        .then((response) => {
            if (response.rowCount === 1) {
                const passwordOk = bcryptjs.compareSync(req.body.password, response.rows[0].password)
                    //  const passwordOk = true
                numIntentos = response.rows[0].wrong_attemps;

                if (passwordOk && !response.rows[0].blocked) {
                    if (appOrigin == 1 || (appOrigin == 0 && response.rows[0].admin)) {
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
                        ahora = moment().format('DD-MM-YYYY hh:mm:ss');
                        console.log(`${ahora}--- Usuario ${usuario.email} conectado app ${appOrigin}`);
                        const token = jwt.sign(usuario, key, { expiresIn: '60m' })
                            //   res.header('authorization', token).json({

                        res.json({
                            result: true,
                            data: usuario,
                            token: token
                        });

                    } else {
                        error = new Error.createFuncError('usersNotAuthorized', user, __moduleName, __functionName);
                        numIntentos++;
                        res.status(401).json({
                            result: false,
                            data: error.userMessage
                        });
                        error.alert();
                    }
                } else {
                    error = new Error.createFuncError(passwordOk ? 'userNotActive' : 'badCredentials', user, __moduleName, __functionName);
                    // incrementar contador
                    numIntentos++;
                    res.status(401).json({
                        result: false,
                        data: error.userMessage
                    });
                    error.alert();
                }

                // actualizamos datos del acceso
                param = [response.rows[0].id, fecha, numIntentos > 3 ? true : false, numIntentos];
                conectionDB.pool.query(queries.updateUserAccess, param);


            } else if (response.rowCount === 0) { // usuario no existe
                error = new Error.createFuncError('userNoExists', user, __moduleName, __functionName);
                res.status(401).json({
                    result: false,
                    data: error.userMessage
                });
                error.alert();
            } else { // error interno existe mas de un usuario con el mismo email
                error = new Error.createFuncError('twoUsersSameEmail', user, __moduleName, __functionName);
                res.status(500).json({
                    result: false,
                    message: error.userMessage
                });
                error.alert();
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


const validToken = async(req, res) => {
    const __functionName = 'validToken';

    const accessToken = req.headers['authorization'];
    const userId = req.params.user_id;
    const key = config.authentication_key;
    let param = [userId];
    let error;


    if (!accessToken) {
        error = new Error.createFuncError('tokenNoExists', userId, __moduleName, __functionName);
        res.status(401).json({
            result: false,
            data: error.userMessage
        });
        error.alert();
    } else {
        jwt.verify(accessToken, key, (err) => {

            if (err) {
                error = new Error.createFuncError('invalidAccessToken', userId, __moduleName, __functionName);
                res.status(401).json({
                    result: false,
                    data: error.userMessage
                });
                error.alert();
            } else {

                conectionDB.pool.query(queries.getUserById, param)
                    .then((response) => {

                        if (response.rowCount === 1) {
                            const usuario = {
                                id: response.rows[0].id,
                                name: response.rows[0].name,
                                surname: response.rows[0].surname,
                                email: response.rows[0].email,
                            }
                            const token = jwt.sign(usuario, key, { expiresIn: '60m' })

                            res.status(200).json({
                                result: true,
                                data: 'Token valido',
                                token: token
                            });
                        } else {
                            error = new Error.createFuncError('userNoExists', userId, __moduleName, __functionName);
                            res.status(401).json({
                                result: false,
                                data: error.userMessage
                            });
                            error.alert();
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



            }
        });
    }

    return
}

module.exports = {
    validUser,
    validToken
}