const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/usuario.modelo');

async function registrarUsuario(datos) {
  const correoNormalizado = datos.correo.trim().toLowerCase();

  const usuarioExistente = await Usuario.findOne({
    correo: correoNormalizado
  });

  if (usuarioExistente) {
    return {
      error: true,
      mensaje: 'Ya existe un usuario registrado con ese correo'
    };
  }

  const passwordEncriptado = await bcrypt.hash(datos.password, 10);

  const nuevoUsuario = await Usuario.create({
    nombre: datos.nombre.trim(),
    correo: correoNormalizado,
    password: passwordEncriptado
  });

  return {
    error: false,
    usuario: {
      id: nuevoUsuario._id,
      nombre: nuevoUsuario.nombre,
      correo: nuevoUsuario.correo
    }
  };
}

async function iniciarSesion(datos) {
  const correoNormalizado = datos.correo.trim().toLowerCase();

  const usuario = await Usuario.findOne({
    correo: correoNormalizado
  });

  if (!usuario) {
    return {
      error: true,
      mensaje: 'Correo o contraseña incorrectos'
    };
  }

  const passwordCorrecto = await bcrypt.compare(
    datos.password,
    usuario.password
  );

  if (!passwordCorrecto) {
    return {
      error: true,
      mensaje: 'Correo o contraseña incorrectos'
    };
  }

  const token = jwt.sign(
    {
      id: usuario._id,
      correo: usuario.correo
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    }
  );

  return {
    error: false,
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo
    }
  };
}

module.exports = {
  registrarUsuario,
  iniciarSesion
};