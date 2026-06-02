const express = require('express');
const rutasTareas = require('./rutas/tarea.rutas');

const aplicacion = express();

aplicacion.use(express.json());

aplicacion.get('/', (req, res) => {
  res.status(200).json({
    correcto: true,
    mensaje: 'Servidor Todo List API REST conectado a MongoDB',
    version: '3.0.0',
    baseDeDatos: 'MongoDB Atlas',
    endpoints: {
      listarTareas: 'GET /api/tareas',
      buscarTareaPorIdONumero: 'GET /api/tareas/:id',
      crearTarea: 'POST /api/tareas',
      actualizarTareaCompleta: 'PUT /api/tareas/:id',
      actualizarTareaParcial: 'PATCH /api/tareas/:id',
      actualizarEstado: 'PATCH /api/tareas/:id/estado',
      eliminarTarea: 'DELETE /api/tareas/:id'
    }
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

//UTILIZAR PUT Y PATCH
//EL TASTLIST TIENE QUE SER CON CACHE
// el servidor va mirar el d tag 
// aumentar en el get task list, como los datos metadatos, de manera estandart si datos no despliega tiene que decir que datos no hay datos. 
// cuidar los metadatos. 