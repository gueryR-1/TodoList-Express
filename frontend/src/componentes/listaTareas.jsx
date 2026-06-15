import FilaTarea from './FilaTarea';
import Paginacion from './Paginacion';

function ListaTareas({
  tareas,
  tareasPaginadas,
  filtroEstado,
  cambiarFiltro,
  paginaActual,
  totalPaginas,
  cambiarPagina,
  formatearEstado,
  obtenerClaseEstado,
  manejarCambioEstado,
  manejarEditarTitulo,
  manejarEliminarTarea,
  manejarSubirArchivo,
  manejarDescargarArchivo,
  manejarEliminarArchivo
}) {
  return (
    <section className="bloque-lista">
      <div className="cabecera-lista">
        <div>
          <h2>Listado de tareas</h2>
          <p>
            Mostrando {tareasPaginadas.length} de {tareas.length} tareas
          </p>
        </div>

        <select
          value={filtroEstado}
          onChange={(evento) => cambiarFiltro(evento.target.value)}
        >
          <option value="">Todas</option>
          <option value="pendiente">Pendientes</option>
          <option value="en_proceso">En proceso</option>
          <option value="completada">Completadas</option>
        </select>
      </div>

      {tareas.length === 0 ? (
        <div className="sin-datos">
          <h3>No hay tareas para mostrar</h3>
          <p>Crea una tarea o cambia el filtro seleccionado.</p>
        </div>
      ) : (
        <>
          <div className="tabla-tareas">
            <div className="fila encabezado-tabla">
              <span>N°</span>
              <span>Tarea</span>
              <span>Estado</span>
              <span>Cambiar</span>
              <span>Archivo</span>
              <span>Acciones</span>
            </div>

            {tareasPaginadas.map((tarea) => (
              <FilaTarea
                key={tarea._id}
                tarea={tarea}
                formatearEstado={formatearEstado}
                obtenerClaseEstado={obtenerClaseEstado}
                manejarCambioEstado={manejarCambioEstado}
                manejarEditarTitulo={manejarEditarTitulo}
                manejarEliminarTarea={manejarEliminarTarea}
                manejarSubirArchivo={manejarSubirArchivo}
                manejarDescargarArchivo={manejarDescargarArchivo}
                manejarEliminarArchivo={manejarEliminarArchivo}
              />
            ))}
          </div>

          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            cambiarPagina={cambiarPagina}
          />
        </>
      )}
    </section>
  );
}

export default ListaTareas;