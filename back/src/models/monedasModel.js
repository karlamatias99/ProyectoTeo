const mysql = require('mysql');
const db = require('../conection/db');


// Registrar nuevo usuario
const IngresoMonedas = async (req, res) => {
    const { usuario_monedas, cantidad_moneda, tarjeta } = req.body;

    // Insertar la nueva transacción en la tabla moneda_sistema
    const queryInsert = 'INSERT INTO moneda_sistema (usuario_monedas, cantidad_moneda, tarjeta ) VALUES (?, ?, ?)';
    const valuesInsert = [usuario_monedas, cantidad_moneda, tarjeta];

    db.query(queryInsert, valuesInsert, async (err, result) => {
        if (err) {
            console.error('Error al comprar monedas:', err);
            res.status(500).json({ estado: false, respuesta: 'Error al comprar monedas' });
            return;
        }

        // Obtener la cantidad actual de monedas del usuario
        const querySelect = 'SELECT monedas FROM usuario WHERE correo = ?';
        const valuesSelect = [usuario_monedas];

        db.query(querySelect, valuesSelect, async (err, rows) => {
            if (err) {
                console.error('Error al obtener monedas del usuario:', err);
                res.status(500).json({ estado: false, respuesta: 'Error al obtener monedas del usuario' });
                return;
            }

            // Sumar la cantidad recién agregada a la cantidad actual de monedas del usuario
            const monedasActuales = rows[0].monedas; // Suponiendo que la consulta devuelve solo un resultado
            const nuevaCantidad = monedasActuales + cantidad_moneda;

            // Actualizar el atributo monedas en la tabla de usuarios
            const queryUpdate = 'UPDATE usuario SET monedas = ? WHERE correo = ?';
            const valuesUpdate = [nuevaCantidad, usuario_monedas];

            db.query(queryUpdate, valuesUpdate, async (err, result) => {
                if (err) {
                    console.error('Error al actualizar monedas del usuario:', err);
                    res.status(500).json({ estado: false, respuesta: 'Error al actualizar monedas del usuario' });
                    return;
                }

                // Envía una respuesta de éxito al cliente
                res.status(200).json({ estado: true, respuesta: 'Monedas compradas con éxito!' });
            });
        });
    });
};



const MostrarMonedas = (req, res) => {
    const usuario = req.params.usuario;

    const query = `SELECT SUM(monedas) AS cantidad_total_monedas
    FROM usuario
    WHERE correo = ?;
    `;

    db.query(query, [usuario], (err, result) => {
        if (err) {
            console.error('Error al obtener la cantidad de monedas:', err);
            res.status(500).json({ error: 'Error al obtener la cantidad de monedas' });
            return;
        }

        res.status(200).json(result);
        console.log(result);
    });
};

const ActualizarMonedas = async (req, res) => {
    const { usuario_monedas, cantidad_moneda } = req.body;

    // Consulta SQL para actualizar la cantidad de monedas en la tabla moneda_sistema
    const queryMonedaSistema = 'UPDATE moneda_sistema SET cantidad_moneda = cantidad_moneda + ? WHERE usuario_monedas = ?';
    const valuesMonedaSistema = [cantidad_moneda, usuario_monedas];

    db.query(queryMonedaSistema, valuesMonedaSistema, (err, result) => {
        if (err) {
            console.error('Error al actualizar la cantidad de monedas en moneda_sistema:', err);
            res.status(500).json({ estado: false, respuesta: 'Error al actualizar la cantidad de monedas en moneda_sistema' });
            return;
        }

        // Consulta SQL para actualizar la cantidad de monedas en la tabla usuario
        const queryUsuario = 'UPDATE usuario SET monedas = monedas + ? WHERE correo = ?';
        const valuesUsuario = [cantidad_moneda, usuario_monedas];

        db.query(queryUsuario, valuesUsuario, (err, result) => {
            if (err) {
                console.error('Error al actualizar la cantidad de monedas en usuario:', err);
                res.status(500).json({ estado: false, respuesta: 'Error al actualizar la cantidad de monedas en usuario' });
                return;
            }

            res.status(200).json({ estado: true, respuesta: 'Cantidad de monedas del usuario actualizada en ambas tablas con éxito' });
        });
    });
};




module.exports = {
    IngresoMonedas,
    MostrarMonedas,
    ActualizarMonedas

};