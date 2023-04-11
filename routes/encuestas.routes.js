const { Router } = require("express");
const {
  index,
  showEncuesta,
  crearEncuesta,
  editarEncuesta,
  borrarEncuesta,
} = require("../controllers/encuestas.controller");
const { auth } = require("../middlewares/auth.middlewares");
const {
  validarCrearEncuesta,
  validarEditarEncuesta,
} = require("../middlewares/encuestas.middlewares");

// rutas para admininistrar las encuestas
const router = Router();

router.get("/", auth, index);
router.get("/:idEncuesta", [auth], showEncuesta);
router.post("/", [auth, validarCrearEncuesta], crearEncuesta);
router.put("/:idEncuesta", [auth, validarEditarEncuesta], editarEncuesta);
router.delete("/:idEncuesta", auth, borrarEncuesta);


module.exports = router;
