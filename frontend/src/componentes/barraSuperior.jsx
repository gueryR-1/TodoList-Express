function BarraSuperior({ usuario, cerrarSesion }) {
  return (
    <header className="barra-superior">
      <div className="datos-usuario">
        <h1>Mis tareas</h1>
        <p>
          Usuario: <strong>{usuario?.nombre}</strong>
        </p>
        <span>{usuario?.correo}</span>
      </div>

      <button onClick={cerrarSesion} className="boton salir">
        Cerrar sesión
      </button>
    </header>
  );
}

export default BarraSuperior;