const express = require("express");
const router = express.Router();
const Cart = require("../Models/cart");
const Customer = require("../Models/customer");
const Invoice = require("../Models/billing");
// const disCountCalculator = require('../Utils/discountCalc')

router.post("/:id", async (req, res) => {
  const amount = Number.parseInt(req.body.amount);
  try {
    const cart = await Cart.findById(req.params.id).populate(
      "items.product",
      "name price"
    );
    if (!cart)
      return res
        .status(404)
        .json({ message: "Please add something to your cart first !" });
    const customer = await Customer.findById(cart.customer);

    //Keeping the tax rates 6% (default) for example
    const finalTotal = cart.total + (cart.total * 6) / 100 - (cart.total / 100) * cart.discount;

    // Creating invoice
    await Invoice.create({
      customer: cart.customer,
      items: cart.items,
      total: cart.total,
      discount: cart.discount,
      finalTotal: Math.round(finalTotal),
      paidAmount: amount,
      dueAmount: Math.round(finalTotal - amount + customer.dueAmount),
    });

    //Updating the shopping history and due Amount of the customer (if any)
    await Customer.findByIdAndUpdate(cart.customer, {
      $inc: {
        dueAmount: Math.round(finalTotal - amount),
        shoppingCount: 1,
      },
    });

    //Clearing Cart after a Final Transaction
    await Cart.findByIdAndDelete(req.params.id);

    // Format the bill
    let itemLines = [];
    cart.items.forEach((item, i) => {
      itemLines.push(
        `${i + 1}. ${item.product.name} - ₹${item.product.price} x ${
          item.quantity
        } = ₹${item.product.price * item.quantity}`
      );
    });

    const billText = `🧾 Invoice

    Customer: ${customer.name} - ${customer.contact}

    Items:
    ${itemLines.join("\n")}

    ----------------------------------
    Total: ₹${cart.total}
    Discount: ₹${cart.discount}
    Final Total: ₹${finalTotal}
    Paid: ₹${amount}
    Due: ₹${Math.round(finalTotal - amount + customer.dueAmount)}
    ----------------------------------

    Thank you for shopping! Visit again.`;

    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(billText);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something Went Wrong !", error: err.message });
  }
});

module.exports = router;
