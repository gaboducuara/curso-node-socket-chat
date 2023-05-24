const jwt = require('jsonwebtoken')

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
module.exports = {
    generarJWT
}