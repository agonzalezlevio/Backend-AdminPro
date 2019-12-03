const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// Inicializar variables
const app = express();
// Seed token
const SEED = require('../config/config').SEED;

// Importaciones de Schema
const Usuario = require('../models/usuario');

// Google
const CLIENT_ID = require('../config/config').CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);


// Middleware
const mdAutenticacion = require('../middlewares/autenticacion');


// ==========================================
// Renovación Token
// ==========================================
app.get('/renuevatoken', mdAutenticacion.verificaToken, (req, res) => {

    var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 }); // 4 horas
    
    return res.status(200).json({
        ok: true,
        usuario: req.usuario,
        token: token
    });

})

// ==========================================
// Autenticación de Google 
// ==========================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async (req, res) => {

    let token = req.body.token;

    let googleUser = await verify(token).catch(error => {
        return res.status(403).json({
            ok: true,
            mensaje: 'Token no válido',
        });
    });

    Usuario.findOne({ email: googleUser.email }, (error, usuarioDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }
        // Verificación usuario
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe de usar su autenticación normal'
                });
            } else {
                // Creación token
                let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 })

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                    menu: obtenerMenu(usuarioDB.role)
                });
            }
        } else {
            //El usuario no existe, se debe crear
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = 'null';

            usuario.save((error, usuarioDB) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al crear usuario',
                        errors: error
                    });
                }
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                    menu: obtenerMenu(usuarioDB.role)
                });

            });

        }
    })

})


// ==========================================
// Autenticación normal
// ==========================================
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
            if (!usuarioDB) {
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
            usuarioDB.password = null;

            // Creación token
            let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 })

            res.status(200).json({
                ok: true,
                usuario: usuarioDB,
                token: token,
                id: usuarioDB.id,
                menu: obtenerMenu(usuarioDB.role)
            });
        })

})


function obtenerMenu(role) {
    let  menu = [
        {
          titulo: 'Principal',
          icono: 'mdi mdi-gauge',
          submenu: [
            {
              titulo: 'Dashboard',
              url: '/dashboard'
            },
            {
              titulo: 'Progress Bar',
              url: '/progress'
            },
            {
              titulo: 'Gráficas',
              url: '/graficas1'
            },
            {
              titulo: 'Promesas',
              url: '/promesas'
            },
            {
              titulo: 'RxJs',
              url: '/rxjs'
            }
          ]
        },{
          titulo: 'Mantenimiento',
          icono: 'mdi mdi-folder-lock-open',
          submenu: [
            // {
            //   titulo: 'Usuarios',
            //   url: '/usuarios'
            // },
            {
              titulo: 'Médicos',
              url: '/medicos'
            },
            {
              titulo: 'Hospitales',
              url: '/hospitales'
            }
          ]
        }
    
      ];

      if (role === 'ADMIN_ROLE') {
          menu[1].submenu.unshift(
              { titulo: 'Usuarios',url: '/usuarios'}
              );
      }

      return menu;
}


module.exports = app;