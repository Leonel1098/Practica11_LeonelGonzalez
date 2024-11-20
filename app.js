const express = require('express');
const bodyParser = require('body-parser');
const nano = require('nano')('http://Leonel:Leonel@localhost:5984');
const path = require('path');
const app = express();

// Configuración de CouchDB
const articulosDB = nano.db.use('tienda');

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Importar rutas de artículos y pasarlas la base de datos
const articulosRoutes = require('./routes/articulos')(articulosDB);
app.use('/articulos', articulosRoutes);

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});
