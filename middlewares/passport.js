const { Strategy, ExtractJwt} = require('passport-jwt');

// funcion para crear el token con los datos del usuario que inicia sesion 
const Usuario = require('../models/Usuario');

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_KEY
}

const strategy =  new Strategy(opts, async (payload, done) => {

	try{
		const usuariodata = await Usuario.findById(payload.id);
		// se extraen los datos necesarios para enviarlos a la data del token
		const { password, createdAt, updatedAt, ...usuario } = usuariodata.toObject();
		if (usuario) {
			return done(null, usuario);
		}

		return done(null, false);
	}catch(error){
		console.log(error)
	}
})

module.exports = strategy;