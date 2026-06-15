const path = require('path');
const fs = require('fs');
const multer = require('multer');

const carpetaUploads = path.join(__dirname, '..', '..', 'uploads', 'tareas');

if (!fs.existsSync(carpetaUploads)) {
  fs.mkdirSync(carpetaUploads, { recursive: true });
}

const almacenamiento = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, carpetaUploads);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const nombreBase = path.basename(file.originalname, extension);

    const nombreLimpio = nombreBase
      .toLowerCase()
      .replace(/[^a-z0-9ñáéíóú_-]/gi, '-')
      .replace(/-+/g, '-');

    const nombreFinal = `${Date.now()}-${nombreLimpio}${extension}`;

    cb(null, nombreFinal);
  }
});

function filtroArchivo(req, file, cb) {
  const tiposPermitidos = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];

  if (tiposPermitidos.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(
    new Error(
      'Tipo de archivo no permitido. Use PDF, imagen, Word, Excel o TXT.'
    )
  );
}

const subirArchivo = multer({
  storage: almacenamiento,
  fileFilter: filtroArchivo,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = subirArchivo;