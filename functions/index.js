const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51HWbYIGYpJ2O5MWlgFt2SovBKGuxKLvpbFl61JqUfr5na39SteepR61z31q5OliNfmEaqCYkskCAMYu0xYUUqlVe00TGPyqkBl"
);

// - API

// - App config
const app = express();

// - Middlewares
app.use(cors({ origin: true }));
app.use(express.json());

// - Api routes
app.get("/", (req, res) => res.status(200).send("hello ashhar"));

app.post("/payments/create", async (req, res) => {
  const total = req.query.total;
  let clientSecret;

  console.log("Payment request received >>>", total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
  });

  try {
    clientSecret = paymentIntent.client_secret;
  } catch (error) {
    res.status(400).send("error while fetching client secret", error);
  }

  res.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});
// - listen command
exports.api = functions.https.onRequest(app);

// Example exdpoint
// http://localhost:5001/clone-abac6/us-central1/api
