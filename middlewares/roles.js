const { AccessControl } = require('accesscontrol');

const ac = new AccessControl();
//  creacion de los permisos que tiene cada rol
ac.grant('usuario')
    .updateOwn('usuario')
    .readOwn('usuario')
  	.readAny('encuesta')
  	.createAny('respuesta')
  .grant('moderador')
    .extend('usuario')
    .createAny('encuesta')
    .updateAny('encuesta')  
    .deleteAny('encuesta')
  .grant('admin')
    .extend('moderador')
    .createAny('usuario')
    .readAny('usuario')
    .updateAny('usuario')
    .deleteAny('usuario')


module.exports = ac;