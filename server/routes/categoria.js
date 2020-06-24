const express = require('express');
const Categoria = require('../models/categoria');
const _ = require('underscore');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentication');
const app = express();


app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({ estado: true })
        .populate('usuario', 'nombre email')
        .sort('descripcion')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    cantidad: categorias.length,
                    total: conteo,
                    categorias
                });
            });
        })
});


app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id)
        .exec((err, categoria) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    total: conteo,
                    categoria
                });
            });
        })
});


app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {

    let categoriaBody = req.body;

    let categoria = new Categoria({
        descripcion: categoriaBody.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let campos = ['descripcion'];
    let body = _.pick(req.body, campos);

    Categoria.findOneAndUpdate({ _id: id }, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoriaDB
        });

    });
});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let campos = ['estado'];
    let body = _.pick(req.body, campos);
    body.estado = false

    Categoria.findOneAndUpdate({ _id: id }, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            categoriaDB
        });

    });
});


module.exports = app;