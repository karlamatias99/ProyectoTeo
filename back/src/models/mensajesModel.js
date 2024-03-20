const mysql = require('mysql');
const bcrypt = require('bcrypt');
const db = require('../conection/db');
const createHash = require('crypto');


// Enviar mensaje nuevo
const EnviarMensaje = async (req, res) => {
    const { usuario_emisor, usuario_receptor, mensaje, publicacion_mensaje } = req.body;

    // Obtener la fecha actual del sistema
    const fecha_mensaje = new Date().toISOString(); // Convertir la fecha a formato ISO para almacenarla en la base de datos

    const query = 'INSERT INTO mensajes (usuario_emisor, usuario_receptor, mensaje, fecha_mensaje, publicacion_mensaje) VALUES (?, ?, ?, ?, ?)';
    const values = [usuario_emisor, usuario_receptor, mensaje, fecha_mensaje, publicacion_mensaje];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al enviar mensaje:', err);
            res.status(500).json({ estado: false, respuesta: 'Error al enviar mensaje' }); // Envía un mensaje de error
            return;
        }

        res.status(200).json({ estado: true, respuesta: 'Mensaje enviado exitosamente', id_mensaje: result.insertId });
    });
};

const VerMensaje = (req, res) => {
    const usuario = req.params.usuario;
    const query = 'SELECT * FROM mensajes WHERE usuario_receptor = ?';

    db.query(query, [usuario], (err, results) => {
        if (err) {
            console.error('Error al obtener mensajes:', err);
            res.status(500).json({ error: 'Error al obtener mensajes' });
            return;
        }

        res.status(200).json(result);
    });
};

const obtenerMensajesEnviados = (req, res) => {
    const idUsuario = req.params.idUsuario;
    const idPublicacion = req.params.idPublicacion;
    const sql = 'SELECT * FROM mensajes WHERE usuario_emisor = ? AND publicacion_mensaje = ?';
    db.query(sql, [idUsuario, idPublicacion], (err, resultados) => {
        if (err) {
            console.error('Error al obtener los mensajes enviados:', err);
            res.status(500).json({ mensaje: 'Error del servidor al obtener los mensajes enviados.' });
            return;
        }
        res.json(resultados);
    });
};

const obtenerMensajesReceptor = (req, res) => {
    const idUsuario = req.params.idUsuario;
    const sql = 'SELECT * FROM mensajes WHERE usuario_receptor = ?';
    db.query(sql, [idUsuario], (err, results) => {
        if (err) {
            console.error('Error al obtener mensajes:', err);
            res.status(500).json({ error: 'Error al obtener mensajes' });
            return;
        }
        res.status(200).json(results);
        //console.log(results);
    });
};


const obtenerMensajesRecibidos = (req, res) => {
    const idUsuario = req.params.idUsuario;
    const idDestinatario = req.params.idDestinatario;
    const sql = 'SELECT * FROM mensajes WHERE usuario_receptor = ? AND usuario_emisor = ? AND publicacion_mensaje = ?';
    db.query(sql, [idUsuario, idDestinatario], (err, resultados) => {
        if (err) {
            console.error('Error al obtener los mensajes recibidos:', err);
            res.status(500).json({ mensaje: 'Error del servidor al obtener los mensajes recibidos.' });
            return;
        }
        res.json(resultados);
    });
};


const obtenerMensajesRecibidosPorPublicacion = (req, res) => {
    const idUsuario = req.params.idUsuario;
    const idDestinatario = req.params.idDestinatario;
    const idPublicacion = req.params.idPublicacion;
    const sql = 'SELECT * FROM mensajes WHERE usuario_emisor = ? AND usuario_receptor = ? AND publicacion_mensaje = ?';
    db.query(sql, [idDestinatario, idUsuario, idPublicacion], (err, resultados) => {
        if (err) {
            console.error('Error al obtener los mensajes recibidos:', err);
            res.status(500).json({ mensaje: 'Error del servidor al obtener los mensajes recibidos.' });
            return;
        }
        res.json(resultados);
        //console.log(resultados);
    });
};


const obtenerEmisor = (req, res) => {
    const idPublicacion = req.params.idPublicacion;
    const sql = 'SELECT usuario_emisor FROM mensajes WHERE publicacion_mensaje = ?';
    db.query(sql, [idPublicacion], (err, resultados) => {
        if (err) {
            console.error('Error al obtener el usuario emisor:', err);
            res.status(500).json({ mensaje: 'Error del servidor al obtener el usuario emisor.' });
            return;
        }
        res.json(resultados);
    });
};


module.exports = {
    EnviarMensaje,
    VerMensaje,
    obtenerMensajesEnviados,
    obtenerMensajesRecibidos,
    obtenerMensajesRecibidosPorPublicacion,
    obtenerMensajesReceptor,
    obtenerEmisor
};
