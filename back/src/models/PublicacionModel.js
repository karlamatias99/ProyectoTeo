const mysql = require('mysql');
const db = require('../conection/db');

//Ingresar Publicacion
const IngresoPubicacion = async (req, res) => {
    const { titulo_publicacion, descripcion, precio_local, precio_sistema, tipo_publicacion, imagen, usuario_publicacion } = req.body;
    const estado = "Pendiente";
    // Obtener la fecha actual del sistema
    const fecha_publicacion = new Date().toISOString(); // Convertir la fecha a formato ISO para almacenarla en la base de datos
    //const usuario_publicacion = "3";

    const query = 'INSERT INTO publicacion (titulo_publicacion, descripcion, precio_local, precio_sistema, fecha_publicacion, tipo_publicacion, imagen, estado, usuario_publicacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [titulo_publicacion, descripcion, precio_local, precio_sistema, fecha_publicacion, tipo_publicacion, imagen, estado, usuario_publicacion];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al ingresar publicacion:', err);
            res.status(500).json({ estado: false, respuesta: 'Error al ingresar publicacion' }); // Envía un mensaje de error
            return;
        }

        res.status(200).json({ estado: true, respuesta: 'Publicacion ingresada exitosamente', id_publicacion: result.insertId });
    });
};


const MostrarPublicaciones = (req, res) => {
    const query = 'SELECT * FROM publicacion';

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener publicacion:', err);
            res.status(500).json({ error: 'Error al obtener publicacion' });
            return;
        }

        res.status(200).json(result);
    });
};

const buscarPubicacion = async (req, res) => {
    const nombreProducto = req.query.titulo_publicacion;

    try {
        const productos = await pool.query(
            'SELECT * FROM publicacion WHERE titulo_publicacion LIKE ?', [`%${nombreProducto}%`]
        );
        res.json(productos);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
};

const EditarPublicacion = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    const query = 'UPDATE publicacion SET estado = ? WHERE id_publicacion = ?';

    const values = [estado, id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al editar publicacion:', err);
            return res.status(500).json({ error: 'Error interno del servidor al editar publicacion' });
        }

        if (result.affectedRows === 0) {
            // Si no se actualizó ningún registro, significa que el usuario no existe
            return res.status(404).json({ error: 'Publicacion no encontrado' });
        }

        return res.status(200).json({ message: 'Publicacion editado exitosamente' });
    });
};


const MostrarPublicacioneAprobadas = (req, res) => {
    const query = "SELECT * FROM publicacion WHERE estado = 'Aprobado'";

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener publicacion:', err);
            res.status(500).json({ error: 'Error al obtener publicacion' });
            return;
        }

        res.status(200).json(result);
    });
};


const obtenerPublicacionesPorUsuario = (req, res) => {
    const usuario = req.params.usuario;
    const query = 'SELECT * FROM publicacion WHERE usuario_publicacion = ?';

    db.query(query, [usuario], (err, results) => {
        if (err) {
            console.error('Error al obtener publicacion:', err);
            res.status(500).json({ error: 'Error al obtener publicaciones' });
            return;
        }

        res.status(200).json(results); 
        console.log(results);
    });
};

const obtenerIDPublicacion = (req, res) => {
    const usuarioReceptor = req.params.usuario_receptor;
    const sql = 'SELECT publicacion_mensaje FROM mensajes WHERE usuario_receptor = ?';
    db.query(sql, [usuarioReceptor], (err, results) => {
        if (err) {
            console.error('Error al obtener el ID de la publicación:', err);
            res.status(500).json({ error: 'Error al obtener el ID de la publicación' });
        } else {
            const idPublicacion = results.length > 0 ? results[0].publicacion_mensaje : null;
            res.status(200).json(idPublicacion);
            console.log(idPublicacion);
        }
    });
};






module.exports = {
    IngresoPubicacion,
    EditarPublicacion,
    MostrarPublicaciones,
    buscarPubicacion,
    MostrarPublicacioneAprobadas,
    obtenerPublicacionesPorUsuario,
    obtenerIDPublicacion
};