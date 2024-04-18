const express = require('express');
const voluntariado = require('../models/VoluntariadoModel');

const router = express.Router();

router.post('/registrarVoluntario', voluntariado.IngresoVoluntariado);


module.exports = router;