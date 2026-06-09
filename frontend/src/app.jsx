import { useEffect, useMemo, useState } from 'react';
import {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
  obtenerTareas,
  crearTarea,
  actualizarTarea,
  eliminarTarea
} from './api';

import LoginFormulario from './componentes/LoginFormulario';
import BarraSuperior from './componentes/BarraSuperior';
import MenuLateral from './componentes/MenuLateral';
import FormularioTarea from './componentes/FormularioTarea';
import ListaTareas from './componentes/ListaTareas';
import Mensaje from './componentes/Mensaje';

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

  const [paginaActual, setPaginaActual] = useState(1);
  const tareasPorPagina = 5;

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  function limpiarMensajes() {
    setMensaje('');
    setError('');
  }

  function formatearEstado(estado) {
    const estados = {
      pendiente: 'Pendiente',
      en_proceso: 'En proceso',
      completada: 'Completada'
    };

    return estados[estado] || estado;
  }

  function obtenerClaseEstado(estado) {
    if (estado === 'pendiente') return 'estado pendiente';
    if (estado === 'en_proceso') return 'estado proceso';
    if (estado === 'completada') return 'estado completada';

    return 'estado';
  }

  function cambiarFiltro(nuevoFiltro) {
    setFiltroEstado(nuevoFiltro);
    setPaginaActual(1);
  }

  const totalPaginas = Math.max(1, Math.ceil(tareas.length / tareasPorPagina));

  const tareasPaginadas = useMemo(() => {
    const inicio = (paginaActual - 1) * tareasPorPagina;
    const fin = inicio + tareasPorPagina;

    return tareas.slice(inicio, fin);
  }, [tareas, paginaActual]);

  function cambiarPagina(nuevaPagina) {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) {
      return;
    }

    setPaginaActual(nuevaPagina);
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
      setPaginaActual(1);

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
    setPaginaActual(1);
    setFiltroEstado('');
    setMensaje('Sesión cerrada correctamente.');
  }

  async function manejarCrearTarea(evento) {
    evento.preventDefault();

    try {
      limpiarMensajes();

      if (!tituloTarea.trim()) {
        setError('El título de la tarea es obligatorio.');
        return;
      }

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
      <LoginFormulario
        modoFormulario={modoFormulario}
        setModoFormulario={setModoFormulario}
        nombre={nombre}
        setNombre={setNombre}
        correo={correo}
        setCorreo={setCorreo}
        password={password}
        setPassword={setPassword}
        mensaje={mensaje}
        error={error}
        manejarRegistro={manejarRegistro}
        manejarLogin={manejarLogin}
      />
    );
  }

  return (
    <main className="panel">
      <BarraSuperior usuario={usuario} cerrarSesion={cerrarSesion} />

      <section className="contenido-panel">
        <MenuLateral
          filtroEstado={filtroEstado}
          cambiarFiltro={cambiarFiltro}
          totalTareas={tareas.length}
        />

        <section className="area-trabajo">
          <Mensaje mensaje={mensaje} error={error} />

          <FormularioTarea
            tituloTarea={tituloTarea}
            setTituloTarea={setTituloTarea}
            estadoTarea={estadoTarea}
            setEstadoTarea={setEstadoTarea}
            manejarCrearTarea={manejarCrearTarea}
          />

          <ListaTareas
            tareas={tareas}
            tareasPaginadas={tareasPaginadas}
            filtroEstado={filtroEstado}
            cambiarFiltro={cambiarFiltro}
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            cambiarPagina={cambiarPagina}
            formatearEstado={formatearEstado}
            obtenerClaseEstado={obtenerClaseEstado}
            manejarCambioEstado={manejarCambioEstado}
            manejarEditarTitulo={manejarEditarTitulo}
            manejarEliminarTarea={manejarEliminarTarea}
          />
        </section>
      </section>
    </main>
  );
}

export default App;