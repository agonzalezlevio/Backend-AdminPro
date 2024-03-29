// Requires 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')


// Inicializar variables
let app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods','POST, GET, PUT, DELETE, OPTIONS')
    next();
  });

// Body Parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())




// Importar rutas
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const medicoRoutes = require('./routes/medico');
const hospitalRoutes = require('./routes/hospital');
const loginRoutes = require('./routes/login');
const busquedaRoutes = require('./routes/busqueda');
const uploadRoutes = require('./routes/upload');
const imagenesRoutes = require('./routes/imagenes');

// Conexión a la base de datos
const URI = 'mongodb://localhost:27017/hospitalDB';

mongoose.connect(URI, 
    { 
        useNewUrlParser: true , 
        useUnifiedTopology: true, 
        useCreateIndex: true
    })
        .then((response) => {
            console.log('Base de datos: \x1b[32m%s\x1b[0m', 'Online');
        })
        .catch((error) => { if (error) throw error });


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'Online');
});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/medico', medicoRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/login', loginRoutes);


app.use('/', appRoutes);


