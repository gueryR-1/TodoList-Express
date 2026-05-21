const express = require('express');
const path = require('path');
const rutasTareas = require('./rutas/tarea.rutas');

const aplicacion = express();

aplicacion.use(express.json());

aplicacion.use(express.static(path.join(__dirname, 'public')));

aplicacion.set('view engine', 'pug');
aplicacion.set('views', path.join(__dirname, 'vistas'));

aplicacion.get('/', (req, res) => {
  res.render('inicio', {
    titulo: 'Todo List API REST',
    mensaje: 'Servidor Express funcionando correctamente',
    rutaApi: '/api/tareas'
  });
});

aplicacion.use('/api/tareas', rutasTareas);

aplicacion.use((req, res) => {
  res.status(404).json({
    correcto: false,
    mensaje: 'Ruta no encontrada'
  });
});

module.exports = aplicacion;