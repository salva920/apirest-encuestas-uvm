const { Schema, model } = require("mongoose");

// modelo de datos para almacenar las respuestas a las encuestas

const RespuestaSchema = Schema(
  {
    idUsuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    idEncuesta: {
      type: Schema.Types.ObjectId,
      ref: "Encuesta",
      required: true,
    },
    respuesta: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Respuesta", RespuestaSchema);
