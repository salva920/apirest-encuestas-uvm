const { validationResult } = require("express-validator");
const ac = require("../middlewares/roles");
const Encuesta = require("../models/Encuesta");
const Respuesta = require("../models/Respuesta");

// funcion que valida si se encontraron errores en el express-validator
const validarDatos = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return { errors: errors.array() };
  } else return null;
};

// muestra todas las encuestas
const index = async (req, res) => {
  if (!ac.can(req.user.rol).readAny("encuesta").granted)
    return res.status(401).json("Unauthorized");

  try {
    const encuestas = await Encuesta.find();

    res.status(200).json(encuestas);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// muestra una encuesta en especifico
const showEncuesta = async (req, res) => {
  if (!ac.can(req.user.rol).readAny("encuesta").granted)
    return res.status(401).json("Unauthorized");

  try {
    const encuesta = await Encuesta.findById(req.params.idEncuesta);
    if (!encuesta) return res.status(400).json("Encuesta no encontrada");
    res.status(200).json(encuesta);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion para guardar una encuesta
const crearEncuesta = async (req, res) => {
  const permission = ac.can(req.user.rol).createAny("encuesta");
  if (!permission.granted) return res.status(401).json("Unauthorized");

  const validar = validarDatos(req);
  if (validar) return res.status(400).json(validar);

  try {
    const nuevaEncuesta = new Encuesta(req.body);

    await nuevaEncuesta.save();

    res.status(201).json({ msg: "Encuesta creada", resultado: nuevaEncuesta });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion para editar luna encuesta
const editarEncuesta = async (req, res) => {
  const permission = ac.can(req.user.rol).updateAny("encuesta");
  if (!permission.granted) return res.status(401).json("Unauthorized");

  const validar = validarDatos(req);
  if (validar) return res.status(400).json(validar);

  try {
    const editado = await Encuesta.findByIdAndUpdate(
      req.params.idEncuesta,
      req.body,
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json({ msg: "Encuesta actualizada", encuesta: editado });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion para borrar una encuesta
const borrarEncuesta = async (req, res) => {
  const permission = ac.can(req.user.rol).deleteAny("encuesta");
  if (!permission.granted) return res.status(401).json("Unauthorized");

  try {
    await Encuesta.findByIdAndDelete(req.params.idEncuesta);

    return res.status(200).json("Encuesta Eliminada");
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// funcion que crea una respuesta a una encuesta

const crearRespuesta = async (req, res) => {
  
  const permission = ac.can(req.user.rol).createAny("respuesta");
  if (!permission.granted) return res.status(401).json("Unauthorized");

  const validar = validarDatos(req);
  if (validar) return res.status(400).json(validar);

  const idEncuesta = req.params.idEncuesta;
  const idUsuario = req.user._id;

  const datos = { idUsuario, idEncuesta, respuesta: req.body.respuesta };

  try {

    const nuevaRespuesta = new Respuesta(datos);

    await nuevaRespuesta.save();

    res.status(201).json({ msg: "Respuesta creada", resultado: nuevaRespuesta });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

module.exports = {
  index,
  showEncuesta,
  crearEncuesta,
  editarEncuesta,
  borrarEncuesta,
};
