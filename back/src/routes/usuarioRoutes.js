const express = require('express');
const usuario = require('../models/UsuarioModel');

const router = express.Router();

router.post('/crearUsuario', usuario.IngresoUsuario);
router.post('/ingreso', usuario.LoginUsuario);
router.get('/mostrar', usuario.MostrarUsuarios);
router.get('/getUser', usuario.User);
router.put('/editarUsuario/:id', usuario.EditarUsuario);
router.put('/editarMonedas/:correo/:monedas', usuario.EditarSaldo);
router.get('/mostrarMonedas/:correo', usuario.obtenerSaldo);
//router.get('/usuario/:id', usuario.TraerDatos);
//router.delete('/eliminar/:id', usuario.EliminarUsuario);

module.exports = router;