const servicioAutenticacion = require('../servicios/autenticacion.servicio');

async function registrarUsuario(req, res) {
  try {
    const { nombre, correo, password } = req.body || {};

    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({
        correcto: false,
        mensaje: 'El nombre es obligatorio'
      });
    }

    if (!correo || typeof correo !== 'string' || correo.trim() === '') {
      return res.status(400).json({
        correcto: false,
        mensaje: 'El correo es obligatorio'
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        correcto: false,
        mensaje: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const resultado = await servicioAutenticacion.registrarUsuario({
      nombre,
      correo,
      password
    });

    if (resultado.error) {
      return res.status(409).json({
        correcto: false,
        mensaje: resultado.mensaje
      });
    }

    res.status(201).json({
      correcto: true,
      mensaje: 'Usuario registrado correctamente',
      datos: resultado.usuario
    });
  } catch (error) {
    res.status(500).json({
      correcto: false,
      mensaje: 'Error al registrar usuario',
      error: error.message
    });
  }
}

async function iniciarSesion(req, res) {
  try {
    const { correo, password } = req.body || {};

    if (!correo || typeof correo !== 'string' || correo.trim() === '') {
      return res.status(400).json({
        correcto: false,
        mensaje: 'El correo es obligatorio'
      });
    }

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        correcto: false,
        mensaje: 'La contraseña es obligatoria'
      });
    }

    const resultado = await servicioAutenticacion.iniciarSesion({
      correo,
      password
    });

    if (resultado.error) {
      return res.status(401).json({
        correcto: false,
        mensaje: resultado.mensaje
      });
    }

    res.status(200).json({
      correcto: true,
      mensaje: 'Inicio de sesión correcto',
      token: resultado.token,
      tipoToken: 'Bearer',
      datos: resultado.usuario
    });
  } catch (error) {
    res.status(500).json({
      correcto: false,
      mensaje: 'Error al iniciar sesión',
      error: error.message
    });
  }
}

async function obtenerPerfil(req, res) {
  res.status(200).json({
    correcto: true,
    mensaje: 'Perfil obtenido correctamente',
    datos: {
      id: req.user._id,
      nombre: req.user.nombre,
      correo: req.user.correo
    }
  });
}

module.exports = {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil
};