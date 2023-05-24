const mongoose = require('mongoose')
const bcryptjs = require("bcryptjs");
const { response, request } = require("express");

const { Product } = require("../models");

const ProductGet = async (req = request, res = response) => {
    // const { page = 1, limit = 10, q, nombre = 'not name', apikey} = req.query;
    const { limite = 20 , desde = 0 } = req.query;
    const query = { state:true };
    // const {id, name, apellido, comentario} = req.body
  const [total , product] = await Promise.all
  // console.log(user)
  ([
    Product.countDocuments(query),
    Product.find(query)
        .populate('user' , 'name')
        .populate('category','name')
        .skip(Number( desde ))
        .limit(Number(limite))
  ])
// console.log(user)
    res.json({
      msg: "get productos - controlador",
      total , product
    });
};

const ProductGetById = async (req = request, res = response) => {
    const { id } = req.params;
    const productId = await Product.findById( id )
        .populate('user' , 'name')
        .populate('category' , 'name');

    res.json( productId )
    
};

const CreatePostProduct = async (req = request, res = response) => {
    const { state, user, ...body } = req.body;
    const productDB = await Product.findOne({ name: body.name });
  
    if (productDB) {
      return res.status(400).json({
        msg: `El producto ${productDB.name} , ya existe`,
      });
    }
  
    //Generar la Data a guardar
    const Productdata = {
        ...body,
      name: body.name.toUpperCase(),
      user: req.user._id,
    //   category: req.Category._id
    };
  
    const DataProduct = new Product(Productdata);
  
    //GuardarDB
    await DataProduct.save();
  
    res.status(201).json(DataProduct);
  };


  const ProductPut = async (req = request, res = response) => {
    const {id} = req.params
    const { state, user, ...Productdata} = req.body;

    if (Productdata.name){
        Productdata.name = Productdata.name.toUpperCase();
    }
    Productdata.user = req.user._id;

    const producto = await Product.findByIdAndUpdate(id, Productdata, {new: true});
    res.json(producto);
  };

// Eliminar categoria
const ProductDelete = async (req = request, res = response) => {
    const { id } = req.params;

    // state category to false
    const DeleteProduct = await Product.findByIdAndUpdate( id , {state: false} , {new: true});
    res.json( DeleteProduct );
};

module.exports = {
    ProductGet,
    ProductGetById,
    CreatePostProduct,
    ProductPut,
    ProductDelete
}