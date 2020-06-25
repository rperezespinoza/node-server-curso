const express = require('express');
const fileUpload = require('express-fileupload');
const { verificaToken } = require('../middlewares/autentication');
const app = express();
const path = require('path');
const fs = require('fs');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', verificaToken, (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposValidos = ['usuarios', 'productos'];
    if (tiposValidos.indexOf(tipo) < 0)
        return res.status(406).json({
            ok: false,
            message: `Los tipo válidos son los siguientes: ${tiposValidos.join(', ')}`
        })


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            message: 'No se subieron archivos.'
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    //Extensiones válidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones válidadas son: ${extensionesValidas.join(', ')}`,
                ext: extension
            }
        });
    }

    //Cambiar nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (tipo === 'usuarios')
            guardarUsuario(id, res, nombreArchivo);
        else
            guardarProducto(id, res, nombreArchivo);

    });
});



function guardarUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(usuarioDB.img, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!nombreArchivo) {
            borrarArchivo(usuarioDB.img, 'usuarios');
            return res.status(500).json({
                ok: false,
                message: 'Usuario invalido.'
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioAct) => {

            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                });

            res.json({
                ok: true,
                usuario: usuarioAct,
                message: '¡Archivo subido!'
            });
        })
    })
}


function guardarProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                message: 'Producto invalido.'
            });
        }

        if (productoDB.img)
            borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoAct) => {

            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                });

            res.json({
                ok: true,
                producto: productoAct,
                message: '¡Archivo subido!'
            });
        })
    })
}

function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;