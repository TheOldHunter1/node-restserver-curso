const express = require('express');
const _ = require('underscore');
let { verificaToken, verificaAdminRole } = require('../middlewares/auth');

let app = express();

let Categoria = require('../models/categoria');

//==============================
// Mostrar todas las categorias
//==============================
app.get('/categoria', (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            res.json({
                ok: true,
                categorias
            })

        });
});

//==============================
// Mostrar una categorias por ID
//==============================
app.get('/categoria/:id', (req, res) => {
    // Categoria.findById();
    let id = req.params.id;


    Categoria.findById(id)
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            res.json({
                ok: true,
                categoria
            })

        })
});

//==============================
// crear una categorias
//==============================
app.post('/categoria', verificaToken, verificaAdminRole, (req, res) => {
    // req.usuario._id
    let body = req.body;
    console.log(req.body);
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: body.UserID
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        // usuarioDB.password = null;


        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });
});

//==============================
// actualizar una categorias por ID
//==============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['descripcion']);

    console.log(body);

    Categoria.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }


        res.json({
            ok: true,
            Categoria: categoriaDB
        });
    });
});

//==============================
// delete una categorias por ID
//==============================
app.delete('/categoria/:id', verificaToken, (req, res) => {
    // req.usuario._id
    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});

module.exports = app;