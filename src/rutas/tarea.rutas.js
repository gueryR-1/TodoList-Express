const express = require('express');
const controladorTarea = require('../controladores/tarea.controlador');

const rutas = express.Router();

rutas.get('/', controladorTarea.obtenerTareas);
rutas.get('/:id', controladorTarea.obtenerTareaPorId);
rutas.post('/', controladorTarea.crearTarea);
rutas.put('/:id', controladorTarea.actualizarTareaCompleta);
rutas.patch('/:id/estado', controladorTarea.actualizarEstadoTarea);
rutas.patch('/:id', controladorTarea.actualizarTareaParcial);
rutas.delete('/:id', controladorTarea.eliminarTarea);

module.exports = rutas;