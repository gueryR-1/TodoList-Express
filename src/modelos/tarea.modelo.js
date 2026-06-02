const mongoose = require('mongoose');

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