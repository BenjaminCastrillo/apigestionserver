'use strict'
const __moduleName = 'app';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const colors = require('colors/safe');
require('dotenv').config(); // leemos fichero .dev para determinar entorno del sistema
const config = require('./src/modules/config');
const { myAuthorizer } = require('./src/modules/middlwares');
// var errors = require('./src/modules/errors');
const basicAuth = require('express-basic-auth');

// ejecutamos express
const app = express();

// configuracion

config.loadConfiguration(process.env.APP_ENVIRONMENT);

const port = config.port; // puerto del servidor express

// conexion a bbdd
// TENGO QUE VER COMO CONECTAR A LA BASE DE DATOS UNA VEZ

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));
// app.use(errors.parseError);

// Gestionamos los errores ( pasados como next(err) )
// app.use(errors.errorHandler);


// Pendiente la autenticacion de las llamadas

// rutas

app.use(require('./src/routes/routes'))

//CORS


// creacion del servidor

app.listen(port, () => {
    console.log('Servidor funcionado correctamente en localhost:' + port);

});