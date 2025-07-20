const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "customers"
    },
    items : [
        {
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "products"
            },
            quantity : {
                type : Number,
                required : true
            }
        }
    ],
    discount : Number,
    total : Number
})

const Cart = mongoose.model('cartitems',cartSchema);
module.exports = Cart