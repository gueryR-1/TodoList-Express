const fs = require('fs');
const path = require('path');
const selfsigned = require('selfsigned');

async function crearCertificados() {
  const carpetaCerts = path.join(__dirname, '..', 'certs');

  if (!fs.existsSync(carpetaCerts)) {
    fs.mkdirSync(carpetaCerts, { recursive: true });
  }

  const atributos = [
    {
      name: 'commonName',
      value: 'localhost'
    }
  ];

  const opciones = {
    days: 365,
    keySize: 2048,
    algorithm: 'sha256',
    extensions: [
      {
        name: 'basicConstraints',
        cA: true
      },
      {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true
      },
      {
        name: 'subjectAltName',
        altNames: [
          {
            type: 2,
            value: 'localhost'
          },
          {
            type: 7,
            ip: '127.0.0.1'
          }
        ]
      }
    ]
  };

  const certificados = await selfsigned.generate(atributos, opciones);

  const clavePrivada = certificados.private;
  const certificado = certificados.cert;

  if (!clavePrivada || !certificado) {
    console.log('No se pudieron generar los certificados.');
    console.log('Resultado recibido:', certificados);
    process.exit(1);
  }

  const rutaKey = path.join(carpetaCerts, 'localhost-key.pem');
  const rutaCert = path.join(carpetaCerts, 'localhost.pem');

  fs.writeFileSync(rutaKey, clavePrivada);
  fs.writeFileSync(rutaCert, certificado);

  console.log('Certificados HTTPS creados correctamente:');
  console.log(rutaKey);
  console.log(rutaCert);
}

crearCertificados().catch((error) => {
  console.error('Error al crear certificados:', error.message);
  process.exit(1);
});