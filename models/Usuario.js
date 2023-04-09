const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// modelo de datos para almacenar los usuarios
const UsuarioSchema = Schema(
  {
    correo: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    cedula: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    rol: {
      type: String,
      enum: ["admin", "moderador", "usuario"],
      default: "usuario",
    },
    estado: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// funcion para encriptar la contraseña luego de que se almacene el usuario en la bd
UsuarioSchema.pre("save", async function (next) {
  const usuario = this;
  if (!usuario.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(usuario.password, salt);
  usuario.password = hash;
});

// funcion para encriptar la nueva contraseña luego de que se edite los datos de un usuario
UsuarioSchema.pre("findOneAndUpdate", async function (next) {
  const usuario = this._update;
  if (usuario !== undefined && usuario.password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(usuario.password, salt);
    usuario.password = hash;
  } else {
    next();
  }
});

// funcion que hace que no se muestre la contraseña en los datos de los usuarios
UsuarioSchema.methods.toJSON = function () {
  const { password, ...usuario } = this.toObject();
  return usuario;
};
// funcion que compara contraseñas encriptadas
UsuarioSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model("Usuario", UsuarioSchema);
