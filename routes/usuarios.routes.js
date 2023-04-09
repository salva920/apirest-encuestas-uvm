const { Router } = require("express");
const {
  index,
  showUsuario,
  borrarUsuario,
  crearUsuario,
  editarUsuario,
  usuarioLogueado,
} = require("../controllers/usuarios.controller");
const { validarCrearCuenta, validarEditarCuenta, auth } = require("../middlewares/auth.middlewares");

// rutas para administrar los usuarios

const router = Router();

router.get("/", auth, index);
router.get("/usuario/:idUsuario", auth, showUsuario);
router.post("/", [auth, validarCrearCuenta], crearUsuario);
router.put("/:idUsuario", [auth, validarEditarCuenta], editarUsuario);
router.delete("/:idUsuario", auth, borrarUsuario);
router.get("/actual", auth, usuarioLogueado);


module.exports = router;
