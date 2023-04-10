const { Schema, model } = require("mongoose");

// modelo de datos para almacenar las encuestas
const EncuestaSchema = Schema(
  {
    tipo: {
      type: String,
      lowercase: true,
      enum: ["seleccion unica", "seleccion multiple"],
    },
    nombre: {
      type: String,
      required: true,
      lowercase: true,
    },
    descripcion: {
      type: String,
      required: true,
      lowercase: true,
    },
    opciones: {
      type: Array,
      required: true
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Encuesta", EncuestaSchema);
