const { response } = require("express");
const bcryptjs = require('bcryptjs');

//models
const user = require('../models/user');

//Helpers
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

// ------------------USUARIO LOGIN ----------------------//

const login = async (req, res = response) => {

  const { email, password } = req.body;

  try {
    // Verificar si el email existe
    const Userlogin = await user.findOne({ email });
    if (!Userlogin) {
      return res.status(400).json ({ 
        msg:'Usuario / Password no son correctos - email'
      });
    }
    // Si el usuario esta activo
    if (!Userlogin.state) {
      return res.status(400).json ({
        msg:`Usuario / Password no son correctos - status:${Userlogin.status}`
      });
    }
    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync( password , Userlogin.password)
    if(!validPassword) {
      // console.log(validPassword)
      return res.status(400).json ({
        msg:`Usuario / Password no son correctos - El password es ${validPassword}`
      });
    }

    //  Generar el JWT
      const token = await generarJWT(Userlogin.id);

    res.json({
      Userlogin,
      token
      
    });

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      msg:'Hable con el administrador'
    })
  }
};

// -------------USUARIO GOOGLE -------------------------//

const googleSingIn =  async (req, res = response , next ) => {
  
  const { id_token } = req.body;

  try {

    const { email, img , name } = await googleVerify( id_token )

    let Usergoogle = await user.findOne({ email });
    // console.log( Usergoogle )

    if ( !Usergoogle ) {
          // Tengo que crearlo
          const data = {
            name, 
            email, 
            password: ':P',
            rol:'USER_ROLE',
            img,
            google:true, 
          }


          // ----------- aqui se guarda el usuario ------- //
          Usergoogle = new user(data);
          await Usergoogle.save()
        }

        // Es para verificar si el usuario esta en la base de datos 

        if(!Usergoogle.state) {
          return res.status(401).json ({ 
            msg:'Hable con el administrador, usuario bloqueado'
          });
        }

        //  Generar el JWT
    const token = await generarJWT(Usergoogle.id);

    res.json({
      msg:'Todo bien google sing In',
      Usergoogle,
      token
    })

  } catch (err) {
    return res.status(400).json({
      ok: false, 
      msg:'El token no se pudo verificar'
    })
  }
}



module.exports = {
  login,
  googleSingIn
};
