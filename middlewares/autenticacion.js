let jwt = require('jsonwebtoken');

// Seed token
const SEED = require('../config/config').SEED;


// ==========================================
// Verificar  token
// ==========================================
exports.verificaToken = function(req, res, next) {

    let token = req.query.token;

    jwt.verify(token, SEED, (error, decoded) => {
        if (error) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token invalido',
                errors: error
            });

        }

        req.usuario = decoded.usuario;


        // Continuar con el resto de solicitudes
        next();
        
    });

}

// ==========================================
// Verificar  administrador
// ==========================================
exports.verificaAdmin = function(req, res, next) {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        // Continuar con el resto de solicitudes
        next();
        return;
    }else {
        return res.status(401).json({
            ok: false,
            mensaje: 'No tiene autorización',
            errors: { message: 'No tiene permisos'}
        });
    }


}


// ==========================================
// Verificar  administrador o mismo usuario
// ==========================================
exports.verificaAdminUsuario = function(req, res, next) {

    let usuario = req.usuario;
    let id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        // Continuar con el resto de solicitudes
        next();
        return;
    }else {
        return res.status(401).json({
            ok: false,
            mensaje: 'No tiene autorización',
            errors: { message: 'No tiene permisos de usuario/administrador'}
        });
    }


}
