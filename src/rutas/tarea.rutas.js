const express = require('express');
const passport = require('passport');
const controladorTarea = require('../controladores/tarea.controlador');

const rutas = express.Router();

const protegerRuta = passport.authenticate('jwt', { session: false });

rutas.get('/', protegerRuta, controladorTarea.obtenerTareas);
rutas.get('/:id', protegerRuta, controladorTarea.obtenerTareaPorId);
rutas.post('/', protegerRuta, controladorTarea.crearTarea);
rutas.put('/:id', protegerRuta, controladorTarea.actualizarTareaCompleta);
rutas.patch('/:id/estado', protegerRuta, controladorTarea.actualizarEstadoTarea);
rutas.patch('/:id', protegerRuta, controladorTarea.actualizarTareaParcial);
rutas.delete('/:id', protegerRuta, controladorTarea.eliminarTarea);

module.exports = rutas;