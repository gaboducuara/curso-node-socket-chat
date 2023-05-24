const { response } = require("express");

// importacion que trae las funciones de mongo
const { ObjectId } = require('mongoose').Types

const { user, Category , Product} = require('../models')

const coleccionesPermitidas = [
    'user',
    'category',
    'product',
    'roles'
];

const buscarUser = async (termino = '' , res = response ) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const SearchUser = await user.findById(termino)
        return res.json({
            // metodo ternario
            //Si es el usuario existe , entonces retornare 
            //el arreglo con el usuario en caso contrario retornare 
            //un arreglo vacio
            results: (SearchUser) ? [ SearchUser ] : []
        })
    }

    // Metodo de expresion regular ---> profundisar en el tema.
    const regex = new RegExp (termino , 'i');
    // const terminoUser = await user.count({
    //     $or: [{name: regex} , {email: regex}],
    //     $and: [{state: true}]
    const terminoUser = await user.find({
    $or: [{name: regex} , {email: regex}],
    $and: [{state: true}]
})
    res.json({
        results: terminoUser 
    });

}

const buscarCategory = async (termino = '' , res = response ) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const SearchCategory = await Category.findById(termino)
        return res.json({
            // metodo ternario
            //Si es el usuario existe , entonces retornare 
            //el arreglo con el usuario en caso contrario retornare 
            //un arreglo vacio
            results: (SearchCategory) ? [ SearchCategory ] : []
        })
    }

    // Metodo de expresion regular ---> profundisar en el tema.
    const regex = new RegExp (termino , 'i');
    // const terminoUser = await user.count({
    //     $or: [{name: regex} , {email: regex}],
    //     $and: [{state: true}]
    const terminoCategory = await Category.find({name: regex , state: true});
    res.json({
        results: terminoCategory
    });

}

const buscarProduct = async (termino = '' , res = response ) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const SearchProduct = await Product.findById(termino)
                                .populate('category', 'name')
        return res.json({
            // metodo ternario
            //Si es el usuario existe , entonces retornare 
            //el arreglo con el usuario en caso contrario retornare 
            //un arreglo vacio
            results: (SearchProduct) ? [ SearchProduct ] : []
        })
    }

    // Metodo de expresion regular ---> profundisar en el tema.
    const regex = new RegExp (termino , 'i');
    // const terminoUser = await user.count({
    //     $or: [{name: regex} , {email: regex}],
    //     $and: [{state: true}]
    const terminoProduct = await Product.find({name: regex , state: true})
                                .populate('category', 'name')

    res.json({
        results: terminoProduct
    });

}

const buscar = (req , res = response ) => {

    const {colleccion , termino} = req.params

    if(!coleccionesPermitidas.includes(colleccion)) {
        return res.status(400).json({
            msg:`Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (colleccion){
        case 'user':
            buscarUser(termino , res)
        break;
        case 'category':
            buscarCategory(termino , res)
        break;
        case 'product':
            buscarProduct(termino , res)
    break;

    default:
        res.status(500).json({
            msg: 'Se le olvido hacer esta busqueda'
        })
}
}
module.exports = {
    buscar
}