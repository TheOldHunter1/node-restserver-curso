const express = require('express');
const _ = require('underscore');
let { verificaToken } = require('../middlewares/auth');

let app = express();

let Producto = require('../models/producto');
let Categoria = require('../models/categoria');

// ===============
// Obtener productos
// ===============

app.get('/productos', (req, res) => {

    Producto.find({})
        .populate('usuario categoria', 'nombre email descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            res.json({
                ok: true,
                productos
            })

        });
})

// ===============
// Obtener un producto por ID
// ===============

app.get('/productos/:id', (req, res) => {

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario categoria', 'nombre email descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            res.json({
                ok: true,
                productos
            })

        });
});

// ===============
// Buscar productos
// ===============

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('usuario categoria', 'nombre email descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            res.json({
                ok: true,
                productos
            })

        });
})


// ===============
// crear un producto 
// ===============

app.post('/productos', verificaToken, (req, res) => {

    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria', 'usuario']);

    Categoria.find({ 'descripcion': body.categoria })
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            let producto = new Producto({
                nombre: body.nombre,
                precioUni: body.precioUni,
                descripcion: body.descripcion,
                categoria: categoriaDB[0]._id,
                usuario: body.usuario
            });


            producto.save((err, productoDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: err
                    });
                }

                res.json({
                    ok: true,
                    producto: productoDB
                });
            });



        });

});

// ===============
// actualizar un producto 
// ===============

app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['precioUni', 'descripcion']);

    Producto.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }


        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// ===============
// borrar un producto 
// ===============

app.delete('/productos/:id', verificaToken, (req, res) => {
    // cambiar disponible a false
    let id = req.params.id;

    body = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

module.exports = app;