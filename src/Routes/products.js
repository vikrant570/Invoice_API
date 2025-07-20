const express = require("express");
const router = express.Router();
const Product = require("../Models/products");
const Customer = require("../Models/customer");
const Cart = require("../Models/cart");

router.get("/", async(req, res)=>{
  const products = await Product.find().lean();
  res.json({message : "10% off on first shopping", products});
})

// Viewing cart
router.get("/cart", async (req, res) => {
  const { contact } = req.query;
  try {
    const customer = await Customer.findOne({ contact });
    if (!customer)
      return res.status(404).json({
        message:
          "Look like you are a new customer. Explore products to add them to your cart.",
      });

    const cart = await Cart.findOne({ customer: customer._id })
      .populate("customer", "name -_id")
      .populate("items.product", "name price -_id")
      .lean();

    if (!cart){
      return res.status(404).json({
        message: `Hey ${customer.name} ! Looks like you haven't added anything your cart yet.`,
      });
    }

    //Just the format for better output cart list
    let itemsList = [];
    cart?.items?.forEach((item, index) => {
      itemsList.push(
        `${index + 1}. ${item.product?.name} - Price: ₹${
          item.product?.price
        } - Quantity: ${item.quantity}`
      );
    }); 

    //Final Total after all discounts and taxes
    const finalTotal = Math.round((cart.total + cart.total*6/100 - (cart.total/100)*cart.discount))

    const formattedCart = `Customer: ${
      cart?.customer?.name
    }\n\nID - ${cart._id}\nUse this ID for checkout.\n\nItems:\n${itemsList.join("\n")}\n\nTotal - ₹${cart.total}\n${cart.discount != 0 ? `Hurray you got ${cart.discount}% discount` : "Shop more to unlock discount benifits."}\nTaxes & charges - ₹${cart.total*6/100}\n\nAmount to be paid : ${finalTotal}`;

    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(formattedCart);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong !" , error : err.message});
  }
});

//Adding new product in the cart
router.post("/cart/:id", async (req, res) => {
  const { name, contact, quantity } = req.body;
  const product = await Product.findById(req.params.id);

  try {
    let customer = await Customer.findOne({ contact });

    //Creating new customer if he/she doesn't exists
    if (!customer) {
      customer = await Customer.create({
        name,
        contact,
      });
    }

    let cart = await Cart.findOne({ customer: customer._id });

    // Giving discount to customers on the basis of their shopping frequency. (10% on first shopping)
    let discount = 0;
    if (customer.shoppingCount == 0) {
      discount = 10
    } else if (customer.shoppingCount >= 2) {
      discount = 2
    } else if (customer.shoppingCount >= 6) {
      discount = 5
    } else if (customer.shoppingCount > 8){
      discount = 7
    }

    if (!cart) {
      cart = await Cart.create({
        customer: customer._id,
        items: {
          product: req.params.id,
          quantity: quantity,
        },
        discount : discount,
        total: product.price * quantity,
      });
      return res
        .status(201)
        .json({ message: `Item added to cart total value (Exc. taxes & discounts): ${cart.total}` });
    }

    const existingProduct = cart.items.find(
      (item) => item.product.toString() === req.params.id
    );

    if (existingProduct) {
      const updateExistingProduct = await Cart.findOneAndUpdate(
        { customer: customer._id, "items.product": req.params.id },
        //Only add a new new product if its not in the cart, otherwise just update its quanity
        {
          $inc: {
            "items.$.quantity": quantity,
            total: product.price * quantity,
          },
        },
        { new: true }
      );
      return res
        .status(201)
        .json({
          message: `Item added to cart, total value (Exc. taxes & discounts) ${updateExistingProduct.total}`,
        });
    }

    // If the product doesn't exist then will add new item in the list
    const updateCart = await Cart.findOneAndUpdate(
      { customer: customer._id },
      {
        $push: {
          items: {
            product: req.params.id,
            quantity: quantity,
          },
        },
        $inc: {
          total: product.price * quantity,
        },
      },
      { new: true }
    );

    res.status(201).json({
      message: `Item added to cart, Total value : ${updateCart.total}`,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something Went Wrong !", error: err.message });
  }
});

// (Optional for clearing the cart)
router.delete("/cart/:id", async (req, res) => {
  const cart = await Cart.findByIdAndDelete(req.params.id)
  if (!cart) return res.status(404).json({ message: "Nothing to remove !" });
  res.status(201).json({ message: "Cart Cleared Successfully" });
});

module.exports = router;
