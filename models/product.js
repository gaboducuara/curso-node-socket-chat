// const mongoose = require('mongoose');
const {Schema , model } = require('mongoose');

const ProductSchema = Schema ({
    name: {
        type: String, 
        required: [true , 'El nombre es obligatorio'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    user : {
        type: Schema.Types.ObjectId,
        ref:'user',
        required: true
    }, 
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true
    },
    description: {
        type: String
    },
    // disponibilidad
    availability: {
        type: Boolean,
        default: true
    },

    img: { type: String }

});

ProductSchema.methods.toJSON = function() {
    const { __v, state, ...Productdata} = this.toObject();
    return Productdata;
}

module.exports = model('Product' , ProductSchema);