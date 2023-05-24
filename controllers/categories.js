const mongoose = require('mongoose')
const bcryptjs = require("bcryptjs");
const { response, request } = require("express");

// const {Category} = require("../models/category_models");
const { Category } = require("../models");

//  Obtener todas las categorias
const CategoryGet = async (req = request, res = response) => {
    // const { page = 1, limit = 10, q, nombre = 'not name', apikey} = req.query;
    const { limite = 20 , desde = 0 } = req.query;
    const query = { state:true };
    // const {id, name, apellido, comentario} = req.body
  const [total , categories] = await Promise.all
  // console.log(user)
  ([
    Category.countDocuments(query),
    Category.find(query)
        .populate('user' , 'name')
        .skip(Number( desde ))
        .limit(Number(limite))
  ])
// console.log(user)
    res.json({
      msg: "get categoria - controlador",
      total , categories
    });
};

                          // Obtener categoria por ID
const CategoryGetById = async (req = request, res = response) => {
    const { id } = req.params;
    const categoryId = await Category.findById( id )
        .populate('user' , 'name');
    res.json( categoryId )
    
};

                          // Crear categoria
const CreatePostCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();
  const categoryDB = await Category.findOne({ name });

  if (categoryDB) {
    return res.status(400).json({
      msg: `La categoria ${categoryDB.name} , ya existe`,
    });
  }

  //Generar la Data a guardar
  const data = {
    name,
    user: req.user._id
  };

  const DataCategory = new Category(data);

  //GuardarDB
  await DataCategory.save();

  res.status(201).json(DataCategory);
};

                          // actualizar categoria
const CategoryPut = async (req = request, res = response) => {
    const {id} = req.params
    const { state, user, ...data} = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const categoria = await Category.findByIdAndUpdate(id, data, {new: true});
    res.json(categoria);
  };

// Eliminar categoria
const CategoryDelete = async (req = request, res = response) => {
    const { id } = req.params;

    // state category to false
    const DeleteCategory = await Category.findByIdAndUpdate( id , {state: false} , {new: true});
    res.json( DeleteCategory );
};

module.exports = {
  CategoryGet,
  CategoryGetById,
  CreatePostCategory,
  CategoryPut,
  CategoryDelete,
};
