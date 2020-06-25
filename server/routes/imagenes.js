const express = require('express');
const { verificaTokenImagen } = require('../middlewares/autentication');
const app = express();
const path = require('path');
const fs = require('fs');

app.get('/imagen/:tipo/:imagen', verificaTokenImagen, (req, res) => {

    let tipo = req.params.tipo;
    let imagen = req.params.imagen;

    let rutaImage = path.resolve(__dirname, `../../uploads/${tipo}/${imagen}`)
    console.log(rutaImage);
    if (fs.existsSync(rutaImage))
        return res.sendFile(rutaImage);
    else {
        let rutaNoImage = path.resolve(__dirname, `../assets/no-image.jpg`);
        return res.sendFile(rutaNoImage);
    }
});


module.exports = app;