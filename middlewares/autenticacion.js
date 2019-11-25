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