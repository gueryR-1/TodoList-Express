const mongoose = require('mongoose');

const tareaEsquema = new mongoose.Schema(
  {
    numero: {
      type: Number,
      unique: true
    },
    titulo: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    estado: {
      type: String,
      enum: ['pendiente', 'en_proceso', 'completada'],
      default: 'pendiente'
    }
  },
  {
    timestamps: true
  }
);

const Tarea = mongoose.model('Tarea', tareaEsquema);

module.exports = Tarea;