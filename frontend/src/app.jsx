import { useEffect, useState } from 'react';
import {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
  obtenerTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea
} from './api';

function App() {
  const [modoFormulario, setModoFormulario] = useState('login');

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const [tareas, setTareas] = useState([]);
  const [tituloTarea, setTituloTarea] = useState('');
  const [estadoTarea, setEstadoTarea] = useState('pendiente');
  const [filtroEstado, setFiltroEstado] = useState('');

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  function limpiarMensajes() {
    setMensaje('');
    setError('');
  }

  async function cargarPerfil() {
    try {
      const respuesta = await obtenerPerfil();
      setUsuario(respuesta.datos);
    } catch (error) {
      localStorage.removeItem('token');
      setToken('');
      setUsuario(null);
    }
  }

  async function cargarTareas() {
    try {
      limpiarMensajes();

      const respuesta = await obtenerTareas(filtroEstado);

      setTareas(respuesta.datos || []);

      if (respuesta.metadatos && !respuesta.metadatos.hayDatos) {
        setMensaje(respuesta.mensaje);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  async function manejarRegistro(evento) {
    evento.preventDefault();

    try {
      limpiarMensajes();

      await registrarUsuario({
        nombre,
        correo,
        password
      });

      setMensaje('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
      setModoFormulario('login');
      setNombre('');
      setPassword('');
    } catch (error) {
      setError(error.message);
    }
  }

  async function manejarLogin(evento) {
    evento.preventDefault();

    try {
      limpiarMensajes();

      const respuesta = await iniciarSesion({
        correo,
        password
      });

      localStorage.setItem('token', respuesta.token);
      setToken(respuesta.token);
      setUsuario(respuesta.datos);
      setPassword('');
      setMensaje('Inicio de sesión correcto.');
    } catch (error) {
      setError(error.message);
    }
  }

  function cerrarSesion() {
    localStorage.removeItem('token');
    setToken('');
    setUsuario(null);
    setTareas([]);
    setCorreo('');
    setPassword('');
    setMensaje('Sesión cerrada correctamente.');
  }

  async function manejarCrearTarea(evento) {
    evento.preventDefault();

    try {
      limpiarMensajes();

      await crearTarea({
        titulo: tituloTarea,
        estado: estadoTarea
      });

      setTituloTarea('');
      setEstadoTarea('pendiente');
      setMensaje('Tarea creada correctamente.');
      await cargarTareas();
    } catch (error) {
      setError(error.message);
    }
  }

  async function manejarCambioEstado(tarea, nuevoEstado) {
    try {
      limpiarMensajes();

      await actualizarTarea(tarea.numero, {
        estado: nuevoEstado
      });

      setMensaje('Estado actualizado correctamente.');
      await cargarTareas();
    } catch (error) {
      setError(error.message);
    }
  }

  async function manejarEditarTitulo(tarea) {
    const nuevoTitulo = window.prompt('Nuevo título de la tarea:', tarea.titulo);

    if (!nuevoTitulo || nuevoTitulo.trim() === '') {
      return;
    }

    try {
      limpiarMensajes();

      await actualizarTarea(tarea.numero, {
        titulo: nuevoTitulo
      });

      setMensaje('Título actualizado correctamente.');
      await cargarTareas();
    } catch (error) {
      setError(error.message);
    }
  }

  async function manejarEliminarTarea(tarea) {
    const confirmar = window.confirm(`¿Eliminar la tarea "${tarea.titulo}"?`);

    if (!confirmar) {
      return;
    }

    try {
      limpiarMensajes();

      await eliminarTarea(tarea.numero);

      setMensaje('Tarea eliminada correctamente.');
      await cargarTareas();
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    if (token) {
      cargarPerfil();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      cargarTareas();
    }
  }, [token, filtroEstado]);

  if (!token) {
    return (
      <main className="contenedor">
        <section className="tarjeta autenticacion">
          <h1>Todo List React</h1>
          <p className="subtitulo">
            Versión 5: React consumiendo API REST con Passport JWT
          </p>

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

          {mensaje && <div className="mensaje correcto">{mensaje}</div>}
          {error && <div className="mensaje error">{error}</div>}

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

  return (
    <main className="contenedor">
      <section className="encabezado">
        <div>
          <h1>Todo List React</h1>
          <p>
            Usuario: <strong>{usuario?.nombre}</strong> — {usuario?.correo}
          </p>
        </div>

        <button onClick={cerrarSesion} className="boton secundario">
          Cerrar sesión
        </button>
      </section>

      {mensaje && <div className="mensaje correcto">{mensaje}</div>}
      {error && <div className="mensaje error">{error}</div>}

      <section className="tarjeta">
        <h2>Crear tarea</h2>

        <form onSubmit={manejarCrearTarea} className="formulario-tarea">
          <input
            type="text"
            value={tituloTarea}
            onChange={(evento) => setTituloTarea(evento.target.value)}
            placeholder="Ejemplo: Estudiar React"
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

      <section className="tarjeta">
        <div className="barra-lista">
          <h2>Mis tareas</h2>

          <select
            value={filtroEstado}
            onChange={(evento) => setFiltroEstado(evento.target.value)}
          >
            <option value="">Todas</option>
            <option value="pendiente">Pendientes</option>
            <option value="en_proceso">En proceso</option>
            <option value="completada">Completadas</option>
          </select>
        </div>

        {tareas.length === 0 ? (
          <p className="sin-datos">No hay tareas para mostrar.</p>
        ) : (
          <div className="lista-tareas">
            {tareas.map((tarea) => (
              <article key={tarea._id} className="tarea">
                <div>
                  <span className="numero">#{tarea.numero}</span>
                  <h3>{tarea.titulo}</h3>
                  <p>Estado: {tarea.estado}</p>
                </div>

                <div className="acciones">
                  <select
                    value={tarea.estado}
                    onChange={(evento) =>
                      manejarCambioEstado(tarea, evento.target.value)
                    }
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_proceso">En proceso</option>
                    <option value="completada">Completada</option>
                  </select>

                  <button
                    className="boton secundario"
                    onClick={() => manejarEditarTitulo(tarea)}
                  >
                    Editar
                  </button>

                  <button
                    className="boton peligro"
                    onClick={() => manejarEliminarTarea(tarea)}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;