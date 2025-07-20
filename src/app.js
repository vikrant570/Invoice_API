const express = require('express');
const app = express();
const mongoose = require('mongoose');
const productRouter = require('./Routes/products');
const checkoutRouter = require('./Routes/checkout');

app.use(express.json());

app.use("/api/products", productRouter)
app.use("/api/checkout",checkoutRouter)

app.listen(8000, ()=>{
    async function myDB(){
        await mongoose.connect("mongodb://localhost:27017/test");
    }
    myDB()
    console.log("Server is running at port 8000")
})