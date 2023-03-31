const mongoose = require("mongoose");
// funcion para realizar la conexion a la base de datos
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);

    console.log("conectado a la base de datos");
  } catch (error) {
    console.log(error);
    throw new Error("Error al iniciar la base de datos");
  }
};

module.exports = dbConnection;
