const  express = require('express');
const path = require('path');
const fs = require('fs')

// Inicializar variables
let app = express();



app.get('/:tipo/:img', (req, res, next) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }else{
        let pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }

});


module.exports = app;
