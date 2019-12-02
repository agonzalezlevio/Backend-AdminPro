const express = require('express');

// Inicializar variables
let app = express();

// Verificación token
let mdAutenticacion = require('../middlewares/autenticacion');


// Importaciones de Schema
let Medico = require('../models/medico');


// ==========================================
// Obtener todos los Médicos
// ==========================================
app.get('/', (req, res, next) => {

    // Conteo para paginación
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({}, 'nombre img usuario hospital')
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (error, medicos) => {

                // Errores
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: error
                    });

                }

                Medico.count({}, (error, conteo) => {
                    // Errores
                    if (error) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al contar médicos',
                            errors: error
                        })
                    };
                    return res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });

                });

            }
        )
});


// ==========================================
// Obtener Médico por ID
// ==========================================
app.get('/:id', (req, res) => {

    let id = req.params.id;

    Medico.findById(id, 'nombre img usuario hospital')
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec(
        (error, medico) => {
            // Errores
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: error
                });
            }
            // Si el medico no existe
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `El medico con el ID ${id} no existe`,
                    errors: { message: 'No existe un medico con esa ID' }
                });
            }

            res.status(200).json({
                ok: true,
                medico: medico
            });

        });


})




// ==========================================
// Actualizar Médicos
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;

    Medico.findById(id, 'nombre usuario hospital').exec(
        (error, medico) => {
            // Errores
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: error
                });
            }
            // Si el medico no existe
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `El medico con el ID ${id} no existe`,
                    errors: { message: 'No existe un medico con esa ID' }
                });
            }

            // Actualizar médicos
            let body = req.body;

            medico.nombre = body.nombre;
            medico.usuario = req.usuario._id;
            medico.hospital = body.hospital;

            medico.save((error, medicoGuardado) => {

                if (error) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar medico',
                        errors: error
                    });
                }
                res.status(200).json({
                    ok: true,
                    medico: medicoGuardado
                });

            });

        });

})

// ==========================================
// Crear un nuevo Medico
// ==========================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });


    medico.save((error, medicoGuardado) => {


        // Errores
        if (error) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Medico',
                errors: error
            });
        } else {
            res.status(201).json({
                ok: true,
                medico: medicoGuardado,
                medicoToken: req.medico
            });
        }
    });

});




// ==========================================
// Borrar Médico
// ==========================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;

    Medico.findByIdAndRemove(id,
        (error, medicoBorrado) => {
            // Errores
            if (error) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar Medico',
                    errors: error
                });
            }
            // Si el Medico no existe
            if (!medicoBorrado) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `No existe el Medico con el ID ${id}`,
                    errors: { message: 'No existe un Medico con esa ID' }
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoBorrado
            });
        })
});




module.exports = app;
