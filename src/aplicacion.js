const express = require('express');
const cors = require('cors');
const passport = require('./autenticacion/passport');

const rutasTareas = require('./rutas/tarea.rutas');
const rutasAutenticacion = require('./rutas/autenticacion.rutas');

const aplicacion = express();

aplicacion.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://localhost:5173',
      'https://127.0.0.1:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

aplicacion.use(express.json());
aplicacion.use(passport.initialize());

aplicacion.get('/', (req, res) => {
  res.status(200).json({
    correcto: true,
    mensaje:
      'Servidor Todo List API REST con MongoDB, Passport, JWT, React y archivos',
    version: '5.1.0',
    baseDeDatos: 'MongoDB Atlas',
    autenticacion: 'Passport JWT',
    frontend: 'React',
    archivos: 'Multer en almacenamiento local',
    endpoints: {
      registro: 'POST /api/auth/registro',
      login: 'POST /api/auth/login',
      perfil: 'GET /api/auth/perfil',
      listarTareas: 'GET /api/tareas',
      buscarTareaPorIdONumero: 'GET /api/tareas/:id',
      crearTareaConArchivo: 'POST /api/tareas',
      descargarArchivo: 'GET /api/tareas/:id/archivo',
      subirOReemplazarArchivo: 'PATCH /api/tareas/:id/archivo',
      eliminarArchivo: 'DELETE /api/tareas/:id/archivo',
      actualizarTareaCompleta: 'PUT /api/tareas/:id',
      actualizarTareaParcial: 'PATCH /api/tareas/:id',
      actualizarEstado: 'PATCH /api/tareas/:id/estado',
      eliminarTarea: 'DELETE /api/tareas/:id'
    }
  });
});

aplicacion.use('/api/auth', rutasAutenticacion);
aplicacion.use('/api/tareas', rutasTareas);

aplicacion.use((error, req, res, next) => {
  if (error) {
    return res.status(400).json({
      correcto: false,
      mensaje: error.message || 'Error en la petición'
    });
  }

  next();
});

aplicacion.use((req, res) => {
  res.status(404).json({
    correcto: false,
    mensaje: 'Ruta no encontrada'
  });
});

module.exports = aplicacion;