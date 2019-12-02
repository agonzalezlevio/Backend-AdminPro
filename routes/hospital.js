const express = require('express');

// Inicializar variables
let app = express();

// Verificación token
let mdAutenticacion = require('../middlewares/autenticacion');


// Importaciones de Schema
let Hospital = require('../models/hospital');


// ==========================================
// Obtener todos los Hospitales
// ==========================================
app.get('/', (req, res, next) => {

    // Conteo para paginación
    let desde = req.query.desde || 0;
    desde = Number(desde);


    Hospital.find({}, 'nombre usuario img')
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre img email')
    .exec(
        (error, hospitales) => {

            // Errores
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: error
                });

            } 
            Hospital.count({}, (error, conteo)=> {
                // Errores
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al contar hospitales',
                        errors: error
                    })
                }; 
                return res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: conteo
                });
            });
        }
    )
});



// ==========================================
// Obtener Hospital por id
// ==========================================
app.get('/:id', (req, res) => {

    let id = req.params.id;

    Hospital.findById(id)
        .populate('usuario', 'nombre img email')
        .exec(
        (error, hospital) => {
            // Errores
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: error
                });
            }
            // Si el hospital no existe
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `El hospital con el ID ${id} no existe`,
                    errors: { message: 'No existe un hospital con esa ID' }
                });
            }

            // Si existe retorna el hospital
            res.status(200).json({
                    ok: true,
                    hospital: hospital
            });

        });

})





// ==========================================
// Actualizar Hospital
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;

    Hospital.findById(id, 'nombre usuario')
        .exec(
        (error, hospital) => {
            // Errores
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: error
                });
            }
            // Si el hospital no existe
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `El hospital con el ID ${id} no existe`,
                    errors: { message: 'No existe un hospital con esa ID' }
                });
            }

            // Actualización del Hospital
            let body = req.body;

            hospital.nombre = body.nombre;
            hospital.usuario = req.usuario._id;

            hospital.save((error, hospitalGuardado) => {

                if (error) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar hospital',
                        errors: error
                    });
                }
                res.status(200).json({
                    ok: true,
                    hospital: hospitalGuardado
                });

            });

        });

})

// ==========================================
// Crear un nuevo Hospital
// ==========================================
app.post('/', mdAutenticacion.verificaToken ,(req, res) => {

    let body = req.body;

    let hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });


    hospital.save((error, hospitalGuardado) => {

        // Errores
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Hospital',
                errors: error
            });
        } else {
            res.status(201).json({
                ok: true,
                hospital: hospitalGuardado
            });
        }
    });

});




// ==========================================
// Borrar Hospital
// ==========================================
app.delete('/:id', mdAutenticacion.verificaToken , (req, res) => {

    let id = req.params.id;

    Hospital.findByIdAndRemove(id, 
        (error, hospitalBorrado) => {
            // Errores
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar Hospital',
                    errors: error
                });
            }
            // Si el Hospital no existe
            if (!hospitalBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `No existe el Hospital con el ID ${id}`,
                    errors: { message: 'No existe un Hospital con esa ID' }
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalBorrado
            });
        })
});




module.exports = app;
