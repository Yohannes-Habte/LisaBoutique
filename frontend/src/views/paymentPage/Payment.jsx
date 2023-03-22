/** 
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../../components/checkoutSteps/CheckoutSteps';
import {
  ACTION_STORE,
  myContext,
} from '../../components/storeProvider/StoreProvider';
import './Payment.scss';

const Payment = () => {
  // navigate to Order page
  const navigate = useNavigate();

  const { state, dispatch: contextDispatch } = useContext(myContext);
  const {
    userInfo,
    cart: { shippingAddress, paymentMethod },
  } = state;
  // State variables
  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || 'PayPal'
  );

  // If shipping address does not exist, then navigate to shipping
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);
  // Submit Payment
  const submitPayment = (e) => {
    e.preventDefault();

    contextDispatch({
      type: ACTION_STORE.PAYMENT_METHOD,
      payload: paymentMethod,
    });
    //! payment-step1: Save payment method in the local storage
    localStorage.setItem("paymentMethod", JSON.stringify(paymentMethodName));
    
    navigate("/placeorder")
  };

  return (
    <main className="payment-page">
      <Helmet>
        <title> Payment Method </title>
      </Helmet>

      <CheckoutSteps step1 step2 step3></CheckoutSteps>

      <section className="payment-container">
        <h1 className="payment-title"> Payment Method </h1>

        <form action="" onSubmit={submitPayment} className="payment-form">
          <div className="input-label">
            <input
              type="radio"
              name="PayPal"
              id="PayPal"
              onChange={(e) => setPaymentMethodName(e.target.value)}
              checked={paymentMethodName === 'PayPal'}
              value={"PayPal"}
            />
            <label htmlFor="PayPal"> PayPal </label>
          </div>

          <div className="input-label">
            <input
              type="radio"
              name="Stripe"
              id="Stripe"
              onChange={(e) => setPaymentMethodName(e.target.value)}
              checked={paymentMethodName === 'Stripe'}
              value={"Stripe"}
            />
            <label htmlFor="stripe"> Stripe </label>
          </div>

          <button className="payment-btn"> Next </button>
        </form>
      </section>
    </main>
  );
};

export default Payment;
*/

import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../../components/checkoutSteps/CheckoutSteps';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { ACTIONS, ACTION_STORE, myContext, Store } from '../../components/storeProvider/StoreProvider';
import "./Payment.scss";

const Payment = () => {
  const navigate = useNavigate();
  const { state, dispatch: contextDispatch } = useContext(myContext);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

  // useEffect
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  // Submit payment
  const submitPayment = async (e) => {
    e.preventDefault();
    contextDispatch({ type: ACTION_STORE.PAYMENT_METHOD, payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };
  return (
    <main className='payment-page'>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <section className='payment-container'>
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className='payment-title'>Payment Method</h1>

        <Form onSubmit={submitPayment} className="payment-form">
          <div className="mb-3">
            <Form.Check
              type="radio"
              id="payPal"
              label="payPal"
              value="payPal"
              checked={paymentMethodName === 'payPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </div>

          <div className="mb-3">
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </div>
          <div className="mb-3">
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </section>
    </main>
  );
};

export default Payment;

