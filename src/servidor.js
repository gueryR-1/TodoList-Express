require('dotenv').config();

const dns = require('dns');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const mongoose = require('mongoose');
const aplicacion = require('./aplicacion');

dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

const PUERTO = process.env.PUERTO || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const USAR_HTTPS = process.env.USAR_HTTPS === 'true';
const SSL_KEY = process.env.SSL_KEY || 'certs/localhost-key.pem';
const SSL_CERT = process.env.SSL_CERT || 'certs/localhost.pem';

function crearServidor() {
  if (!USAR_HTTPS) {
    return http.createServer(aplicacion);
  }

  const rutaKey = path.resolve(SSL_KEY);
  const rutaCert = path.resolve(SSL_CERT);

  if (!fs.existsSync(rutaKey) || !fs.existsSync(rutaCert)) {
    throw new Error(
      'No se encontraron los certificados HTTPS. Cree certs/localhost-key.pem y certs/localhost.pem o use USAR_HTTPS=false'
    );
  }

  return https.createServer(
    {
      key: fs.readFileSync(rutaKey),
      cert: fs.readFileSync(rutaCert)
    },
    aplicacion
  );
}

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

    const servidor = crearServidor();
    const protocolo = USAR_HTTPS ? 'https' : 'http';

    servidor.listen(PUERTO, () => {
      console.log(`Servidor ejecutándose en ${protocolo}://localhost:${PUERTO}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    console.error('Tipo de error:', error.name);
    process.exit(1);
  }
}

iniciarServidor();