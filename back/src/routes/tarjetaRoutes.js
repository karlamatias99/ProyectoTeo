const express = require('express');
const tarjeta = require('../models/TarjetaModels');

const router = express.Router();

router.post('/registrarTarjeta', tarjeta.IngresoTarjeta);
router.post('/ver-tarjeta', tarjeta.verificarTarjeta);

module.exports = router;