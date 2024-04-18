const mysql = require('mysql');
const db = require('../conection/db');

//Ingresar Publicacion
const IngresoPublicacion = async (req, res) => {
    try {
        console.log('Datos recibidos en req.body:', req.body); // Registrar los datos recibidos del frontend

        const { titulo_publicacion, descripcion, precio_local, precio_sistema, tipo_publicacion, imagen, usuario_publicacion, fecha_inicio, fecha_fin, remuneracion } = req.body;
        let estado = "Pendiente"; // Estado por defecto

        // Obtener la fecha actual del sistema
        const fecha_publicacion = new Date().toISOString(); // Convertir la fecha a formato ISO para almacenarla en la base de datos

        // Validar si el tipo de publicación es "voluntariado"
        if (tipo_publicacion === "Voluntariado") {
            // Si es un voluntariado, verificar que se haya ingresado la fecha de inicio y de fin
            const { fecha_inicio, fecha_fin, remuneracion } = req.body;
            if (!fecha_inicio || !fecha_fin) {
                return res.status(400).json({ estado: false, respuesta: 'Para un voluntariado, debe especificar la fecha de inicio y de fin' });
            }
        } else {
            // Si no es un voluntariado, verificar que se haya ingresado un precio válido
            if (!precio_local || !precio_sistema) {
                return res.status(400).json({ estado: false, respuesta: 'Para una venta, debe especificar el precio local y el precio del sistema' });
            }
        }

        // Consulta para contar cuántas publicaciones ha realizado el usuario
        const countQuery = 'SELECT COUNT(*) AS total FROM publicacion WHERE usuario_publicacion = ?';
        db.query(countQuery, [usuario_publicacion], async (err, result) => {
            if (err) {
                console.error('Error al contar publicaciones del usuario:', err);
                return res.status(500).json({ estado: false, respuesta: 'Error al verificar cantidad de publicaciones' });
            }

            const totalPublicaciones = result[0].total;

            // Si el usuario ha realizado menos de 5 publicaciones, el estado será "Pendiente"
            if (totalPublicaciones < 5) {
                estado = "Pendiente";
            } else {
                estado = "Aprobado";
            }

            let query;
            let values;

            if (tipo_publicacion === "Voluntariado") {
                query = 'INSERT INTO publicacion (titulo_publicacion, descripcion, fecha_publicacion, tipo_publicacion, imagen, estado, usuario_publicacion, fecha_inicio, fecha_fin, remuneracion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                values = [titulo_publicacion, descripcion, fecha_publicacion, tipo_publicacion, imagen, estado, usuario_publicacion, fecha_inicio, fecha_fin, remuneracion];
            } else {
                query = 'INSERT INTO publicacion (titulo_publicacion, descripcion, precio_local, precio_sistema, fecha_publicacion, tipo_publicacion, imagen, estado, usuario_publicacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                values = [titulo_publicacion, descripcion, precio_local, precio_sistema, fecha_publicacion, tipo_publicacion, imagen, estado, usuario_publicacion];
            }

            // Insertar la publicación con el estado correspondiente
            db.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error al ingresar publicación:', err);
                    return res.status(500).json({ estado: false, respuesta: 'Error al ingresar publicación' });
                }

                console.log('Publicación ingresada correctamente:', result);
                return res.status(200).json({ estado: true, respuesta: 'Publicación ingresada exitosamente', id_publicacion: result.insertId });
            });
        });
    } catch (error) {
        console.error('Error en la función IngresoPublicacion:', error);
        return res.status(500).json({ estado: false, respuesta: 'Error en el servi dor al procesar la solicitud' });
    }
};







const IngresoPublicacionCompra = async (req, res) => {
    const { titulo, descripcion, tipo_publicacion, imagen, usuario_publicacion } = req.body;

    db.query([usuario_publicacion], async (err, result) => {
        // Obtener la fecha actual del sistema
        const fecha_publicacion = new Date().toISOString(); // Convertir la fecha a formato ISO para almacenarla en la base de datos

        const query = 'INSERT INTO publicacion_compra (titulo, descripcion, fecha_publicacion, tipo_publicacion, imagen, usuario_publicacion) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [titulo, descripcion, fecha_publicacion, tipo_publicacion, imagen, usuario_publicacion];

        // Insertar la publicación con el estado correspondiente
        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error al ingresar publicación:', err);
                res.status(500).json({ estado: false, respuesta: 'Error al ingresar publicación' });
                return;
            }

            res.status(200).json({ estado: true, respuesta: 'Publicación ingresada exitosamente', id_publicacion: result.insertId });
        });
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


const MostrarPublicacionesCompras = (req, res) => {
    const query = 'SELECT * FROM publicacion_compra';

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener publicacion:', err);
            res.status(500).json({ error: 'Error al obtener publicacion' });
            return;
        }

        res.status(200).json(result);
    });
};

const buscarPublicacion = async (req, res) => {
    const nombreProducto = req.params.titulo_publicacion;
    try {

        db.query(
            'SELECT * FROM publicacion WHERE titulo_publicacion LIKE ?',
            [`%${nombreProducto}%`],
            (error, results) => {
                if (error) {
                    console.error(error.message);
                    res.status(500).send('Error en el servidor');
                } else {
                    res.json(results);
                }
            }
        );
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
    IngresoPublicacion,
    EditarPublicacion,
    MostrarPublicaciones,
    buscarPublicacion,
    MostrarPublicacioneAprobadas,
    obtenerPublicacionesPorUsuario,
    obtenerIDPublicacion,
    MostrarPublicacionesCompras,
    IngresoPublicacionCompra
};