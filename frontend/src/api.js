const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function obtenerToken() {
  return localStorage.getItem('token');
}

function crearHeaders(conToken = false) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (conToken) {
    const token = obtenerToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

async function manejarRespuesta(respuesta) {
  const texto = await respuesta.text();

  let datos = null;

  if (texto) {
    datos = JSON.parse(texto);
  }

  if (!respuesta.ok) {
    const mensaje = datos?.mensaje || 'Error en la petición';
    throw new Error(mensaje);
  }

  return datos;
}

export async function registrarUsuario(datosUsuario) {
  const respuesta = await fetch(`${API_URL}/api/auth/registro`, {
    method: 'POST',
    headers: crearHeaders(false),
    body: JSON.stringify(datosUsuario)
  });

  return manejarRespuesta(respuesta);
}

export async function iniciarSesion(credenciales) {
  const respuesta = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: crearHeaders(false),
    body: JSON.stringify(credenciales)
  });

  return manejarRespuesta(respuesta);
}

export async function obtenerPerfil() {
  const respuesta = await fetch(`${API_URL}/api/auth/perfil`, {
    method: 'GET',
    headers: crearHeaders(true)
  });

  return manejarRespuesta(respuesta);
}

export async function obtenerTareas(estado = '') {
  const query = estado ? `?estado=${encodeURIComponent(estado)}` : '';

  const respuesta = await fetch(`${API_URL}/api/tareas${query}`, {
    method: 'GET',
    headers: crearHeaders(true)
  });

  return manejarRespuesta(respuesta);
}

export async function crearTarea(datosTarea) {
  const respuesta = await fetch(`${API_URL}/api/tareas`, {
    method: 'POST',
    headers: crearHeaders(true),
    body: JSON.stringify(datosTarea)
  });

  return manejarRespuesta(respuesta);
}

export async function actualizarTarea(numero, datosTarea) {
  const respuesta = await fetch(`${API_URL}/api/tareas/${numero}`, {
    method: 'PATCH',
    headers: crearHeaders(true),
    body: JSON.stringify(datosTarea)
  });

  return manejarRespuesta(respuesta);
}

export async function eliminarTarea(numero) {
  const respuesta = await fetch(`${API_URL}/api/tareas/${numero}`, {
    method: 'DELETE',
    headers: crearHeaders(true)
  });

  return manejarRespuesta(respuesta);
}