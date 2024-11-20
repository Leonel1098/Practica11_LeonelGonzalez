// routes/articulos.js
const express = require('express');
const router = express.Router();

// Exportamos el router con la conexión a la base de datos
module.exports = function(articulosDB) {

    // Crear artículo (POST)
    router.post('/', async (req, res) => {
        const { nombre, precio, cantidad } = req.body;

        // Validación simple
        if (!nombre || !precio || !cantidad) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        try {
            const response = await articulosDB.insert({
                nombre,
                precio,
                cantidad
            });
            res.status(201).json({ message: 'Artículo agregado exitosamente', response });
        } catch (error) {
            console.error('Error al agregar artículo:', error);
            res.status(500).json({ error: 'Error al agregar el artículo.' });
        }
    });

    // Listar artículos (GET)
    router.get('/', async (req, res) => {
        try {
            const response = await articulosDB.list({ include_docs: true });
            res.status(200).json(response.rows.map(row => row.doc));
        } catch (error) {
            console.error('Error al listar artículos:', error);
            res.status(500).json({ error: 'Error al listar los artículos.' });
        }
    });

    // Consultar artículo por ID (GET)
    router.get('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const articulo = await articulosDB.get(id);
            res.json(articulo);
        } catch (error) {
            console.error('Error al consultar el artículo:', error);
            res.status(500).send('Error al consultar el artículo.');
        }
    });

    // Eliminar artículo (DELETE)
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const articulo = await articulosDB.get(id);
            await articulosDB.destroy(id, articulo._rev);
            res.status(200).send('Artículo eliminado correctamente.');
        } catch (error) {
            console.error('Error al eliminar el artículo:', error);
            res.status(500).send('Error al eliminar el artículo.');
        }
    });

    // Actualizar artículo (PUT)
    router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const { nombre, precio, cantidad } = req.body;

        if (!nombre || !precio || !cantidad) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios para actualizar.' });
        }

        try {
            const articulo = await articulosDB.get(id);
            articulo.nombre = nombre;
            articulo.precio = precio;
            articulo.cantidad = cantidad;
            const updatedArticulo = await articulosDB.insert(articulo);
            res.status(200).json({ message: 'Artículo actualizado correctamente', updatedArticulo });
        } catch (error) {
            console.error('Error al actualizar el artículo:', error);
            res.status(500).send('Error al actualizar el artículo.');
        }
    });

    return router; // Exportamos el router para que se use en app.js
};
