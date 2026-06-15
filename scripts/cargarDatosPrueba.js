require('dotenv').config();

const fs = require('fs');
const path = require('path');
const dns = require('dns');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Usuario = require('../src/modelos/usuario.modelo');
const Tarea = require('../src/modelos/tarea.modelo');

dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

const MONGODB_URI = process.env.MONGODB_URI;

const usuarioPrueba = {
  nombre: process.env.SEED_NOMBRE || 'Usuario de Prueba',
  correo: process.env.SEED_CORREO || 'gueryr875@gmail.com',
  password: process.env.SEED_PASSWORD || '123456'
};

async function cargarDatosPrueba() {
  try {
    if (!MONGODB_URI) {
      throw new Error('No existe MONGODB_URI en el archivo .env');
    }

    console.log('Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 20000
    });

    console.log('Conexión exitosa a MongoDB.');

    let usuario = await Usuario.findOne({
      correo: usuarioPrueba.correo
    });

    if (!usuario) {
      const passwordEncriptado = await bcrypt.hash(usuarioPrueba.password, 10);

      usuario = await Usuario.create({
        nombre: usuarioPrueba.nombre,
        correo: usuarioPrueba.correo,
        password: passwordEncriptado
      });

      console.log('Usuario de prueba creado.');
    } else {
      usuario.nombre = usuarioPrueba.nombre;
      usuario.password = await bcrypt.hash(usuarioPrueba.password, 10);
      await usuario.save();

      console.log('Usuario de prueba actualizado.');
    }

    await Tarea.deleteMany({
      usuario: usuario._id
    });

    const rutaDatos = path.join(__dirname, '..', 'datos', 'tareas-prueba.json');
    const contenido = fs.readFileSync(rutaDatos, 'utf-8');
    const tareas = JSON.parse(contenido);

    const tareasConUsuario = tareas.map((tarea, indice) => ({
      numero: indice + 1,
      titulo: tarea.titulo,
      estado: tarea.estado,
      archivo: null,
      usuario: usuario._id
    }));

    await Tarea.insertMany(tareasConUsuario);

    console.log('');
    console.log('Base de datos de prueba cargada correctamente.');
    console.log('');
    console.log('Usuario de prueba:');
    console.log(`Correo: ${usuarioPrueba.correo}`);
    console.log(`Contraseña: ${usuarioPrueba.password}`);
    console.log('');
    console.log(`Tareas cargadas: ${tareasConUsuario.length}`);
    console.log('');

    await mongoose.disconnect();
    console.log('Conexión cerrada.');
  } catch (error) {
    console.error('Error al cargar datos de prueba:', error.message);
    process.exit(1);
  }
}

cargarDatosPrueba();