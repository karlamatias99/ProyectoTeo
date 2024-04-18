const express = require('express');
const pedidos = require('../models/PedidosModel');

const router = express.Router();

router.post('/hacerPedido', pedidos.IngresoPedidos);

module.exports = router;