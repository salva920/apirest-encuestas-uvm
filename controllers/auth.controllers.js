// importacion de dependencias y modelo de usuario
const jwt = require("jsonwebtoken"); 
const { validationResult } = require("express-validator");
const Usuario = require("../models/Usuario");

// funcion para crear token jwt
function createToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, username: usuario.username },
    process.env.JWT_KEY,
    {
      expiresIn: 86400,
    }
  );
}

// funcion para crear una cuenta
const crearCuenta = async (req, res) => {

  // validar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const nuevoUsuario = new Usuario(req.body);

  await nuevoUsuario.save();

  return res.status(201).json(nuevoUsuario);
};

// controlador para iniciar sesion
const login = async (req, res) => {
  if (!req.body.correo || !req.body.password)
    return res.status(400).json({ msg: "envia email y password" });

  const usuario = await Usuario.findOne({ correo: req.body.correo });
  if (!usuario) return res.status(400).json({ msg: "email no registrado" });

  if (!usuario.estado) return res.status(400).json({ msg: "el usuario se encuentra eliminado" });

  const isMatch = await usuario.comparePassword(req.body.password);
  if (!isMatch)
    return res.status(400).json({ msg: "contraseña incorrecta" });

  return res.status(200).json({ token: createToken(usuario) });
};

module.exports = {
  crearCuenta,
  login,
};
