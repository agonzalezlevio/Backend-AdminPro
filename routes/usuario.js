let express = require('express');
let bcrypt = require('bcryptjs');

// Inicializar variables
let app = express();


// Importaciones de Schema
let Usuario = require('../models/usuario');



// ==========================================
// Obtener todos los usuarios
// ==========================================
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role').exec(
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
        password: bcrypt.hashSync(body.password, 10),
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
        } else {
            res.status(201).json({
                ok: true,
                usuario: usuarioGuardado
            });
        }
    });

});

// ==========================================
// Actualizar usuario
// ==========================================
app.put('/:id', (req, res) => {
    let id = req.params.id;

    Usuario.findById(id, 'nombre email img role').exec(
        (error, usuario) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: `El usuario con el ID ${id} no existe`,
                errors: { message: 'No existe un usuario con esa ID' }
            });
        }


        let body = req.body;

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role =body.role;

        usuario.save( (error, usuarioGuardado) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: error
                });
            }
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

})



module.exports = app;
