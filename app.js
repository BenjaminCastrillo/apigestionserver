'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const colors = require('colors/safe');
const expressValidator = require('express-validator');



// ejecutamos express
const app = express();

// configuracion
const port = 3700; // puerto del servidor express

// conexion a bbdd
// TENGO QUE VER COMO CONECTAR A LA BASE DE DATOS UNA VEZ

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(expressValidator);

// rutas

app.use(require('./src/routes/routes'))

//CORS


// creacion del servidor

app.listen(port, () => {
    console.log('Servidor funcionado correctamente en localhost:' + port);

});


// exportar el module