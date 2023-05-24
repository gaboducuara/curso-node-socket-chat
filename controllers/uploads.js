const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)
const { response } = require("express");
const { uploadArchive } = require("../helpers");
const { user, Product} = require('../models')

const cargarArchivo = async (req, res = response) => {

  try {
    // Se suben imagenes al path
  const name = await uploadArchive(req.files , undefined , 'imgs');
  res.json({name})
  } catch (msg) {
    res.status(400).json({msg})
  }
};

// ----------------------> Actualizar las imagenes de product y user
// const updateImage = async (req , res = response) => {
  
//   const { id , coleccion } = req.params;

//   let modelo 

//   switch (coleccion) {
//     case 'user':
//         modelo = await user.findById(id);
//         if (!modelo) {
//           return res.status(400).json({
//             msg: `No existe un usuario con el id ${id}`
//           });
//         }
//     break;

//     case 'product':
//         modelo = await Product.findById(id);
//         if ( !modelo) {
//           return res.status(400).json({
//             msg: `No existe un producto con el id ${id}`
//           });
//         }
//     break;

//     default:
//       return res.status(500).json({msg: 'Se me olvido validar esto'});
//   }

//   // Limpiar imagenes previas
//   if (modelo.img) {
//     const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);
//     if (fs.existsSync( pathImagen )) {
//       fs.unlinkSync ( pathImagen );
//     }
//   }

//   // Aqui se guardan las imagenes en carpetas prediseñadas
//   const name = await uploadArchive(req.files , undefined , coleccion);
//   modelo.img = name;
  
//   await modelo.save();
  
//   res.json(modelo)
// }

const updateImageCloudinary = async (req , res = response) => {
  
  const { id , coleccion } = req.params;

  let modelo 

  switch (coleccion) {
    case 'user':
        modelo = await user.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${id}`
          });
        }
    break;

    case 'product':
        modelo = await Product.findById(id);
        if ( !modelo) {
          return res.status(400).json({
            msg: `No existe un producto con el id ${id}`
          });
        }
    break;

    default:
      return res.status(500).json({msg: 'Se me olvido validar esto'});
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    const nameArr = modelo.img.split('/');
    const name = nameArr[ nameArr.length - 1];
    const [ public_id ] = name.split('.')
    cloudinary.uploader.destroy( public_id );
  }

  const { tempFilePath } = req.files.archivo
  const {secure_url} = await cloudinary.uploader.upload( tempFilePath )
  modelo.img = secure_url;

  await modelo.save();

  res.json(modelo)
}










/// ----------------> Mostrando las imagenes -> GET - Img

const mostrarImg = async (req , res = response ) => {

  const { id , coleccion } = req.params;

  let modelo 

  switch (coleccion) {
    case 'user':
        modelo = await user.findById(id);
        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${id}`
          });
        }
    break;

    case 'product':
        modelo = await Product.findById(id);
        if ( !modelo) {
          return res.status(400).json({
            msg: `No existe un producto con el id ${id}`
          });
        }
    break;

    default:
      return res.status(500).json({msg: 'Se me olvido validar esto'});
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync( pathImagen )) {
      return res.sendFile (pathImagen)
    }

  }
    const pathImagen = path.join( __dirname, '../assets/no-image.jpg');
    res.sendFile( pathImagen );
  // // Aqui se guardan las imagenes en carpetas prediseñadas
  // const name = await uploadArchive(req.files , undefined , coleccion);
  // modelo.img = name;
  // await modelo.save();
  // res.json(modelo)

}

module.exports = {
  cargarArchivo,
  updateImageCloudinary,
  mostrarImg
};