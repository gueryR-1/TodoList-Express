const fs = require('fs');
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

function obtenerDatosArchivo(archivo) {
  if (!archivo) {
    return null;
  }

  return {
    nombreOriginal: archivo.originalname,
    nombreGuardado: archivo.filename,
    ruta: archivo.path,
    tipoMime: archivo.mimetype,
    tamanio: archivo.size
  };
}

function eliminarArchivoFisico(archivo) {
  if (archivo && archivo.ruta && fs.existsSync(archivo.ruta)) {
    fs.unlinkSync(archivo.ruta);
  }
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

async function crearTarea(datos, usuarioId, archivo = null) {
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
      archivo: obtenerDatosArchivo(archivo),
      usuario: usuarioId
    });

    return {
      error: false,
      tarea: nuevaTarea
    };
  } catch (error) {
    if (archivo) {
      eliminarArchivoFisico(obtenerDatosArchivo(archivo));
    }

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

async function subirArchivoTarea(id, usuarioId, archivo) {
  const filtro = obtenerFiltroPorIdONumero(id, usuarioId);
  const tarea = await Tarea.findOne(filtro);

  if (!tarea) {
    if (archivo) {
      eliminarArchivoFisico(obtenerDatosArchivo(archivo));
    }

    return null;
  }

  if (tarea.archivo) {
    eliminarArchivoFisico(tarea.archivo);
  }

  tarea.archivo = obtenerDatosArchivo(archivo);
  await tarea.save();

  return tarea;
}

async function eliminarArchivoTarea(id, usuarioId) {
  const filtro = obtenerFiltroPorIdONumero(id, usuarioId);
  const tarea = await Tarea.findOne(filtro);

  if (!tarea) {
    return null;
  }

  if (tarea.archivo) {
    eliminarArchivoFisico(tarea.archivo);
  }

  tarea.archivo = null;
  await tarea.save();

  return tarea;
}

async function eliminarTarea(id, usuarioId) {
  const filtro = obtenerFiltroPorIdONumero(id, usuarioId);
  const tareaEliminada = await Tarea.findOneAndDelete(filtro);

  if (tareaEliminada && tareaEliminada.archivo) {
    eliminarArchivoFisico(tareaEliminada.archivo);
  }

  return tareaEliminada;
}

module.exports = {
  obtenerTodasLasTareas,
  obtenerTareaPorId,
  crearTarea,
  actualizarTareaCompleta,
  actualizarTareaParcial,
  actualizarEstadoTarea,
  subirArchivoTarea,
  eliminarArchivoTarea,
  eliminarTarea
};