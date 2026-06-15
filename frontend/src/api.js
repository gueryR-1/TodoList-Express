const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:3000';

console.log('API_URL usada por React:', API_URL);

function obtenerToken() {
  return localStorage.getItem('token');
}

function crearHeadersJson(conToken = false) {
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

function crearHeadersArchivo() {
  const headers = {};
  const token = obtenerToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function manejarRespuesta(respuesta) {
  const texto = await respuesta.text();

  let datos = null;

  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch (error) {
      throw new Error('La respuesta del servidor no es JSON válido');
    }
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
    headers: crearHeadersJson(false),
    body: JSON.stringify(datosUsuario)
  });

  return manejarRespuesta(respuesta);
}

export async function iniciarSesion(credenciales) {
  const respuesta = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: crearHeadersJson(false),
    body: JSON.stringify(credenciales)
  });

  return manejarRespuesta(respuesta);
}

export async function obtenerPerfil() {
  const respuesta = await fetch(`${API_URL}/api/auth/perfil`, {
    method: 'GET',
    headers: crearHeadersJson(true)
  });

  return manejarRespuesta(respuesta);
}

export async function obtenerTareas(estado = '') {
  const query = estado ? `?estado=${encodeURIComponent(estado)}` : '';

  const respuesta = await fetch(`${API_URL}/api/tareas${query}`, {
    method: 'GET',
    headers: crearHeadersJson(true)
  });

  return manejarRespuesta(respuesta);
}

export async function crearTarea(datosTarea) {
  const formulario = new FormData();

  formulario.append('titulo', datosTarea.titulo);
  formulario.append('estado', datosTarea.estado);

  if (datosTarea.archivo) {
    formulario.append('archivo', datosTarea.archivo);
  }

  const respuesta = await fetch(`${API_URL}/api/tareas`, {
    method: 'POST',
    headers: crearHeadersArchivo(),
    body: formulario
  });

  return manejarRespuesta(respuesta);
}

export async function actualizarTarea(numero, datosTarea) {
  const respuesta = await fetch(`${API_URL}/api/tareas/${numero}`, {
    method: 'PATCH',
    headers: crearHeadersJson(true),
    body: JSON.stringify(datosTarea)
  });

  return manejarRespuesta(respuesta);
}

export async function subirArchivoTarea(numero, archivo) {
  const formulario = new FormData();

  formulario.append('archivo', archivo);

  const respuesta = await fetch(`${API_URL}/api/tareas/${numero}/archivo`, {
    method: 'PATCH',
    headers: crearHeadersArchivo(),
    body: formulario
  });

  return manejarRespuesta(respuesta);
}

export async function descargarArchivoTarea(numero, nombreArchivo = 'archivo') {
  const respuesta = await fetch(`${API_URL}/api/tareas/${numero}/archivo`, {
    method: 'GET',
    headers: crearHeadersArchivo()
  });

  if (!respuesta.ok) {
    let mensaje = 'Error al descargar archivo';

    try {
      const datos = await respuesta.json();
      mensaje = datos?.mensaje || mensaje;
    } catch (error) {
      mensaje = 'Error al descargar archivo';
    }

    throw new Error(mensaje);
  }

  const blob = await respuesta.blob();
  const url = window.URL.createObjectURL(blob);
  const enlace = document.createElement('a');

  enlace.href = url;
  enlace.download = nombreArchivo;

  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  window.URL.revokeObjectURL(url);
}

export async function eliminarArchivoTarea(numero) {
  const respuesta = await fetch(`${API_URL}/api/tareas/${numero}/archivo`, {
    method: 'DELETE',
    headers: crearHeadersJson(true)
  });

  return manejarRespuesta(respuesta);
}

export async function eliminarTarea(numero) {
  const respuesta = await fetch(`${API_URL}/api/tareas/${numero}`, {
    method: 'DELETE',
    headers: crearHeadersJson(true)
  });

  return manejarRespuesta(respuesta);
}