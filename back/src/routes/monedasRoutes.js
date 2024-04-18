const express = require('express');
const moneda = require('../models/monedasModel');

const router = express.Router();

router.post('/comprarMonedas', moneda.IngresoMonedas);
router.get('/monedasSistema/:usuario', moneda.MostrarMonedas);
router.post('/actualizar-monedas', moneda.ActualizarMonedas);



module.exports = router;