let express = require('express');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

// Inicializar variables
let app = express();


// Importaciones de Schema
let Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, 
        (error, usuarioDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }
        // Verificación usuario email
        if( !usuarioDB ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: error
            });
        }
        // Verificación contraseña
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: error
            });
        }

        // Limpieza contraseña        
        usuarioDB.password =  null;

        // Creación token
        let token = jwt.sign({ usuario: usuarioDB}, '@este-es@un-seed-complicado', { expiresIn: 14400 })

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id
        });
    })

})


module.exports = app;