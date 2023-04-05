const mongoose = require('mongoose');


//url de conexion para toda base de datos;
//protocolo://user:password@host:puerto/nombre_bd

mongoose.connect(process.env.DB_HOST + process.env.DB_NAME);