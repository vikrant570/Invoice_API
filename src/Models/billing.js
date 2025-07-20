const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
  },
  items: Array,
  total: Number,
  discount: Number,
  taxes : {
    type : String,
    default : "6% GST & Inc."
  },
  finalTotal: Number,
  paidAmount : Number,
  dueAmount : Number
},
{timestamps : true});

const Invoice = mongoose.model("invoices", invoiceSchema);
module.exports = Invoice;
