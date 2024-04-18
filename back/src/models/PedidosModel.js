const mysql = require('mysql');
const db = require('../conection/db');


const IngresoPedidos = async (req, res) => {
    const { monto_sistema, usuario_comprador, direccion, telefono} = req.body;

     // Obtener la fecha actual del sistema
     const fecha_pedido = new Date().toISOString(); 

    const query = 'INSERT INTO pedido ( fecha_pedido, monto_sistema, usuario_comprador, direccion, telefono ) VALUES (?, ?, ?, ?, ?)';
    const values = [fecha_pedido, monto_sistema, usuario_comprador, direccion, telefono];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al realizar pedido:', err);
            res.status(500).json({ estado: false, respuesta: 'Error al realizar pedido' }); // Envía un mensaje de error
            return;
        }

        res.status(200).json({ estado: true, respuesta: 'Pedido hecho con exito!' });
        //console.log(res);
    });
};

module.exports = {
    IngresoPedidos

};