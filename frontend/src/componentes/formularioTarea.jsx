function obtenerTipoArchivo(archivo) {
  if (!archivo) return 'archivo';

  if (archivo.type.startsWith('image/')) return 'imagen';
  if (archivo.type === 'application/pdf') return 'pdf';
  if (archivo.type.includes('word')) return 'word';
  if (archivo.type.includes('excel') || archivo.type.includes('sheet')) return 'excel';
  if (archivo.type === 'text/plain') return 'txt';

  return 'archivo';
}

function obtenerEtiquetaArchivo(tipo) {
  const etiquetas = {
    imagen: 'IMG',
    pdf: 'PDF',
    word: 'DOC',
    excel: 'XLS',
    txt: 'TXT',
    archivo: 'FILE'
  };

  return etiquetas[tipo] || 'FILE';
}

function FormularioTarea({
  tituloTarea,
  setTituloTarea,
  estadoTarea,
  setEstadoTarea,
  archivoTarea,
  setArchivoTarea,
  manejarCrearTarea
}) {
  const tipoArchivo = obtenerTipoArchivo(archivoTarea);
  const esImagen = tipoArchivo === 'imagen';
  const previewImagen = archivoTarea && esImagen ? URL.createObjectURL(archivoTarea) : null;

  function quitarArchivo() {
    setArchivoTarea(null);

    const input = document.getElementById('archivoCrearTarea');

    if (input) {
      input.value = '';
    }
  }

  return (
    <section className="bloque-formulario">
      <div className="titulo-bloque">
        <h2>Agregar nueva tarea</h2>
        <p>Registra una tarea y adjunta un archivo si es necesario.</p>
      </div>

      <form onSubmit={manejarCrearTarea} className="formulario-tarea">
        <div className="campo campo-titulo">
          <label>Nombre de la tarea</label>
          <input
            type="text"
            value={tituloTarea}
            onChange={(evento) => setTituloTarea(evento.target.value)}
            placeholder="Ejemplo: estudiar tema 2"
          />
        </div>

        <div className="campo campo-estado">
          <label>Estado</label>
          <select
            value={estadoTarea}
            onChange={(evento) => setEstadoTarea(evento.target.value)}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="completada">Completada</option>
          </select>
        </div>

        <div className="campo campo-archivo">
          <label>Archivo</label>

          <label className="selector-archivo">
            Seleccionar archivo
            <input
              id="archivoCrearTarea"
              type="file"
              onChange={(evento) => setArchivoTarea(evento.target.files[0] || null)}
            />
          </label>
        </div>

        <div className="campo campo-submit">
          <button type="submit" className="boton principal">
            Agregar
          </button>
        </div>
      </form>

      {archivoTarea && (
        <div className="preview-archivo">
          <div className="preview-izquierda">
            {esImagen ? (
              <img
                src={previewImagen}
                alt="Vista previa"
                className="preview-imagen"
              />
            ) : (
              <div className="preview-icono">
                {obtenerEtiquetaArchivo(tipoArchivo)}
              </div>
            )}

            <div className="preview-datos">
              <strong>{archivoTarea.name}</strong>
              <span>{(archivoTarea.size / 1024).toFixed(1)} KB</span>
            </div>
          </div>

          <button
            type="button"
            className="boton peligro"
            onClick={quitarArchivo}
          >
            Quitar
          </button>
        </div>
      )}
    </section>
  );
}

export default FormularioTarea;