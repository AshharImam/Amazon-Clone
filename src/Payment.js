import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import CurrencyFormat from "react-currency-format";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import { getBasketTotal } from "./reducer";
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";
import axios from "./axios";
import { db } from "./firebase";
import "./Payment.css";

const Payment = () => {
  const [{ basket, user }, dispatch] = useStateValue();

  const history = useHistory();

  const [processing, setProcessing] = useState("");
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const getClientSecret = async () => {
      const response = await axios({
        method: "post",
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
      });

      setClientSecret(response.data.clientSecret);
    };

    getClientSecret();
  }, [basket]);

  console.log("The SECRET IS >>>>", clientSecret);

  const handleSubmit = async (event) => {
    // handling stripevent
    event.preventDefault();
    setProcessing(true);
    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        // paymentInent = payment confirmation

        console.log(basket);

        // inserting order details into db
        db.collection("users")
          .doc(user?.uid)
          .collection("orders")
          .doc(paymentIntent.id)
          .set({
            basket,
            amount: paymentIntent.amount,
            created: paymentIntent.created,
          });

        // setting up the flags
        setSucceeded(true);
        setError(null);
        setProcessing(false);

        // Emptying the basket
        dispatch({
          type: "EMPTY_BASKET",
        });

        // replacing the /payment to /orders page
        history.replace("/orders");
      });
  };

  const handleChange = (event) => {
    // handling change in CardElement

    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  return (
    <div className="payment">
      <div className="payment__container">
        {/* payment section - delivery address */}
        <h1>Checkout {<Link to="/checkout">{basket?.length} items</Link>}</h1>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email}</p>
            <p>React Lane, 123</p>
            <p>Karachi, Pakistan</p>
          </div>
        </div>
        {/* payment section - Review items */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items & delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map((item) => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
        {/* payment section - payment method */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment method</h3>
          </div>
          <div className="payment__details">
            {/* Stripe Form */}
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />
              <div className="payment__priceDContainer">
                <CurrencyFormat
                  renderText={(value) => <h3>Total Order: {value}</h3>}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType="text"
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy now"}</span>
                </button>
              </div>
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
