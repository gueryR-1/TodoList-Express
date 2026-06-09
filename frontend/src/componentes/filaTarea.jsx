function FilaTarea({
  tarea,
  formatearEstado,
  obtenerClaseEstado,
  manejarCambioEstado,
  manejarEditarTitulo,
  manejarEliminarTarea
}) {
  return (
    <div className="fila">
      <span className="celda numero">#{tarea.numero}</span>

      <span className="celda nombre-tarea">{tarea.titulo}</span>

      <span className="celda">
        <span className={obtenerClaseEstado(tarea.estado)}>
          {formatearEstado(tarea.estado)}
        </span>
      </span>

      <span className="celda">
        <select
          value={tarea.estado}
          onChange={(evento) => manejarCambioEstado(tarea, evento.target.value)}
        >
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En proceso</option>
          <option value="completada">Completada</option>
        </select>
      </span>

      <span className="celda acciones-tabla">
        <button
          className="boton pequeno"
          onClick={() => manejarEditarTitulo(tarea)}
        >
          Editar
        </button>

        <button
          className="boton pequeno peligro"
          onClick={() => manejarEliminarTarea(tarea)}
        >
          Eliminar
        </button>
      </span>
    </div>
  );
}

export default FilaTarea;