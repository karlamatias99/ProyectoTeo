const mysql = require('mysql');
const db = require('../conection/db');

//Ingresar Voluntariado
const IngresoVoluntariado = async (req, res) => {
    const { nombre_voluntario, apellido_voluntario, edad_voluntario, genero, fecha_nacimiento, telefono, correo_electronico,
        usuario_publicador, monto_devolver, publicacion_voluntariado, fecha_inicio, fecha_fin } = req.body;

    const query = 'INSERT INTO voluntariado (nombre_voluntario, apellido_voluntario, edad_voluntario, genero, fecha_nacimiento, telefono, correo_electronico, usuario_publicador, monto_devolver, publicacion_voluntariado, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [nombre_voluntario, apellido_voluntario, edad_voluntario, genero, fecha_nacimiento, telefono, correo_electronico, usuario_publicador, monto_devolver, publicacion_voluntariado, fecha_inicio, fecha_fin];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al registrar voluntario:', err);
            res.status(500).json({ estado: false, respuesta: 'Error al ingresar voluntario' }); // Envía un mensaje de error
            return;
        }

        res.status(200).json({ estado: true, respuesta: 'Voluntario registrado exitosamente' });
    });
};

const realizarPagosRemuneracion = async () => {
    try {
        // Buscar voluntariados que han finalizado y están pendientes de remuneración
        const query = `
            SELECT correo_electronico, monto_devolver
            FROM voluntariado
            WHERE fecha_fin < NOW()
        `;
        const voluntariadosPendientes = await new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });

        // Realizar el pago de remuneración para cada voluntariado finalizado
        voluntariadosPendientes.forEach(async (voluntariado) => {
            const { correo_electronico, monto_devolver } = voluntariado;

            // Actualizar el campo monedas del usuario en la tabla usuario
            const updateMonedasQuery = 'UPDATE usuario SET monedas = monedas + ? WHERE correo_electronico = ?';
            await new Promise((resolve, reject) => {
                db.query(updateMonedasQuery, [monto_devolver, correo_electronico], (err, result) => {
                    if (err) reject(err);
                    resolve();
                });
            });

            // Una vez que se actualiza el monto en la tabla usuario, puedes eliminar el voluntariado
            await new Promise((resolve, reject) => {
                const deleteQuery = 'DELETE FROM voluntariado WHERE correo_electronico = ?';
                db.query(deleteQuery, [correo_electronico], (err, result) => {
                    if (err) reject(err);
                    resolve();
                });
            });
        });

        console.log('Pagos de remuneración realizados exitosamente');
    } catch (error) {
        console.error('Error al realizar pagos de remuneración:', error);
    }
};



module.exports = {
    IngresoVoluntariado,
    realizarPagosRemuneracion
}
