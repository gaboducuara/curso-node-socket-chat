const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config.js");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    //Rutas disponibles e existentes en la aplicacion
    this.paths = {
      auth: '/api/auth',
      buscar: '/api/buscar',
      categorias: '/api/category',
      productos:  '/api/product',
      usuarios: '/api/usuarios',
      uploads: '/api/uploads'
    }
    // Conectar a base de datos
    this.conectarDB()

    //Middlewares ---> siempre se ejecutara cuando levantemos nuestro servidor;
    this.middlewares();
    //Rutas de mi aplicacion
    this.routes();
  }

  async conectarDB() {
    await dbConnection()
  }

  middlewares() {
    //CORS
    this.app.use(cors());
    // parseo y lectura del body, cualquier informacion que venga con POST, PUT, PATCH, DELETE .. la intenta serializar en formato JSON
    this.app.use(express.json())
    //Directorio publicos
    this.app.use(express.static("public"));

    //Fileupload - Carga de archivos
    this.app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
      createParentPath: true
    }))
  }

  routes() {
    this.app.use(this.paths.usuarios, require('../routes/user.js'));      
    this.app.use(this.paths.auth, require('../routes/auth.js'));
    this.app.use(this.paths.buscar, require('../routes/buscar.js'));
    this.app.use(this.paths.categorias, require('../routes/categories.js'))
    this.app.use(this.paths.productos, require('../routes/product.js'))
    this.app.use(this.paths.uploads, require('../routes/uploads.js'));
  };
  listen() {
    this.app.listen(this.port, () => {
      console.log("servidor corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
