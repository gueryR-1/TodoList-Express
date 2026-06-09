function MenuLateral({ filtroEstado, cambiarFiltro, totalTareas }) {
  return (
    <aside className="menu-lateral">
      <h2>Filtros</h2>

      <nav className="menu-filtros">
        <button
          className={filtroEstado === '' ? 'opcion-menu activa' : 'opcion-menu'}
          onClick={() => cambiarFiltro('')}
        >
          Todas
        </button>

        <button
          className={
            filtroEstado === 'pendiente' ? 'opcion-menu activa' : 'opcion-menu'
          }
          onClick={() => cambiarFiltro('pendiente')}
        >
          Pendientes
        </button>

        <button
          className={
            filtroEstado === 'en_proceso' ? 'opcion-menu activa' : 'opcion-menu'
          }
          onClick={() => cambiarFiltro('en_proceso')}
        >
          En proceso
        </button>

        <button
          className={
            filtroEstado === 'completada' ? 'opcion-menu activa' : 'opcion-menu'
          }
          onClick={() => cambiarFiltro('completada')}
        >
          Completadas
        </button>
      </nav>

      <div className="resumen-lateral">
        <p>Tareas encontradas</p>
        <strong>{totalTareas}</strong>
      </div>
    </aside>
  );
}

export default MenuLateral;