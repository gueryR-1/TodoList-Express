function obtenerEtiquetaArchivo(archivo) {
  if (!archivo || !archivo.tipoMime) return 'FILE';

  if (archivo.tipoMime.startsWith('image/')) return 'IMG';
  if (archivo.tipoMime === 'application/pdf') return 'PDF';
  if (archivo.tipoMime.includes('word')) return 'DOC';
  if (archivo.tipoMime.includes('excel') || archivo.tipoMime.includes('sheet')) return 'XLS';
  if (archivo.tipoMime === 'text/plain') return 'TXT';

  return 'FILE';
}

function FilaTarea({
  tarea,
  formatearEstado,
  obtenerClaseEstado,
  manejarCambioEstado,
  manejarEditarTitulo,
  manejarEliminarTarea,
  manejarSubirArchivo,
  manejarDescargarArchivo,
  manejarEliminarArchivo
}) {
  const tieneArchivo = Boolean(tarea.archivo);

  return (
    <div className="fila">
      <div className="celda numero">#{tarea.numero}</div>

      <div className="celda nombre-tarea">
        {tarea.titulo}
      </div>

      <div className="celda">
        <span className={obtenerClaseEstado(tarea.estado)}>
          {formatearEstado(tarea.estado)}
        </span>
      </div>

      <div className="celda">
        <select
          className="select-estado"
          value={tarea.estado}
          onChange={(evento) => manejarCambioEstado(tarea, evento.target.value)}
        >
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En proceso</option>
          <option value="completada">Completada</option>
        </select>
      </div>

      <div className="celda archivo-tarea">
        <div className="archivo-panel">
          <div className="archivo-superior">
            <span className="archivo-etiqueta">
              {tieneArchivo ? obtenerEtiquetaArchivo(tarea.archivo) : '---'}
            </span>

            <span
              className="archivo-nombre"
              title={tieneArchivo ? tarea.archivo.nombreOriginal : 'Sin archivo'}
            >
              {tieneArchivo ? tarea.archivo.nombreOriginal : 'Sin archivo'}
            </span>
          </div>

          <div className="archivo-botones-fila">
            {tieneArchivo && (
              <>
                <button
                  type="button"
                  className="boton mini"
                  onClick={() => manejarDescargarArchivo(tarea)}
                >
                  Descargar
                </button>

                <button
                  type="button"
                  className="boton mini peligro"
                  onClick={() => manejarEliminarArchivo(tarea)}
                >
                  Quitar
                </button>
              </>
            )}

            <label className="boton mini subir-mini">
              Subir
              <input
                className="input-oculto"
                type="file"
                onChange={(evento) => {
                  const archivo = evento.target.files[0];

                  if (archivo) {
                    manejarSubirArchivo(tarea, archivo);
                    evento.target.value = '';
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="celda acciones-tabla">
        <button
          type="button"
          className="boton mini"
          onClick={() => manejarEditarTitulo(tarea)}
        >
          Editar
        </button>

        <button
          type="button"
          className="boton mini peligro"
          onClick={() => manejarEliminarTarea(tarea)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default FilaTarea;