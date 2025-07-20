const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    contact :{
        type : String,
        required : true,
        minlength : 10,
    },
    shoppingCount : {
        type : Number,
        default : 0
    },
    dueAmount : {
        type : Number,
        default : 0
    }
})

const Customer = mongoose.model("customers", customerSchema);
module.exports = Customer;