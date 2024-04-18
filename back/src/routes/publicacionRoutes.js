const express = require('express');
const publicacion = require('../models/PublicacionModel');

const router = express.Router();

router.post('/crearPublicacion', publicacion.IngresoPublicacion);
router.post('/crearPublicacionCompra', publicacion.IngresoPublicacionCompra);
router.put('/editarPublicacion', publicacion.EditarPublicacion);
router.get('/mostrarPublicacion', publicacion.MostrarPublicaciones);
router.get('/mostrarPublicacionCompras', publicacion.MostrarPublicacionesCompras);
router.get('/mostrarPublicacion/:usuario', publicacion.obtenerPublicacionesPorUsuario);
router.get('/PublicacionesAprobadas', publicacion.MostrarPublicacioneAprobadas);
router.put('/editarPublicacion/:id', publicacion.EditarPublicacion);
router.get('/publicacion/:usuario_receptor', publicacion.obtenerIDPublicacion);
router.get('/buscar/:titulo_publicacion', publicacion.buscarPublicacion);


module.exports = router;