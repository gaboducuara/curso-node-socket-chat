const mongoose = require('mongoose');
const Role = require('../models');
const { user ,  Category ,  Product} = require('../models');


const esRolValido = async (rol = '') => {
       // verificar si el Rol existe
    const existeRol = await Role.findOne({ rol })
    if (!existeRol) {
      throw new Error(`El rol , ${ rol } no esta registrado en la base de datos`);
    }
  }

  const EmailExiste = async ( email = '') => {
     // verificar si el correo existe
    const existeEmail = await user.findOne ({ email })
    if ( existeEmail ) {
      throw new Error(`El Email: ${ email } , ya esta registrado`)
    }
  }

  // -----> Validadores de usuario
  const UserById = async ( id ) => {
    // verificar si el Usuario existe
   if ( mongoose.Types.ObjectId.isValid (id)) {
     const existeId = await user.findById ( id )

     if ( !existeId ) {
      throw new Error(`El Id ${ id } no existe en la base de datos `)
   }   
   } else {
    throw new Error(`El Id ${ id } no es valido`)
 
   }
 }

 // -----> Validadores de categorias
 const CategoryById = async ( id ) => {
  // verificar si el Usuario existe
 if ( mongoose.Types.ObjectId.isValid (id)) {
   const existeId = await Category.findById ( id )

   if ( !existeId ) {
    throw new Error(`El Id ${ id } no existe en la base de datos `)
 }   
 } else {
  throw new Error(`El Id ${ id } no es valido`)

 }
}

// ---------> validadores de productos
const productById = async ( id ) => {
    // verificar si el Usuario existe
 if ( mongoose.Types.ObjectId.isValid (id)) {
  const existeId = await Product.findById ( id )

  if ( !existeId ) {
   throw new Error(`El Id ${ id } no existe en la base de datos `)
}   
} else {
 throw new Error(`El Id ${ id } no es valido`)

}
}

/* Validar colecciones permitidas*/
const coleccionesPermitidas = ( coleccion = '' , colecciones = []) => {

  const incluida = colecciones.includes(coleccion);
  if(!incluida) {
    throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
  }
  return true;
}

  module.exports = {
    esRolValido,
    EmailExiste,
    UserById,
    CategoryById,
    productById,
    coleccionesPermitidas
  }