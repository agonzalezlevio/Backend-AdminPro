let express = require('express');

// Inicializar variables
let app = express();

let Hospital = require('../models/hospital');
let Medico = require('../models/medico');
let Usuario = require('../models/usuario');


// ==========================================
// Búsqueda por colección
// ==========================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    let busqueda = req.params.busqueda;
    let tabla = req.params.tabla;
    let regex = new RegExp(busqueda, 'i');
    let promesa;

    switch (tabla) {
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
        break;
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
        break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
        break;
        default:
            return res.status(400).json({
                    ok: false,
                    mensaje: 'Los tipos de búsqueda sólo son: usuarios, medicos y hospitales',
                    error : { message: 'Tipo de tabla/colección no válido'}
            });
    }

    promesa.then(respuesta => {
        res.status(200).json({
            ok: true,
            [tabla] : respuesta
        })
    })

})


// ==========================================
// Búsqueda General
// ==========================================
app.get('/todo/:busqueda', (req, res, next) => {


    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda, regex), 
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
        ])
        .then( respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            })
        });

});



// Búsqueda de hospitales - nombre
function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) =>
        Hospital.find({ nombre: regex })
        .populate('usuario', 'nombre email role')
        .exec(
         (error, hospitales) => {
            if(error) {
                reject('Error al cargar Hospitales', error);
            }else{
                resolve(hospitales)
            }
        })
    )
}


// Búsqueda de médicos - nombre
function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) =>
        Medico.find({ nombre: regex })
        .populate('usuario', 'nombre email role')
        .populate('hospital')
        .exec( 
            (error, medicos) => {
            if(error) {
                reject('Error al cargar medicos', error);
            }else{
                resolve(medicos)
            }
        })
    )
}

// Búsqueda de usuarios - nombre - email
function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) =>
        Usuario.find({}, 'nombre email role')
            .or([{ nombre: regex }, { email : regex}])
            .exec((error, usuarios) => {
                if(error) {
                    reject('Error al cargar usuarios', error);
                }else{
                    resolve(usuarios)
                }
            })
    )
}



module.exports = app;
