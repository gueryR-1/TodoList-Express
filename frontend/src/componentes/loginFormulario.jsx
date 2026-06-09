import Mensaje from './Mensaje';

function LoginFormulario({
  modoFormulario,
  setModoFormulario,
  nombre,
  setNombre,
  correo,
  setCorreo,
  password,
  setPassword,
  mensaje,
  error,
  manejarRegistro,
  manejarLogin
}) {
  return (
    <main className="contenedor-login">
      <section className="tarjeta autenticacion">
        <h1 className="titulo-login">MIS TAREAS</h1>

        <div className="pestanas">
          <button
            className={modoFormulario === 'login' ? 'activo' : ''}
            onClick={() => setModoFormulario('login')}
          >
            Iniciar sesión
          </button>

          <button
            className={modoFormulario === 'registro' ? 'activo' : ''}
            onClick={() => setModoFormulario('registro')}
          >
            Registrarse
          </button>
        </div>

        <Mensaje mensaje={mensaje} error={error} />

        {modoFormulario === 'registro' ? (
          <form onSubmit={manejarRegistro} className="formulario">
            <label>
              Nombre
              <input
                type="text"
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
                placeholder="Tu nombre"
              />
            </label>

            <label>
              Correo
              <input
                type="email"
                value={correo}
                onChange={(evento) => setCorreo(evento.target.value)}
                placeholder="correo@email.com"
              />
            </label>

            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(evento) => setPassword(evento.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </label>

            <button type="submit" className="boton principal">
              Crear cuenta
            </button>
          </form>
        ) : (
          <form onSubmit={manejarLogin} className="formulario">
            <label>
              Correo
              <input
                type="email"
                value={correo}
                onChange={(evento) => setCorreo(evento.target.value)}
                placeholder="correo@email.com"
              />
            </label>

            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(evento) => setPassword(evento.target.value)}
                placeholder="Tu contraseña"
              />
            </label>

            <button type="submit" className="boton principal">
              Entrar
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export default LoginFormulario;