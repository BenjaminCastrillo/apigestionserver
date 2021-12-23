'use strict'
const __moduleName = 'app';

const express = require('express');
// const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const colors = require('colors/safe');
require('dotenv').config(); // leemos fichero .dev para determinar entorno del sistema
const config = require('./src/modules/config');
const { myAuthorizer, errorMiddleware } = require('./src/modules/middlwares');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// const errors = require('./src/modules/errors');
const basicAuth = require('express-basic-auth');
// const errorMiddleware = require('./src/modules/middlwares')


// ejecutamos express
const app = express();

app.use(cors());

// configuracion

config.loadConfiguration(process.env.APP_ENVIRONMENT);

const port = config.port; // puerto del servidor express

// const jwtKey = config.authentication_key; // creo que esto no es necesario aqui

// conexion a bbdd
// TENGO QUE VER COMO CONECTAR A LA BASE DE DATOS UNA VEZ

// middlewares
app.use(express.json({ limit: '50 mb' }));

app.use(express.urlencoded({
    limit: '50 mb',
    extend: true
}));

app.use(morgan('dev'));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));


// app.use(errors.parseError);

// Gestionamos los errores ( pasados como next(err) )
// app.use(errors.errorHandler);


// Autenticacion de las llamadas ES NECESARIO ?????????

// app.set('key', jwtKey);

// rutas

app.use(require('./src/routes/routes'))


// app.use(errorMiddleware)



//CORS


// creacion del servidor

app.listen(port, () => {
    console.log('Servidor funcionado correctamente en localhost:' + port);

});