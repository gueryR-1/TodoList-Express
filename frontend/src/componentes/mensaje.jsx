function Mensaje({ mensaje, error }) {
  return (
    <>
      {mensaje && <div className="mensaje correcto">{mensaje}</div>}
      {error && <div className="mensaje error">{error}</div>}
    </>
  );
}

export default Mensaje;