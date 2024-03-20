const mysql = require('mysql');
const db = require('../conection/db');

const addCarrito = async (req, res) => {
    const productos = req.body;

    try {
        // Verificar si se envió un arreglo de productos
        if (!Array.isArray(productos)) {
            return res.status(400).json({ mensaje: "Se debe enviar un arreglo de productos" });
        }

        // Verificar si el arreglo de productos está vacío
        if (productos.length === 0) {
            return res.status(400).json({ mensaje: "El arreglo de productos está vacío" });
        }

        // Itera sobre la lista de productos y los agrega al carrito
        for (let i = 0; i < productos.length; i++) {
            const { titulo, imagen, precio, cantidad } = productos[i];

            // Verifica si el producto ya está en el carrito (por ejemplo, por su título)
            const query = 'SELECT * FROM carrito WHERE publicacion = ?';
            const result = await db.query(query, [titulo]);

            if (result.length > 0) {
                // Si el producto ya está en el carrito, actualiza la cantidad
                const updateQuery = 'UPDATE carrito SET cantidad = cantidad + ? WHERE publicacion = ?';
                await db.query(updateQuery, [cantidad, titulo]);
            } else {
                // Si el producto no está en el carrito, lo inserta
                const insertQuery = 'INSERT INTO carrito (publicacion, imagen, precio, cantidad) VALUES (?, ?, ?, ?)';
                await db.query(insertQuery, [titulo, imagen, precio, cantidad]);
            }
        }

        res.json({
            mensaje: "Productos agregados al carrito",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al agregar productos al carrito" });
    }
};

const deleteCarrito = async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar el producto en el carrito
        const query = 'SELECT * FROM carrito WHERE id_carrito = ?';
        const carritoProducto = await db.query(query, [id]);

        // Verificar si se encontró el producto en el carrito
        if (carritoProducto.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado en el carrito" });
        }

        // Obtener los detalles del producto
        const productoNombre = carritoProducto[0]?.id;

        // Verificar si el producto tiene una publicación asociada
        if (!id) {
            return res.status(404).json({ mensaje: "No se encontró la publicación asociada al producto en el carrito" });
        }
        
        // Eliminar el producto del carrito
        const deleteQuery = 'DELETE FROM carrito WHERE id_carrito = ?';
        await db.query(deleteQuery, [id]);

        // Actualizar el estado del producto en la tabla de productos
        const updateQuery = 'UPDATE publicacion_compra SET en_carrito = false WHERE titulo_publicacion = ?';
        await db.query(updateQuery, [titulo]);

        res.json({ mensaje: `El producto ${titulo} fue eliminado del carrito` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Ops! Ocurrió un error al eliminar el producto del carrito" });
    }
};





module.exports = {
    addCarrito,
    deleteCarrito
};


