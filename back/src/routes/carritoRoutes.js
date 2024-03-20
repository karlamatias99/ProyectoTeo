const express = require('express');
const CarritoModel = require('../models/CarritoModel');

const carrito = express.Router();

carrito.post('/addCarrito', CarritoModel.addCarrito);
carrito.delete('/eliminarCarrito/:id', CarritoModel.deleteCarrito);



module.exports = carrito;

