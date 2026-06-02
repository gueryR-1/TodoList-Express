const Tarea = require('../modelos/tarea.modelo');

const estadosValidos = ['pendiente', 'en_proceso', 'completada'];

function normalizarEstado(estado) {
  if (!estado || typeof estado !== 'string') {
    return 'pendiente';
  }

  const estadoNormalizado = estado
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');

  const equivalenciasEstados = {
    proceso: 'en_proceso',
    en_proceso: 'en_proceso',
    'en proceso': 'en_proceso',
    pendiente: 'pendiente',
    completada: 'completada',
    completo: 'completada',
    terminada: 'completada',
    terminado: 'completada',
    finalizada: 'completada',
    finalizado: 'completada'
  };

  const estadoConvertido =
    equivalenciasEstados[estadoNormalizado] || estadoNormalizado;

  if (estadosValidos.includes(estadoConvertido)) {
    return estadoConvertido;
  }

  return 'pendiente';
}

function obtenerFiltroPorIdONumero(id, usuarioId) {
  const esNumero = !Number.isNaN(Number(id));

  if (esNumero) {
    return {
      numero: Number(id),
      usuario: usuarioId
    };
  }

  return {
    _id: id,
    usuario: usuarioId
  };
}

async function obtenerTodasLasTareas(usuarioId, filtros = {}) {
  const consulta = {
    usuario: usuarioId
  };

  if (filtros.estado) {
    consulta.estado = normalizarEstado(filtros.estado);
  }

  return await Tarea.find(consulta).sort({ numero: 1 });
}

async function obtenerTareaPorId(id, usuarioId) {
  const filtro = obtenerFiltroPorIdONumero(id, usuarioId);

  return await Tarea.findOne(filtro);
}

async function crearTarea(datos, usuarioId) {
  try {
    const ultimaTarea = await Tarea.findOne({
      usuario: usuarioId
    }).sort({ numero: -1 });

    const nuevoNumero =
      ultimaTarea && ultimaTarea.numero ? ultimaTarea.numero + 1 : 1;

    const nuevaTarea = await Tarea.create({
      numero: nuevoNumero,
      titulo: datos.titulo.trim(),
      estado: normalizarEstado(datos.estado),
      usuario: usuarioId
    });

    return {
      error: false,
      tarea: nuevaTarea
    };
  } catch (error) {
    if (error.code === 11000) {
      return {
        error: true,
        mensaje: 'Ya existe una tarea con ese título para este usuario'
      };
    }

    throw error;
  }
}

async function actualizarTareaCompleta(id, datos, usuarioId) {
  try {
    const filtro = obtenerFiltroPorIdONumero(id, usuarioId);

    return await Tarea.findOneAndUpdate(
      filtro,
      {
        titulo: datos.titulo.trim(),
        estado: normalizarEstado(datos.estado)
      },
      {
        new: true,
        runValidators: true
      }
    );
  } catch (error) {
    if (error.code === 11000) {
      return {
        error: true,
        mensaje: 'Ya existe una tarea con ese título para este usuario'
      };
    }

    throw error;
  }
}

async function actualizarTareaParcial(id, datos, usuarioId) {
  try {
    const filtro = obtenerFiltroPorIdONumero(id, usuarioId);

    const datosActualizados = {};

    if (datos.titulo && typeof datos.titulo === 'string') {
      datosActualizados.titulo = datos.titulo.trim();
    }

    if (datos.estado && typeof datos.estado === 'string') {
      datosActualizados.estado = normalizarEstado(datos.estado);
    }

    return await Tarea.findOneAndUpdate(filtro, datosActualizados, {
      new: true,
      runValidators: true
    });
  } catch (error) {
    if (error.code === 11000) {
      return {
        error: true,
        mensaje: 'Ya existe una tarea con ese título para este usuario'
      };
    }

    throw error;
  }
}

async function actualizarEstadoTarea(id, estado, usuarioId) {
  const filtro = obtenerFiltroPorIdONumero(id, usuarioId);

  return await Tarea.findOneAndUpdate(
    filtro,
    {
      estado: normalizarEstado(estado)
    },
    {
      new: true,
      runValidators: true
    }
  );
}

async function eliminarTarea(id, usuarioId) {
  const filtro = obtenerFiltroPorIdONumero(id, usuarioId);

  return await Tarea.findOneAndDelete(filtro);
}

module.exports = {
  obtenerTodasLasTareas,
  obtenerTareaPorId,
  crearTarea,
  actualizarTareaCompleta,
  actualizarTareaParcial,
  actualizarEstadoTarea,
  eliminarTarea
};