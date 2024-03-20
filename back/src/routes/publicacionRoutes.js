const express = require('express');
const publicacion = require('../models/PublicacionModel');

const router = express.Router();

router.post('/crearPublicacion', publicacion.IngresoPubicacion);
router.put('/editarPublicacion', publicacion.EditarPublicacion);
router.get('/mostrarPublicacion', publicacion.MostrarPublicaciones);
router.get('/mostrarPublicacion/:usuario', publicacion.obtenerPublicacionesPorUsuario);
router.get('/PublicacionesAprobadas', publicacion.MostrarPublicacioneAprobadas);
router.put('/editarPublicacion/:id', publicacion.EditarPublicacion);
router.get('/publicacion/:usuario_receptor', publicacion.obtenerIDPublicacion);


module.exports = router;