const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');


// Inicializar variables
let app = express();

// Opciones por defecto
app.use(fileUpload());

// Modelos
let Hospital = require('../models/hospital');
let Medico = require('../models/medico');
let Usuario = require('../models/usuario');


app.put('/:tipo/:id', (req, res) => {


    let tipo = req.params.tipo; // usuarios, medicos, hospitales
    let id = req.params.id;
   
    // Tipos de colecciones 
    let tiposValidos = ['usuarios', 'medicos', 'hospitales'];
    if(tiposValidos.indexOf(tipo) <0 ){
        res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es válida',
            errors: { message : 'Los tipos validos son: '+ tiposValidos.join(', ')}
        });
    }



    if (!req.files) {
        res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message : 'Debe seleccionar una imagen'}
        });
    }

    // Obtener nombre del archivo
    let archivo = req.files.imagen
    // Nombre recortado en caso de que existan más puntos (.) en el nombre
    let nombreRecortado = archivo.name.split('.')
    let extensionArchivo = nombreRecortado[nombreRecortado.length -1]

    // Extensiones permitidas
    let extensionesValidas = ['gif', 'png', 'jpg', 'jpeg'];

    if(extensionesValidas.indexOf(extensionArchivo) < 0){
        res.status(400).json({
            ok: false,
            mensaje: 'Extension de imagen no válida',
            errors: { message : 'Las extensiones validas son: '+ extensionesValidas.join(', ')}
        });
    }

    // Nombre de archivo personalizado 
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo del temporal a un Path
    let path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, error => {
        if ( error ){
        res.status(500).json({
            ok: false,
            mensaje: 'Error al mover el archivo',
            errors: error
        });
        }

        subirPorTipo(tipo, id , nombreArchivo, res);

        
    })
});

function subirPorTipo(tipo, id , nombreArchivo, res) {
    switch (tipo) {
        case 'usuarios':
            subirImagenUsuario(id, nombreArchivo, res);
        break;
        case 'medicos':
            subirImagenMedico(id , nombreArchivo, res);
        break;
        case 'hospitales':
            subirImagenHospital(id , nombreArchivo, res);
        break;
        default:
        break;    
    }
}


function subirImagenUsuario(id , nombreArchivo, res) {
    Usuario.findById(id, 'nombre email img role').exec( 
        (error, usuarioDB) => {
        // Errores
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }
        // Si el usuario no existe
        if (!usuarioDB) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Usuario no existente',
                errors: { message: 'El usuario no existe' }
            });
        }

        // Ruta imagen antigua
        let pathViejo = `./uploads/usuarios/${usuarioDB.img}`;

        //Si existe, elimina la imagen anterior
        if (fs.existsSync(pathViejo)) {
        fs.unlinkSync(pathViejo);
        }

        // Se le asigna la nueva ruta de la imagen
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((error, usuarioActualizado) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La imagen no se pudo actualizar',
                    errors: error
                });
            }
            return  res.status(200).json({
                ok: true,
                mensaje: 'Imagen de usuario actualizada',
                usuario: usuarioActualizado
            });
        })
    })
}

function subirImagenMedico(id , nombreArchivo, res) {
    Medico.findById(id, 'nombre img ').exec( 
        (error, medicoDB) => {
        // Errores
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: error
            });
        }
        // Si el medico no existe
        if (!medicoDB) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Medico no existente',
                errors: { message: 'El medico no existe' }
            });
        }

        // Ruta imagen antigua
        const pathViejo = `./uploads/medicos/${medicoDB.img}`;

        //Si existe, elimina la imagen anterior
        if (fs.existsSync(pathViejo)) {
        fs.unlinkSync(pathViejo);
        }

        // Se le asigna la nueva ruta de la imagen
        medicoDB.img = nombreArchivo;

        medicoDB.save((error, medicoActualizado) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La imagen no se pudo actualizar',
                    errors: error
                });
            }
            return  res.status(200).json({
                ok: true,
                mensaje: 'Imagen de medico actualizada',
                medico: medicoActualizado
            });
        })
    })
}

function subirImagenHospital(id , nombreArchivo, res) {
    Hospital.findById(id, 'nombre img ').exec( 
        (error, hospitalDB) => {
        // Errores
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: error
            });
        }
        // Si el hospital no existe
        if (!hospitalDB) {
            return res.status(400).json({
                ok: true,
                mensaje: 'Hospital no existente',
                errors: { message: 'El hospital no existe' }
            });
        }

        // Ruta imagen antigua
        const pathViejo = `./uploads/hospitales/${hospitalDB.img}`;

        //Si existe, elimina la imagen anterior
        if (fs.existsSync(pathViejo)) {
        fs.unlinkSync(pathViejo);
        }

        // Se le asigna la nueva ruta de la imagen
        hospitalDB.img = nombreArchivo;

        hospitalDB.save((error, hospitalActualizado) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'La imagen no se pudo actualizar',
                    errors: error
                });
            }
            return  res.status(200).json({
                ok: true,
                mensaje: 'Imagen de hospital actualizada',
                hospital: hospitalActualizado
            });
        })
    })
}

module.exports = app;
