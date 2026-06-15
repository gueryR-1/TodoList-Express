const mongoose = require('mongoose');

const archivoEsquema = new mongoose.Schema(
  {
    nombreOriginal: {
      type: String,
      trim: true
    },
    nombreGuardado: {
      type: String,
      trim: true
    },
    ruta: {
      type: String,
      trim: true
    },
    tipoMime: {
      type: String,
      trim: true
    },
    tamanio: {
      type: Number
    }
  },
  {
    _id: false
  }
);

const tareaEsquema = new mongoose.Schema(
  {
    numero: {
      type: Number,
      required: true
    },
    titulo: {
      type: String,
      required: true,
      trim: true
    },
    estado: {
      type: String,
      enum: ['pendiente', 'en_proceso', 'completada'],
      default: 'pendiente'
    },
    archivo: {
      type: archivoEsquema,
      default: null
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    }
  },
  {
    timestamps: true
  }
);

tareaEsquema.index({ usuario: 1, numero: 1 }, { unique: true });
tareaEsquema.index({ usuario: 1, titulo: 1 }, { unique: true });

const Tarea = mongoose.model('Tarea', tareaEsquema);

module.exports = Tarea;