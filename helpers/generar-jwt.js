const { check } = require('express-validator');
const jwt = require('jsonwebtoken')
const { user } = require('../models')

const generarJWT = ( uid = '') => {

return new Promise ( (resolve , reject) => {

    const payload = { uid };

    jwt.sign(payload , process.env.SECRETORPRIVATEKEY , {
        expiresIn : '30d'
    } , (err, token ) => {
        
        if(err ) {
            console.log(err);
            reject('No se pudo generaer el Token')
        } else {
            resolve(token);
        }
    }) 
})
}

const checkJWT = async ( token = '') => {

    try {
        if (token.length  < 10) {
            return null;
        }
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        const usuario = await user.findById( uid );

        if ( usuario ) {
            if (usuario.state) {
                return usuario;
            } else {
                return null;
            }
        } else {
            return null;
        }

    } catch (error) {
        return null;
    }

}

module.exports = {
    generarJWT,
    checkJWT
}