const mysql = require('mysql');
const bcrypt = require('bcrypt');
const db = require('../conection/db');
const createHash = require('crypto');


// Registrar nuevo usuario
const IngresoUsuario = async (req, res) => {
    const { nombre_usuario, correo, password, rol } = req.body;
    const estado = "Pendiente";
    const hashedPassword = await bcrypt.hash(password, 10); // Hashear la contraseña antes de almacenarla en la base de datos

    const query = 'INSERT INTO usuario (nombre_usuario, correo, password, rol, estado) VALUES (?, ?, ?, ?, ?)';
    const values = [nombre_usuario, correo, hashedPassword, rol, estado];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al registrar usuario:', err);
            res.status(500).json({ estado: false, respuesta: 'Error al ingresar usuario' }); // Envía un mensaje de error
            return;
        }

        res.status(200).json({ estado: true, respuesta: 'Usuario creado exitosamente', id_usuario: result.insertId });
    });
};

// Traer datos de un usuario por su ID
/*const TraerDatos = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM usuario WHERE id_usuario = ?';

    db.query(query, id, (err, result) => {
        if (err) {
            console.error('Error al buscar usuario por ID:', err);
            res.status(500).json({ error: 'Error al buscar usuario por ID' });
            return;
        }

        if (result.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        res.status(200).json(result[0]);
    });
};*/

// Eliminar registro de un usuario
/*const EliminarUsuario = (req, res) => {
    const idUsuario = req.params.id;
    const query = 'DELETE FROM usuario WHERE id_usuario = ?';

    db.query(query, idUsuario, (err, result) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            res.status(500).json({ error: 'Error al eliminar usuario' });
            return;
        }

        res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    });
};*/

// Editar registro de un usuario
const EditarUsuario = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    const query = 'UPDATE usuario SET estado = ? WHERE correo = ?';

    const values = [estado, id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al editar usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor al editar usuario' });
        }

        if (result.affectedRows === 0) {
            // Si no se actualizó ningún registro, significa que el usuario no existe
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.status(200).json({ message: 'Usuario editado exitosamente' });
    });
};





// Login de usuario
const LoginUsuario = (req, res) => {
    const correo = req.body.correo;
    const password = req.body.password;

    // Verificar si los parámetros son nulos
    if (!correo || !password) {
        res.status(400).json({
            respuesta: 'Correo y contraseña son obligatorios.',
            estado: false
        });
        return;
    }

    // Consulta SQL para buscar el usuario en la base de datos
    const query = `SELECT * FROM usuario WHERE correo = ?`;

    // Ejecutar la consulta SQL
    db.query(query, [correo], async (err, results) => {
        //console.log('Resultado de la consulta SQL:', results);
        if (err) {
            console.error('Error al ejecutar la consulta SQL:', err);
            res.status(500).json({
                respuesta: 'Error del servidor al autenticar al usuario.',
                estado: false
            });
            return;
        }

        // Verificar si se encontró un usuario
        if (results.length > 0) {
            const usuario = results[0];
            //console.log(usuario.estado);
            if (usuario.estado === 'Pendiente' || usuario.estado === 'Rechazado') {
                //console.log("No puede ingrsar");
                res.status(403).json({
                    respuesta: 'No tiene permiso para iniciar sesión. Su cuenta está pendiente o bloqueada.',
                    estado: false

                });
                return;
            }

            try {
                const match = await bcrypt.compare(password, usuario.password);
                if (match) {
                    res.status(200).json({
                        respuesta: usuario,
                        estado: true
                    });
                } else {
                    //console.log("Credenciales incorrectas");
                    res.status(401).json({
                        respuesta: 'Credenciales incorrectas.',
                        estado: false
                    });
                }
            } catch (error) {
                console.error('Error al comparar contraseñas:', error);
                res.status(500).json({
                    respuesta: 'Error del servidor al autenticar al usuario.',
                    estado: false
                });
            }
        } else {
            // Si no se encontró ningún usuario, enviar respuesta de credenciales incorrectas
            res.status(401).json({
                respuesta: 'Credenciales incorrectas.',
                estado: false
            });
        }
    });
};





// Mostrar todos los usuarios
const MostrarUsuarios = (req, res) => {
    const query = 'SELECT * FROM Usuario';

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            res.status(500).json({ error: 'Error al obtener usuarios' });
            return;
        }

        res.status(200).json(result);
    });
};

//Ver Usuarios con rol vendedor y comprador para poder aprobar o rechazar 
const User = (req, res) => {
    const query = "SELECT * FROM usuario WHERE rol = 'Vendedor' OR rol = 'Comprador'";

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            res.status(500).json({ error: 'Error al obtener usuarios' });
            return;
        }

        res.status(200).json(result);
    });
};

const obtenerSaldo = (req, res) => {
    const usuario = req.params.usuario;
    const query = 'SELECT monedas FROM usuario WHERE nombre_usuario = ?';

    db.query(query, [usuario], (err, results) => {
        if (err) {
            console.error('Error al obtener monedas:', err);
            res.status(500).json({ error: 'Error al obtener monedas' });
            return;
        }

        res.status(200).json(results);
        console.log(results);
    });
};


const EditarSaldo = async (req, res) => {
    const { correo, monedas } = req.params; // Utiliza req.params para obtener los valores de los parámetros

    const query = 'UPDATE usuario SET monedas = ? WHERE correo = ?';

    const values = [monedas, correo];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al editar usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor al editar usuario' });
        }

        if (result.affectedRows === 0) {
            // Si no se actualizó ningún registro, significa que el usuario no existe
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.status(200).json({ message: 'Usuario editado exitosamente' });
    });
};


module.exports = {
    IngresoUsuario,
    LoginUsuario,
    MostrarUsuarios,
    User,
    EditarUsuario,
    obtenerSaldo,
    EditarSaldo
};
