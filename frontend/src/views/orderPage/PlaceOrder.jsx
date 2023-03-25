import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavLink, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../../components/checkoutSteps/CheckoutSteps';
import { ACTION_STORE } from '../../components/storeProvider/StoreProvider';
import { myContext } from '../../components/storeProvider/StoreProvider';
import './PlaceOrder.scss';
import GetError from '../../components/errors/GetError';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingBox from '../../components/loading/LoadingBox';

// Object for placing an order
const PLCING_ORDER = {
  ORDER_REQUEST: 'ORDER_REQUEST',
  ORDER_SUCCESS: 'ORDER_SUCCESS',
  ORDER_FAIL: 'ORDER_FAIL',
};
// reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case PLCING_ORDER.ORDER_REQUEST:
      return { ...state, loading: true };
    case PLCING_ORDER.ORDER_SUCCESS:
      return { ...state, loading: false };
    case PLCING_ORDER.ORDER_FAIL:
      return { ...state, loading: false };
    default:
      return state;
  }
};

const PlaceOrder = () => {
  const navigate = useNavigate();
  //! loading-step-1: loading is used below the placing an order button
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: contextDispatch } = useContext(myContext);
  const { cart, userInfo } = state;

  // Rounding to two decimal place
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  // total items' price
  cart.itemsPrice = round2(
    cart.cartItems.reduce((accu, curr) => accu + curr.quantity * curr.price, 0)
  );
  // shipping price
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  // Tax price
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  // overall total price
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  // useEffect
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);

  // Submit order function
  const submitOrder = async () => {
    const newOrder = {
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    };

    const settings = {
      headers: {
        authorization: `Bearer ${userInfo.token}`,
      },
    };

    try {
      dispatch({ type: PLCING_ORDER.ORDER_REQUEST });
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER_URL + '/api/orders',
        newOrder,
        settings
      );
      // Cart clear action using StoreProvider.jsx
      contextDispatch({ type: ACTION_STORE.CLEAR_CART });
      // successful order
      dispatch({ type: PLCING_ORDER.ORDER_SUCCESS });
      //! After placing an order, make the cart local storage empty
      localStorage.removeItem('cartItems');
      // Direct to the ordered details page
      navigate(`/order/${data.order._id}`);
    } catch (error) {
      dispatch({ type: PLCING_ORDER.ORDER_FAIL });
      toast.error(GetError(error));
    }
  };

  return (
    <main className="order-page">
      <Helmet>
        <title>Order Preview</title>
      </Helmet>

      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
      <section className="order-container">
        <h1 className="order-title"> General Order Preview </h1>
        <div className="order-details">
          <div className="ordered-items-address-payment">
            <article className="ordered-items">
              <h4>Shopping Items</h4>
              <div className="items-info">
                {cart.cartItems.map((item) => {
                  return (
                    <div key={item._id} className="item-container">
                      <div className="image-name">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="image"
                        />
                      </div>

                      <div className="name">
                        <NavLink to={`/product/${item.slug}`}>
                          {item.name}
                        </NavLink>
                      </div>

                      <div> {item.quantity} </div>

                      <div className="item-price"> ${item.price} </div>
                    </div>
                  );
                })}
                <NavLink to={'/cart'}> Edit</NavLink>
              </div>
            </article>

            <article className="shipping-address">
              <h4>Shipping</h4>
              <p>
                <strong>Name:</strong> {cart.shippingAddress.fullName}
              </p>
              <p>
                <strong>Address: </strong> {cart.shippingAddress.address},{' '}
                {cart.shippingAddress.houseNumber},{' '}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.country}{' '}
              </p>

              <NavLink to={'/shipping'}> Edit</NavLink>
            </article>

            <article className="payment-method">
              <h4>Payment</h4>
              <p>
                <strong>Method:</strong> {cart.paymentMethod}
              </p>
              <NavLink to={'/payment'}> Edit</NavLink>
            </article>
          </div>

          <article className="order-summary">
            <h4>Order Summary</h4>
            <div className="order-summary-details">
              <div className="total-of-items">
                <p>
                  <strong>Items:</strong>
                </p>
                <p>${cart.itemsPrice.toFixed(2)}</p>
              </div>

              <div className="total-of-items">
                <p>
                  <strong>Shipping:</strong>
                </p>
                <p>${cart.shippingPrice.toFixed(2)}</p>
              </div>

              <div className="total-of-items">
                <p>
                  <strong>Tax</strong>
                </p>
                <p>${cart.taxPrice.toFixed(2)}</p>
              </div>

              <hr />

              <div className="total-of-items">
                <p>
                  <strong>Total</strong>
                </p>
                <p>
                  <strong>${cart.totalPrice.toFixed(2)}</strong>
                </p>
              </div>
              <hr />
            </div>
            <button onClick={submitOrder} className="order-btn">
              Submit Order
            </button>

            {/* //! loading-step-2: loading is used using <LoadingBox> */}
            {loading && <LoadingBox></LoadingBox>}

            <section className="further-info">
              <p className="text-info">
                For more information, we would be happy to hear from you. If you
                would like to contact us, please{' '}
                <NavLink to={'/contact'}>click here</NavLink>.
              </p>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
};

export default PlaceOrder;
