let express = require('express');

// Inicializar variables
let app = express();


// Importaciones de Schema
let Usuario = require('../models/usuario');



// ==========================================
// Obtener todos los usuarios
// ==========================================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role' ).exec(
        (error, usuarios) => {
            if (error) {

                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: error
                });

            } else {

                return res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });

            }
        }
    )
});


// ==========================================
// Crear un nuevo usuario
// ==========================================
app.post('/', (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role
    });

    usuario.save((error, usuarioGuardado) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: error
            });
        }else {
            res.status(201).json({
                ok: true,
                usuario: usuarioGuardado
            });
        }
    });
    
});


module.exports = app;
