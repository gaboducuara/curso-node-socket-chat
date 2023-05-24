const bcryptjs = require('bcryptjs');
const { response , request} = require('express');
const User = require('../models/user');


const userGet = async (req = request, res = response) => {

    // const { page = 1, limit = 10, q, nombre = 'not name', apikey} = req.query;
    const { limite = 20 , desde = 0 } = req.query;
    const query = { status:true };
    // const {id, name, apellido, comentario} = req.body
  const [total , user] = await Promise.all
  // console.log(user)
  ([
    User.countDocuments(query),
    User.find(query)
        .skip(Number( desde ))
        .limit(Number(limite))
  ])
// console.log(user)
    res.json({
      msg: "get usuario - controlador",
      total , user
      // q, nombre , apikey, page, limit
    });
  }


  const userPost = async (req, res = response)  => {

    const {name, email , password , rol} = req.body
    const user = new User({name, email , password , rol});

    // encriptar contraseña
    const salt = bcryptjs.genSaltSync(12);
    user.password = bcryptjs.hashSync( password , salt);

    // guardar en base de datos
    await user.save();

    res.status(201).json({
      msg: "Post usuario - controlador",
      user
    });
  }

  const userPut = async (req, res = response) => {
    //forma 1 
    // const id = req.params.id
    //forma 2
    const {id} = req.params
    const { _id, password , google, email , ...resto} = req.body;

    // validar informacion procedente de la base de datos
    if ( password ) {
      // encriptar contraseña
        const salt = bcryptjs.genSaltSync(12);
        resto.password = bcryptjs.hashSync( password , salt);
    }

    const userdb = await User.findByIdAndUpdate( id, resto );

    res.status(200).json(userdb);
  }

  const userDelete = async (req, res = response) => {

    const { id } = req.params;
    // const uid = req.uid;

    //Eliminar usuario Fisicamente
    // const user = await User.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate( id , {state: false});
    // el usuario autenticado se encuentra en la request
    // const usuarioAutenticado = req.user;

    res.json({
      // msg: "peticion delete a mi API,
      user,
      // usuarioAutenticado
    });
  }

  const userPatch = (req, res = response) => {
    res.json({
      msg: "peticion patch a mi API",
    });
  }

  module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete,
    userPatch
  }