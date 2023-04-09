const { validationResult } = require("express-validator");
const ac = require("../middlewares/roles");
const Usuario = require("../models/Usuario");

// funcion que valida si se encontraron errores en el express-validator
const validarDatos = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return { errors: errors.array() };
  } else return null;
};

// funcion que devuelve la lista de usuarios registrados
const index = async (req, res) => {
  //   validar si el susuario tiene permisos para acceder a la funcion
  if (!ac.can(req.user.rol).readAny("usuario").granted)
    return res.status(401).json("Unauthorized");

  try {
    const usuarios = await Usuario.find();

    res.status(200).json(usuarios);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion que muestra los datos de un usuario
const showUsuario = async (req, res) => {
  const permission = ac.can(req.user.rol).readAny("usuario");
  const verifyId =
    req.user._id.toString() === req.params.idUsuario ? true : false;

  if (!permission.granted && !verifyId)
    return res.status(401).json("Unauthorized");

  try {
    const usuario = await Usuario.findById(req.params.idUsuario);
    if (!usuario) return res.status(400).json("Usuario no encontrado");
    res.status(200).json(usuario);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion para crear usuario
const crearUsuario = async (req, res) => {
  if (!ac.can(req.user.rol).createAny("usuario").granted)
    return res.status(401).json("Unauthorized");

  try {
    const validar = validarDatos(req);
    if (validar) return res.status(400).json(validar);

    const nuevoUsuario = new Usuario(req.body);

    await nuevoUsuario.save();

    res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion para editar los datos de un usuario
const editarUsuario = async (req, res) => {
  const permission = ac.can(req.user.rol).updateAny("usuario");
  const verifyId =
    req.user._id.toString() === req.params.idUsuario ? true : false;
  if (!permission.granted && !verifyId)
    return res.status(401).json("Unauthorized");

  try {
    const validar = validarDatos(req);

    if (validar) return res.status(400).json(validar);

    const actualizado = await Usuario.findByIdAndUpdate(
      req.params.idUsuario,
      req.body,
      {
        new: true,
      }
    );

    return res.status(200).json({ msg: "Usuario actualizado", actualizado });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion para borrar los datos de un usuario
const borrarUsuario = async (req, res) => {
  const permission = ac.can(req.user.rol).deleteAny("usuario");
  if (!permission.granted) return res.status(401).json("Unauthorized");

  try {
    await Usuario.findByIdAndUpdate(
      req.params.idUsuario,
      { estado: false },
      { new: true }
    );

    return res.status(200).json("Usuario eliminado");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion que devuelve los datos del usuario logueado
const usuarioLogueado = async (req, res) => {
  try {
    const datos = req.user;
    res.status(200).json(datos);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

module.exports = {
  index,
  showUsuario,
  crearUsuario,
  editarUsuario,
  borrarUsuario,
  usuarioLogueado,
};
