// Requires 
let express = require('express');
let mongoose = require('mongoose');


// Inicializar variables
let app = express();

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
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    });
});



