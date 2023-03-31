const { body } = require('express-validator');
const passport = require('passport');
const Usuario = require('../models/Usuario');


// funciones para usarlas en los middlewares de validacion
// funcion para saber si ya se encuentra registrado un correo
const encuentraCorreo = async (correo) => {
    const usuario = await Usuario.findOne({correo});

    if(usuario) throw new Error('correo existente');

    return true;
 }
// funcion para saber si ya se encuentra registrada una cedula
const encuentraCedula = async (cedula) => {
    const usuario = await Usuario.findOne({cedula});
    
    if(usuario) throw new Error('username existente');

    return true;
}

// middlewares que valida los datos enviados a la ruta
const validarCrearCuenta = [
	body('correo').exists().withMessage('Correo es requerido').bail()
					.isEmail().withMessage('Ingresa un correo valido').bail()
                    .matches("^[\\w-\.]+@uvm\.edu\.ve$").withMessage('el correo debe ser el de la institucion (@uvm.edu.ve)')
					.custom(encuentraCorreo),
    
    body('cedula').exists().withMessage('Cedula es requerido').bail()
					.isString().withMessage('Ingresa una cedula valida').bail()
					.custom(encuentraCedula).bail()
                    .matches("^[0-9]{7,8}$").withMessage('la cedula debe ser numerica entre 7 y 8 caracteres'),

	body('password').exists().withMessage('Password es requerido').bail()
					.isString().withMessage('Ingrese un password valido').bail()
					.isLength({min: 8}).withMessage('La contraseña debe tener al menos 8 caracteres')
                    .matches("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$").withMessage("el password debe tener al menos una minuscula, una mayuscula, un numero y un simbolo"),
    
    body('nombre').exists().withMessage('Nombre es requerido').bail()
					.isString().withMessage('Ingresa un nombre valido').bail()
                    .matches("^([\Na-zA-ZáéíóúÁÉÍÓÚñÑ ]+)$").withMessage('el nombre solo debe de tener letras'),
                    
    body('apellido').exists().withMessage('Apellido es requerido').bail()
					.isString().withMessage('Ingresa un apellido valido').bail()
                    .matches("^([\Na-zA-ZáéíóúÁÉÍÓÚñÑ ]+)$").withMessage('el apellido solo debe de tener letras'),     
]

// funcion para saber si el token es valido
const auth = passport.authenticate('jwt', {session: false});

module.exports = {
    validarCrearCuenta,
    auth
}