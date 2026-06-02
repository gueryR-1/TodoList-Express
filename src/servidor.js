require('dotenv').config();

const mongoose = require('mongoose');
const aplicacion = require('./aplicacion');

const PUERTO = process.env.PUERTO || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

async function iniciarServidor() {
  try {
    if (!MONGODB_URI) {
      throw new Error('No existe MONGODB_URI en el archivo .env');
    }

    await mongoose.connect(MONGODB_URI);

    console.log('Conexión exitosa a MongoDB');
    console.log('Base de datos conectada:', mongoose.connection.name);
    console.log('Host conectado:', mongoose.connection.host);

    aplicacion.listen(PUERTO, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
}

iniciarServidor();