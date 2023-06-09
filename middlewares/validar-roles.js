const { response, request } = require('express') 
// const user = require('../models/user')


const esAdminRole = ( req = request , res = response , next ) => {
    if(!req.user) {
        return res.status(500).json({
            msg:'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { rol , name } = req.user;
    
    if ( rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `El ${ name } No es administrador - No puede hacer esto`,
        })
    }
    next();
}

const tieneRole = ( ...roles ) => {
    return ( req, res = response , next ) => {
        console.log(roles)
        if( !req.user ) {
            return res.status(500).json({
                msg:'Se quiere verificar el role sin validar el token primero'
            });
        }

        if ( !roles.includes (req.user.rol)) {
            return res.status(401).json({
                msg:`El servicio requiere uno de estos roles ${ roles }`
            });
        }

        next();
    }

}

module.exports = {
    esAdminRole,
    tieneRole
}