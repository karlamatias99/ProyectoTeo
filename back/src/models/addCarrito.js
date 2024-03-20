const db = require('../conection/db'); // Importa la conexión a la base de datos MySQL

// Agrega un publicacion al carrito
const addProductoCarrito = async (req, res) => {
    const { titulo_publicacion, imagen, precio } = req.body;

    try {
        // Busca la publicacion en la base de datos
        const [publicacion] = await db.query('SELECT * FROM publicacion WHERE titulo_publicacion = ?', [titulo_publicacion]);

        if (publicacion.length === 0) {
            return res.status(404).json({ mensaje: "Publicacion no encontrada" });
        }

        // Crea un nueva publicacion en el carrito
        const [resultado] = await db.query('INSERT INTO carrito (publicacion, imagen, precio, cantidad) VALUES (?, ?, ?, ?)', [titulo_publicacion, imagen, precio, 1]);

        const nuevoCarrito = {
            id: resultado.insertId,
            nombre,
            imagen,
            precio,
            cantidad: 1
        };

        res.json({
            mensaje: "Producto agregado al carrito",
            producto: nuevoCarrito
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al agregar producto al carrito" });
    }
};

const deleteCarrito = async (req, res) => {
    const { publicacionID } = req.params;

    try {
        // Busca el producto en el carrito
        const [productoCarrito] = await db.query('SELECT * FROM carrito WHERE id = id_carrito', [productoID]);

        if (productoCarrito.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado en el carrito" });
        }

        // Busca el producto en la tabla de productos
        const [producto] = await db.query('SELECT * FROM publicacion WHERE titulo_publicacion = ?', [productoCarrito.titulo_publicacion]);

        if (producto.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado en la base de datos" });
        }

        // Elimina el producto del carrito
        await db.query('DELETE FROM carrito WHERE id_carrito = ?', [productoID]);

        // Actualiza el estado del producto en la tabla de productos
        await db.query('UPDATE publicacion_compra SET en_carrito = false WHERE titulo = ?', [productoCarrito.titulo_publicacion]);

        res.json({ mensaje: `El producto ${producto.titulo_publicacion} fue eliminado del carrito` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Ocurrió un error al eliminar el producto del carrito" });
    }
};

const getProductoCarrito = async (req, res) => {
    try {
        const [productosCarrito] = await db.query('SELECT * FROM carrito');
        
        if (productosCarrito.length > 0) {
            res.json({ productoCarro: productosCarrito });
        } else {
            res.json({ mensaje: "Carrito Vacio" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener productos del carrito" });
    }
};

const getProducto = async (req, res) => {
    try {
        const [productos] = await db.query('SELECT * FROM publicacion');
        
        if (productos.length > 0) {
            res.json({ producto: productos });
        } else {
            res.json({ mensaje: "No hay publicaciones" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener productos" });
    }
};

const putProducto = async (req, res) => {
    const { productoID } = req.params;
    const { query } = req.query;
    const body = req.body;

    try {
        // Busca el producto en el carrito
        const [producto] = await db.query('SELECT * FROM carrito WHERE id_carrito = ?', [productoID]);

        if (!query) {
            return res.status(400).json({ mensaje: "Debes enviar una query" });
        } else if (producto.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado en el carrito" });
        }

        if (query === "add") {
            body.cantidad = body.cantidad + 1;
        } else if (query === "del") {
            body.cantidad = body.cantidad - 1;
        } else {
            return res.status(400).json({ mensaje: "Query no válida" });
        }

        await db.query('UPDATE carrito SET cantidad = ? WHERE id_carrito = ?', [body.cantidad, productoID]);

        res.json({ mensaje: `El producto ${producto.titulo_publicacion} fue actualizado`, producto: body });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Ocurrió un error al actualizar el producto" });
    }
};


module.exports = {
    addProductoCarrito,
    deleteCarrito,
    getProductoCarrito,
    getProducto,
    putProducto
};
