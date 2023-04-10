const { body } = require('express-validator');
const Encuesta = require('../models/Encuesta');

// valida que el tipo de encuesta sea el correcto
const validaTipo = tipo => {
    if(tipo !== "seleccion unica" && tipo !=="seleccion multiple") 
        throw new Error('el tipo ingresado no es permitido');
    
    return true;
}

// middlewares de express-validator para realizar comprobaciones en los datos enviados a la ruta 
const validarCrearEncuesta = [
    body("tipo").exists().withMessage("Debe ingresar un tipo").bail()
        .isString().withMessage("El tipo debe ser un string").bail()
        .custom(validaTipo),

    body("nombre").exists().withMessage("Debe ingresar un nombre").bail()
        .isString().withMessage("El nombre debe ser un string"),

    body("descripcion").exists().withMessage("Debe ingresar una descripcion").bail()
        .isString().withMessage("La descripcion debe ser un string"),

    body("opciones").exists().withMessage("Debe ingresar las opciones").bail()
        .isArray({min: 2}).withMessage("Las opciones deben estar en un array con minimo 2 valores")
];

const validarEditarEncuesta = [
    body("tipo").optional().bail()
        .isString().withMessage("El tipo debe ser un string").bail()
        .custom(validaTipo),

    body("nombre").optional().bail()
        .isString().withMessage("El nombre debe ser un string"),

    body("descripcion").optional().bail()
        .isString().withMessage("La descripcion debe ser un string"),

    body("opciones").optional().bail()
        .isArray({min: 2}).withMessage("Las opciones deben estar en un array con minimo 2 valores")
];

const validaOpcionesRespuesta = [
    body("respuesta").exists().withMessage("Debe ingresar la respuesta").bail()
        .isArray().withMessage("La respuesta debe estar en un array").bail()
        .custom(async (respuesta, { req }) => {
            const encuesta = await Encuesta.findById(req.params.idEncuesta);
            let bandera = false;

            respuesta.forEach(  element => {
                 encuesta.opciones.forEach( opcion => {
                    if(element === opcion) {
                        bandera = true;
                    }
                })

                if (!bandera) throw new Error("La respuesta no coincide con las opciones de la encuesta");
                else bandera = false;
                
            });


            return true;
        })
]

module.exports = {
    validarCrearEncuesta,
    validarEditarEncuesta,
    validaOpcionesRespuesta
}