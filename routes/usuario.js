let express = require('express');
let bcrypt = require('bcryptjs');

// Inicializar variables
let app = express();

// verificación token
let mdAutenticacion = require('../middlewares/autenticacion');


// Importaciones de Schema
let Usuario = require('../models/usuario');



// ==========================================
// Obtener todos los usuarios
// ==========================================
app.get('/', (req, res, next) => {

    // Conteo para paginación
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role google')
    .skip(desde)
    .limit(5)
    .exec(
        (error, usuarios) => {
            // Errores
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: error
                });

            }
            
            Usuario.count({}, (error, conteo)=> {
                // Errores
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al contar usuarios',
                        errors: error
                    })
                }; 
                return res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total: conteo
                });
            })
        }
    )
});


// ==========================================
// Actualizar usuario
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    let id = req.params.id;

    Usuario.findById(id, 'nombre email img role').exec(
        (error, usuario) => {
            // Errores
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: error
                });
            }
            // Si el usuario no existe
            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `El usuario con el ID ${id} no existe`,
                    errors: { message: 'No existe un usuario con esa ID' }
                });
            }


            let body = req.body;

            usuario.nombre = body.nombre;
            usuario.role = body.role;
            //Fix temporal email único
            if (!usuario.email) usuario.email = body.email;

            console.log('usuario', usuario);
            usuario.save((error, usuarioGuardado) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar usuario',
                        errors: error
                    });
                }
                console.log(usuarioGuardado)
                res.status(200).json({
                    ok: true,
                    usuario: usuarioGuardado
                });

            });

        });

})

// ==========================================
// Crear un nuevo usuario
// ==========================================
app.post('/',(req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((error, usuarioGuardado) => {
        // Errores
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: error
            });
        } else {
            res.status(201).json({
                ok: true,
                usuario: usuarioGuardado,
                usuarioToken: req.usuario
            });
        }
    });

});




// ==========================================
// Borrar usuario
// ==========================================
app.delete('/:id', mdAutenticacion.verificaToken , (req, res) => {

    let id = req.params.id;

    Usuario.findByIdAndRemove(id, 
        (error, usuarioBorrado) => {
            // Errores
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: error
                });
            }
            // Si el usuario no existe
            if (!usuarioBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `No existe el usuario con el ID ${id}`,
                    errors: { message: 'No existe un usuario con esa ID' }
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioBorrado
            });
        })
});




module.exports = app;
