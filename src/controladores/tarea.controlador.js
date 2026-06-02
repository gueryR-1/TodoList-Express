const crypto = require('crypto');
const mongoose = require('mongoose');
const servicioTarea = require('../servicios/tarea.servicio');

function idONumeroValido(id) {
  const esNumero = !Number.isNaN(Number(id));
  const esIdMongo = mongoose.Types.ObjectId.isValid(id);

  return esNumero || esIdMongo;
}

async function obtenerTareas(req, res) {
  try {
    const { estado } = req.query;

    const tareas = await servicioTarea.obtenerTodasLasTareas({
      estado
    });

    const datosSerializados = JSON.stringify({
      estado: estado || 'todos',
      tareas
    });

    const etag = crypto
      .createHash('md5')
      .update(datosSerializados)
      .digest('hex');

    const etagCliente = req.headers['if-none-match'];

    if (etagCliente === etag) {
      return res.status(304).end();
    }

    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 'private, max-age=60');

    const hayDatos = tareas.length > 0;

    res.status(200).json({
      correcto: true,
      mensaje: hayDatos
        ? 'Lista de tareas obtenida correctamente'
        : 'No hay tareas registradas con ese filtro',
      metadatos: {
        total: tareas.length,
        hayDatos: hayDatos,
        fuente: 'MongoDB Atlas',
        recurso: '/api/tareas',
        metodo: 'GET',
        filtros: {
          estado: estado || 'sin filtro'
        },
        cache: {
          etag: etag,
          estado: 'datos_actualizados',
          duracionSegundos: 60
        }
      },
      datos: hayDatos ? tareas : []
    });
  } catch (error) {
    res.status(500).json({
      correcto: false,
      mensaje: 'Error al obtener las tareas',
      error: error.message
    });
  }
}

async function obtenerTareaPorId(req, res) {
  try {
    const { id } = req.params;

    if (!idONumeroValido(id)) {
      return res.status(400).json({
        correcto: false,
        mensaje: 'Debe enviar un número de tarea o un ID de MongoDB válido'
      });
    }

    const tarea = await servicioTarea.obtenerTareaPorId(id);

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
  } catch (error) {
    res.status(500).json({
      correcto: false,
      mensaje: 'Error al buscar la tarea',
      error: error.message
    });
  }
}

async function crearTarea(req, res) {
  try {
    const { titulo, estado } = req.body || {};

    if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
      return res.status(400).json({
        correcto: false,
        mensaje: 'El campo titulo es obligatorio y debe ser texto'
      });
    }

    const resultado = await servicioTarea.crearTarea({
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
  } catch (error) {
    res.status(500).json({
      correcto: false,
      mensaje: 'Error al crear la tarea',
      error: error.message
    });
  }
}

async function actualizarTareaCompleta(req, res) {
  try {
    const { id } = req.params;
    const { titulo, estado } = req.body || {};

    if (!idONumeroValido(id)) {
      return res.status(400).json({
        correcto: false,
        mensaje: 'Debe enviar un número de tarea o un ID de MongoDB válido'
      });
    }

    if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
      return res.status(400).json({
        correcto: false,
        mensaje: 'Para PUT debe enviar un titulo válido'
      });
    }

    if (!estado || typeof estado !== 'string') {
      return res.status(400).json({
        correcto: false,
        mensaje: 'Para PUT debe enviar un estado válido'
      });
    }

    const tareaActualizada = await servicioTarea.actualizarTareaCompleta(id, {
      titulo,
      estado
    });

    if (tareaActualizada && tareaActualizada.error) {
      return res.status(409).json({
        correcto: false,
        mensaje: tareaActualizada.mensaje
      });
    }

    if (!tareaActualizada) {
      return res.status(404).json({
        correcto: false,
        mensaje: 'Tarea no encontrada'
      });
    }

    res.status(200).json({
      correcto: true,
      mensaje: 'Tarea actualizada completamente',
      datos: tareaActualizada
    });
  } catch (error) {
    res.status(500).json({
      correcto: false,
      mensaje: 'Error al actualizar la tarea',
      error: error.message
    });
  }
}

async function actualizarTareaParcial(req, res) {
  try {
    const { id } = req.params;
    const { titulo, estado } = req.body || {};

    if (!idONumeroValido(id)) {
      return res.status(400).json({
        correcto: false,
        mensaje: 'Debe enviar un número de tarea o un ID de MongoDB válido'
      });
    }

    if (!titulo && !estado) {
      return res.status(400).json({
        correcto: false,
        mensaje: 'Debe enviar al menos titulo o estado'
      });
    }

    const tareaActualizada = await servicioTarea.actualizarTareaParcial(id, {
      titulo,
      estado
    });

    if (tareaActualizada && tareaActualizada.error) {
      return res.status(409).json({
        correcto: false,
        mensaje: tareaActualizada.mensaje
      });
    }

    if (!tareaActualizada) {
      return res.status(404).json({
        correcto: false,
        mensaje: 'Tarea no encontrada'
      });
    }

    res.status(200).json({
      correcto: true,
      mensaje: 'Tarea actualizada parcialmente',
      datos: tareaActualizada
    });
  } catch (error) {
    res.status(500).json({
      correcto: false,
      mensaje: 'Error al actualizar parcialmente la tarea',
      error: error.message
    });
  }
}

async function actualizarEstadoTarea(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body || {};

    if (!idONumeroValido(id)) {
      return res.status(400).json({
        correcto: false,
        mensaje: 'Debe enviar un número de tarea o un ID de MongoDB válido'
      });
    }

    if (!estado || typeof estado !== 'string') {
      return res.status(400).json({
        correcto: false,
        mensaje: 'El campo estado es obligatorio'
      });
    }

    const tareaActualizada = await servicioTarea.actualizarEstadoTarea(id, estado);

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
  } catch (error) {
    res.status(500).json({
      correcto: false,
      mensaje: 'Error al actualizar el estado',
      error: error.message
    });
  }
}

async function eliminarTarea(req, res) {
  try {
    const { id } = req.params;

    if (!idONumeroValido(id)) {
      return res.status(400).json({
        correcto: false,
        mensaje: 'Debe enviar un número de tarea o un ID de MongoDB válido'
      });
    }

    const tareaEliminada = await servicioTarea.eliminarTarea(id);

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
  } catch (error) {
    res.status(500).json({
      correcto: false,
      mensaje: 'Error al eliminar la tarea',
      error: error.message
    });
  }
}

module.exports = {
  obtenerTareas,
  obtenerTareaPorId,
  crearTarea,
  actualizarTareaCompleta,
  actualizarTareaParcial,
  actualizarEstadoTarea,
  eliminarTarea
};