const express = require('express');
const mysql = require('mysql');
const cron = require('node-cron');
const usuarioRoutes = require('./routes/usuarioRoutes');
const publicacionRoutes = require('./routes/publicacionRoutes');
const carritoRoutes = require('./routes/carritoRoutes');
const mensajesRoutes = require('./routes/mensajesRoutes');
const voluntarioRoutes =  require('./routes/voluntariadoRoutes');
const tarjetaRoutes =  require('./routes/tarjetaRoutes');
const monedasRoutes =  require('./routes/monedasRoutes');
const pedidosRoutes = require('./routes/PedidosRoutes');
const realizarPagosRemuneracion = require('./models/realizarPagosRemuneracion');

//Requires respecto a configuraciones del servidor
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');

const app = express();
const corsOptions = {
    origin: ['http://localhost', 'http://localhost:4200'],
    credentials: true,         
    optionSuccessStatus: 200,
}

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
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


app.get('/api/u', (req, res) => {
  
    res.status(200).json({ message: 'Inicio de sesión exitoso' });
});

// Ejecutar realizarPagosRemuneracion todos los días a las 00:00
//cron.schedule('* * * * *', async () -> para hacerlo cada minuto
cron.schedule('0 0 * * *', async () => {
    try {
        await realizarPagosRemuneracion();
        console.log('Pagos de remuneración realizados exitosamente');
    } catch (error) {
        console.error('Error al realizar pagos de remuneración:', error);
    }
});

// Importar y usar las rutas de usuarios
app.use('/usuario', usuarioRoutes);
app.use('/publicacion', publicacionRoutes);
app.use('/api', carritoRoutes);
app.use('/mensajes', mensajesRoutes);
app.use('/voluntario', voluntarioRoutes);
app.use('/tarjeta', tarjetaRoutes);
app.use('/monedas', monedasRoutes);
app.use('/pedidos', pedidosRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

