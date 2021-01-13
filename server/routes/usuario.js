const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/auth');

const app = express();

// Obtener usuarios
app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    opt = {
        google: 'false'
    }

    Usuario.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo,
                    process: process.env.urlDB
                })

            });

        })

});

// crear usuario
app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        // usuarioDB.password = null;


        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });

});

// modificar usuario
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'role', 'estado']);

    delete body.password;
    delete body.google;

    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});

// borrar usuario
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    // Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
    // if (err) {
    // return res.status(400).json({
    // ok: false,
    // mensaje: err
    // });
    // }

    // if (!usuarioBorrado) {
    // return res.status(400).json({
    // ok: false,
    // err: {
    // message: 'Usuario no encontrado'
    // }
    // });
    // }

    // res.json({
    // ok: true,
    // usuario: usuarioBorrado
    // });
    // });


    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

module.exports = app;