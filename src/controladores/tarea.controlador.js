const servicioTarea = require('../servicios/tarea.servicio');

function obtenerTareas(req, res) {
  const tareas = servicioTarea.obtenerTodasLasTareas();

  res.status(200).json({
    correcto: true,
    mensaje: 'Lista de tareas obtenida correctamente',
    datos: tareas
  });
}

function obtenerTareaPorId(req, res) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      correcto: false,
      mensaje: 'El ID debe ser un número válido'
    });
  }

  const tarea = servicioTarea.obtenerTareaPorId(id);

  if (!tarea) {
    return res.status(404).json({
      correcto: false,
      mensaje: 'Tarea no encontrada'
    });
  }

  res.status(200).json({
    correcto: true,
    mensaje: 'Tarea encontrada',
    datos: tarea
  });
}

function crearTarea(req, res) {
  const { titulo, estado } = req.body || {};

  if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({
      correcto: false,
      mensaje: 'El campo titulo es obligatorio y debe ser texto'
    });
  }

  const resultado = servicioTarea.crearTarea({
    titulo,
    estado
  });

  if (resultado.error) {
    return res.status(409).json({
      correcto: false,
      mensaje: resultado.mensaje
    });
  }

  res.status(201).json({
    correcto: true,
    mensaje: 'Tarea creada correctamente',
    datos: resultado.tarea
  });
}

function actualizarEstadoTarea(req, res) {
  const id = Number(req.params.id);
  const { estado } = req.body || {};

  if (Number.isNaN(id)) {
    return res.status(400).json({
      correcto: false,
      mensaje: 'El ID debe ser un número válido'
    });
  }

  if (!estado || typeof estado !== 'string') {
    return res.status(400).json({
      correcto: false,
      mensaje: 'El campo estado es obligatorio'
    });
  }

  const tareaActualizada = servicioTarea.actualizarEstadoTarea(id, estado);

  if (!tareaActualizada) {
    return res.status(404).json({
      correcto: false,
      mensaje: 'Tarea no encontrada'
    });
  }

  res.status(200).json({
    correcto: true,
    mensaje: 'Estado actualizado correctamente',
    datos: tareaActualizada
  });
}

function eliminarTarea(req, res) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      correcto: false,
      mensaje: 'El ID debe ser un número válido'
    });
  }

  const tareaEliminada = servicioTarea.eliminarTarea(id);

  if (!tareaEliminada) {
    return res.status(404).json({
      correcto: false,
      mensaje: 'Tarea no encontrada'
    });
  }

  res.status(200).json({
    correcto: true,
    mensaje: 'Tarea eliminada correctamente',
    datos: tareaEliminada
  });
}

module.exports = {
  obtenerTareas,
  obtenerTareaPorId,
  crearTarea,
  actualizarEstadoTarea,
  eliminarTarea
};