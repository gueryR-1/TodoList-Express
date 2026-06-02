const express = require('express');
const passport = require('passport');
const controladorAutenticacion = require('../controladores/autenticacion.controlador');

const rutas = express.Router();

rutas.post('/registro', controladorAutenticacion.registrarUsuario);

rutas.post('/login', controladorAutenticacion.iniciarSesion);

rutas.get(
  '/perfil',
  passport.authenticate('jwt', { session: false }),
  controladorAutenticacion.obtenerPerfil
);

module.exports = rutas;