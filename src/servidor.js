const aplicacion = require('./aplicacion');

const PUERTO = 3000;

aplicacion.listen(PUERTO, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PUERTO}`);
});