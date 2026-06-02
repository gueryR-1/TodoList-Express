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

  const estadoConvertido = equivalenciasEstados[estadoNormalizado] || estadoNormalizado;

  if (estadosValidos.includes(estadoConvertido)) {
    return estadoConvertido;
  }

  return 'pendiente';
}

function obtenerFiltroPorIdONumero(id) {
  const esNumero = !Number.isNaN(Number(id));

  if (esNumero) {
    return {
      numero: Number(id)
    };
  }

  return {
    _id: id
  };
}

async function obtenerTodasLasTareas(filtros = {}) {
  const consulta = {};

  if (filtros.estado) {
    consulta.estado = normalizarEstado(filtros.estado);
  }

  return await Tarea.find(consulta).sort({ numero: 1 });
}

async function obtenerTareaPorId(id) {
  const filtro = obtenerFiltroPorIdONumero(id);

  return await Tarea.findOne(filtro);
}

async function crearTarea(datos) {
  try {
    const ultimaTarea = await Tarea.findOne().sort({ numero: -1 });

    const nuevoNumero = ultimaTarea && ultimaTarea.numero
      ? ultimaTarea.numero + 1
      : 1;

    const nuevaTarea = await Tarea.create({
      numero: nuevoNumero,
      titulo: datos.titulo.trim(),
      estado: normalizarEstado(datos.estado)
    });

    return {
      error: false,
      tarea: nuevaTarea
    };
  } catch (error) {
    if (error.code === 11000) {
      return {
        error: true,
        mensaje: 'Ya existe una tarea con ese título o número'
      };
    }

    throw error;
  }
}

async function actualizarTareaCompleta(id, datos) {
  try {
    const filtro = obtenerFiltroPorIdONumero(id);

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
        mensaje: 'Ya existe una tarea con ese título'
      };
    }

    throw error;
  }
}

async function actualizarTareaParcial(id, datos) {
  try {
    const filtro = obtenerFiltroPorIdONumero(id);

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
        mensaje: 'Ya existe una tarea con ese título'
      };
    }

    throw error;
  }
}

async function actualizarEstadoTarea(id, estado) {
  const filtro = obtenerFiltroPorIdONumero(id);

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

async function eliminarTarea(id) {
  const filtro = obtenerFiltroPorIdONumero(id);

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