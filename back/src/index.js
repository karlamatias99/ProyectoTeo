const express = require('express');
const mysql = require('mysql');
const usuarioRoutes = require('./routes/usuarioRoutes');
const publicacionRoutes = require('./routes/publicacionRoutes');
const carritoRoutes = require('./routes/carritoRoutes');
const mensajesRoutes = require('./routes/mensajesRoutes');

//Requires respecto a configuraciones del servidor
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');

const app = express();
const corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
app.use(express.json());

//lectura de json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//cors
app.use(cors(corsOptions));

// Crear el pool de conexiones a la base de datos MySQL
const db = mysql.createPool({
    connectionLimit: 10, // Establecer el límite máximo de conexiones simultáneas
    host: 'localhost',
    user: 'root',
    password: 'UY2saqbm6xe00OQa',
    database: 'sistema_comercio'
});

// Definir la ruta para la autenticación de usuarios
app.get('/api/u', (req, res) => {
    // Aquí puedes incluir la lógica para autenticar al usuario
    // Utilizando los datos proporcionados en el cuerpo de la solicitud (req.body)
    
    // Por ejemplo, aquí simplemente devolvemos un mensaje de éxito
    res.status(200).json({ message: 'Inicio de sesión exitoso' });
});

// Importar y usar las rutas de usuarios
app.use('/usuario', usuarioRoutes);
app.use('/publicacion', publicacionRoutes);
app.use('/api', carritoRoutes);
app.use('/mensajes', mensajesRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

