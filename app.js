// Requires 
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser')


// Inicializar variables
let app = express();

// Body Parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())




// Importar rutas
let appRoutes = require('./routes/app');
let usuarioRoutes = require('./routes/usuario');

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, response) => {
    if( error ) throw error;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'Online');
});


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'Online');
});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);


