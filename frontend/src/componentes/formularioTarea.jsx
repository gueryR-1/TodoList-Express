function FormularioTarea({
  tituloTarea,
  setTituloTarea,
  estadoTarea,
  setEstadoTarea,
  manejarCrearTarea
}) {
  return (
    <section className="bloque-formulario">
      <div className="titulo-bloque">
        <h2>Agregar nueva tarea</h2>
        <p>Registra una tarea y asígnale un estado inicial.</p>
      </div>

      <form onSubmit={manejarCrearTarea} className="formulario-tarea">
        <input
          type="text"
          value={tituloTarea}
          onChange={(evento) => setTituloTarea(evento.target.value)}
          placeholder="Nombre de la tarea"
        />

        <select
          value={estadoTarea}
          onChange={(evento) => setEstadoTarea(evento.target.value)}
        >
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En proceso</option>
          <option value="completada">Completada</option>
        </select>

        <button type="submit" className="boton principal">
          Agregar
        </button>
      </form>
    </section>
  );
}

export default FormularioTarea;