const { Router } = require("express");
const {
  index,
  showEncuesta,
  crearEncuesta,
  editarEncuesta,
  borrarEncuesta,
  crearRespuesta,
  mostrarRespuesta,
  encuestasRespondidas,
} = require("../controllers/encuestas.controller");
const { auth } = require("../middlewares/auth.middlewares");
const {
  validarCrearEncuesta,
  validarEditarEncuesta,
  validaOpcionesRespuesta,
} = require("../middlewares/encuestas.middlewares");

// rutas para admininistrar las encuestas y crear respuestas a las mismas
const router = Router();

router.get("/", auth, index);
router.get("/verEncuesta/:idEncuesta", [auth], showEncuesta);
router.post("/", [auth, validarCrearEncuesta], crearEncuesta);
router.put("/:idEncuesta", [auth, validarEditarEncuesta], editarEncuesta);
router.delete("/:idEncuesta", auth, borrarEncuesta);

router.post("/:idEncuesta/respuesta/", [auth, validaOpcionesRespuesta], crearRespuesta);
router.get("/:idEncuesta/resultado/", auth, mostrarRespuesta);
router.get("/encuestasRespondidas", auth, encuestasRespondidas);

module.exports = router;
