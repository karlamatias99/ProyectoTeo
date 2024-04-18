const mysql = require('mysql');
const db = require('../conection/db');


// Registrar nuevo usuario
const IngresoTarjeta = async (req, res) => {
    const { num_tarjeta, nombre_usuario, vencimiento, cvv, usuario } = req.body;

    // Verificar si la tarjeta ya existe en la base de datos
    const queryVerificar = 'SELECT * FROM tarjeta WHERE num_tarjeta = ?';
    db.query(queryVerificar, [num_tarjeta], (err, result) => {
        if (err) {
            console.error('Error al verificar tarjeta:', err);
            res.status(500).json({ estado: false, respuesta: 'Error al verificar tarjeta' });
            return;
        }

        // Si la tarjeta ya existe, responder con un mensaje de error
        if (result.length > 0) {
            res.status(400).json({ estado: false, respuesta: 'La tarjeta ya existe en la base de datos.' });
            return;
        }

        // Si la tarjeta no existe, insertarla en la base de datos
        const queryInsertar = 'INSERT INTO tarjeta (num_tarjeta, nombre_usuario, vencimiento, cvv, usuario) VALUES (?, ?, ?, ?, ?)';
        const values = [num_tarjeta, nombre_usuario, vencimiento, cvv, usuario];

        db.query(queryInsertar, values, (err, result) => {
            if (err) {
                console.error('Error al registrar tarjeta:', err);
                res.status(500).json({ estado: false, respuesta: 'Error al ingresar tarjeta' });
                return;
            }

            res.status(200).json({ estado: true, respuesta: 'Tarjeta guardada exitosamente', num_tarjeta });
        });
    });
};




// Verificar si una tarjeta existe en la base de datos
const verificarTarjeta = (req, res) => {
    const { num_tarjeta } = req.body;
    const query = 'SELECT * FROM tarjeta WHERE num_tarjeta = ?';
    db.query(query, [num_tarjeta], (err, result) => {
        if (err) {
            console.error('Error al verificar tarjeta:', err);
            return res.status(500).json({ estado: false, respuesta: 'Error al verificar tarjeta' });
        }

        if (result.length > 0) {
            return res.status(200).json({ estado: true, respuesta: 'La tarjeta existe en la base de datos' });
        } else {
            return res.status(404).json({ estado: false, respuesta: 'La tarjeta no existe en la base de datos' });
        }
    });
};


module.exports = {
    IngresoTarjeta,
    verificarTarjeta

};