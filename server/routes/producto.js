const express = require('express');
const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/autentication');
const _ = require('underscore');
const app = express();

app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let cantidad = req.query.limite || 10;
    cantidad = Number(cantidad);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(cantidad)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                return res.json({
                    ok: true,
                    cantidad: productos.length,
                    total: conteo,
                    productos
                });
            })
        });

});


app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                producto
            });
        })
});

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                return res.json({
                    ok: true,
                    cantidad: productos.length,
                    total: conteo,
                    productos
                });
            })

        })

})

app.post('/producto', verificaToken, (req, res) => {

    let productoBody = req.body;

    let producto = new Producto({
        nombre: productoBody.nombre,
        precioUni: productoBody.precioUni,
        descripcion: productoBody.descripcion,
        categoria: productoBody.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        })
    })

});

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let productoBody = req.body;

    let producto = _.pick(productoBody, ['nombre', 'precioUni', 'descripcion', 'categoria']);
    /* let producto = new Producto({
         nombre: productoBody.nombre,
         precioUni: productoBody.precioUni,
         descripcion: productoBody.descripcion,
         categoria: productoBody.categoria,
     });*/

    Producto.findOneAndUpdate({ _id: id }, producto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(401).json({
                ok: false,
                message: 'Producto no encontrado'
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });
    });
})

app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Producto.findOneAndUpdate({ _id: id }, { disponible: false }, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(401).json({
                ok: false,
                message: 'Producto no encontrado'
            });
        }

        return res.json({
            ok: true,
            producto: productoDB
        });
    });
})

module.exports = app;