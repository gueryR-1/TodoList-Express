let tareas = [];
let siguienteId = 1;

const estadosValidos = ['pendiente', 'en_proceso', 'completada'];

function normalizarEstado(estado) {
  if (!estado || typeof estado !== 'string') {
    return 'pendiente';
  }

  const estadoNormalizado = estado
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');

  if (estadosValidos.includes(estadoNormalizado)) {
    return estadoNormalizado;
  }

  return 'pendiente';
}

function normalizarTitulo(titulo) {
  if (!titulo || typeof titulo !== 'string') {
    return '';
  }

  return titulo.trim().toLowerCase();
}

function existeTareaConTitulo(titulo) {
  const tituloNormalizado = normalizarTitulo(titulo);

  return tareas.some((tarea) => {
    return normalizarTitulo(tarea.titulo) === tituloNormalizado;
  });
}

function obtenerTodasLasTareas() {
  return tareas;
}

function obtenerTareaPorId(id) {
  return tareas.find((tarea) => tarea.id === id);
}

function crearTarea(datos) {
  if (existeTareaConTitulo(datos.titulo)) {
    return {
      error: true,
      tipo: 'TAREA_DUPLICADA',
      mensaje: 'Ya existe una tarea con ese título'
    };
  }

  const nuevaTarea = {
    id: siguienteId++,
    titulo: datos.titulo.trim(),
    estado: normalizarEstado(datos.estado),
    fechaCreacion: new Date().toISOString()
  };

  tareas.push(nuevaTarea);

  return {
    error: false,
    tarea: nuevaTarea
  };
}

function actualizarEstadoTarea(id, estado) {
  const tarea = obtenerTareaPorId(id);

  if (!tarea) {
    return null;
  }

  tarea.estado = normalizarEstado(estado);
  tarea.fechaActualizacion = new Date().toISOString();

  return tarea;
}

function eliminarTarea(id) {
  const indice = tareas.findIndex((tarea) => tarea.id === id);

  if (indice === -1) {
    return null;
  }

  const tareaEliminada = tareas.splice(indice, 1);

  return tareaEliminada[0];
}

module.exports = {
  obtenerTodasLasTareas,
  obtenerTareaPorId,
  crearTarea,
  actualizarEstadoTarea,
  eliminarTarea
};