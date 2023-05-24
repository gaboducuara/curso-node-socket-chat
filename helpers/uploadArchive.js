const path = require('path')
const { v4: uuidv4 } = require('uuid')
// Aqui definimos las extensiones con las que deseamos trabajar en nuestro proyecto.


const uploadArchive = ( files , extensionValidate = ["jpeg", "gif", "png", "jpg"], carpeta = '') => {

  return new Promise((resolve, reject) => {

    const { archivo } = files;
    const nombreCortado = archivo.name.split('.');
    // console.log(nombreCortado)
    const extension = nombreCortado[nombreCortado.length - 1];

    // Aqui validamos los terminos o datos que queremos
    if (!extensionValidate.includes(extension)) {
        return reject(`La extension ${extension} no es permitida, son permitidas las siguientes extensiones ${extensionValidate}`)
    }

    const nombreTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
            reject(err);
      }
      resolve(nombreTemp);
    });
  });
};

module.exports = {
  uploadArchive,
};
