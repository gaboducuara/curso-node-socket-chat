const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user');


const validarjwt = async ( req = request, res = response , next ) => {
    const token = req.header('x-token');

    if (!token) {
        return  res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {
        
        const { uid } = jwt.verify(token , process.env.SECRETORPRIVATEKEY);

            // leer el USUARIO que corresponde al uid
        const user = await User.findById( uid );

        if(!user) {
            return res.status(401).json({
                msg:'Token no valido - Usuario no existe en base de datos'
            })
        }
    
        //Verificar si el uid tiene estado en true;
        if (!user.state) {
            return res.status(401).json({
                msg:'Token no valido - Usuario con status : false'
            })
        }
        req.user = user;
        // console.log(payload)
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }

    // next();
}

module.exports = {
    validarjwt
}