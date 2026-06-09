function Paginacion({ paginaActual, totalPaginas, cambiarPagina }) {
  return (
    <div className="paginacion">
      <button
        className="boton paginador"
        disabled={paginaActual === 1}
        onClick={() => cambiarPagina(paginaActual - 1)}
      >
        Anterior
      </button>

      <span>
        Página {paginaActual} de {totalPaginas}
      </span>

      <button
        className="boton paginador"
        disabled={paginaActual === totalPaginas}
        onClick={() => cambiarPagina(paginaActual + 1)}
      >
        Siguiente
      </button>
    </div>
  );
}

export default Paginacion;