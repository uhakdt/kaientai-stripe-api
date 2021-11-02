const express = require("express");
require("dotenv").config();
const Stripe = require("stripe");

const app = express();
const port = 3000; //add your port here
const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

//Confirm the API version from your stripe dashboard
const stripe = Stripe(SECRET_KEY, { apiVersion: "2020-08-27" });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:3000`);
});

app.post("/create-payment-intent/:totalPrice", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.params.totalPrice, //lowest denomination of particular currency
      currency: "gbp",
      payment_method_types: ["card"], //by default
    });

    const clientSecret = paymentIntent.client_secret;

    res.json({
      clientSecret: clientSecret
    });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
});