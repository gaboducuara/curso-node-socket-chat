const { response } = require("express");


 /// ------> validando que el archivo imagen esta cargado
const ValidateArchiveUpload = (req, res = response, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).json({
      msg: "No hay archivos que subir - validarArchivoSubir",
    });
  }

  next();
};

module.exports = {
    ValidateArchiveUpload
};
