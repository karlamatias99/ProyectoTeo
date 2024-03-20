const express = require('express');
const mensaje = require('../models/mensajesModel');

const router = express.Router();

router.post('/enviar-mensaje', mensaje.EnviarMensaje);
router.get('/mensajes/:usuario' , mensaje.VerMensaje);
// Obtener mensajes enviados por un usuario
router.get('/enviados/:idUsuario/:idPublicacion', mensaje.obtenerMensajesEnviados);

// Obtener mensajes recibidos por un usuario de un destinatario específico
router.get('/recibidos/:idUsuario/:idDestinatario', mensaje.obtenerMensajesRecibidos);
router.get('/receptor/:idUsuario', mensaje.obtenerMensajesReceptor);
router.get('/mensajes/:idUsuario/:idDestinatario/:idPublicacion', mensaje.obtenerMensajesRecibidosPorPublicacion);

// Ruta para obtener el usuario emisor por publicación
router.get('/emisor/:idPublicacion', mensaje.obtenerEmisor);


module.exports = router;