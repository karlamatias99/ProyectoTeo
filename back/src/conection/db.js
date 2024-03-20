const mysql = require('mysql');

// Crear la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'UY2saqbm6xe00OQa',
    database: 'sistema_comercio'
});

// Conectar a la base de datos MySQL
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos MySQL:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

module.exports = db;
