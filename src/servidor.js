require('dotenv').config();

const dns = require('dns');
const mongoose = require('mongoose');
const aplicacion = require('./aplicacion');

dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

const PUERTO = process.env.PUERTO || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

async function iniciarServidor() {
  try {
    if (!MONGODB_URI) {
      throw new Error('No existe MONGODB_URI en el archivo .env');
    }

    console.log('DNS usados por Node:', dns.getServers());
    console.log('Intentando conectar a MongoDB...');

    console.log(
      'URI detectada:',
      MONGODB_URI.replace(/\/\/(.+?):(.+?)@/, '//USUARIO:CONTRASEÑA@')
    );

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 20000
    });

    console.log('Conexión exitosa a MongoDB');
    console.log('Base de datos conectada:', mongoose.connection.name);
    console.log('Host conectado:', mongoose.connection.host);

    aplicacion.listen(PUERTO, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    console.error('Tipo de error:', error.name);
    process.exit(1);
  }
}

iniciarServidor();