import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import GetError from '../../components/errors/GetError';
import LoadingBox from '../../components/loading/LoadingBox';
import MessageBox from '../../components/messageBox/MessageBox';
import { myContext } from '../../components/storeProvider/StoreProvider';
import { usePayPalScriptReducer, PayPalButtons } from '@paypal/react-paypal-js';
import './GetOrdered.scss';
import { toast } from 'react-toastify';

// Order Object
const GETORDERED = {
  // Order
  FETCH_REQUEST: 'FETCH_REQUEST',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAIL: 'FETCH_FAIL',
  // Payment
  PAY_REQUEST: 'PAY_REQUEST',
  PAY_SUCCESS: 'PAY_SUCCESS',
  PAY_FAIL: 'PAY_FAIL',
  PAY_RESET: 'PAY_RESET',
  // Delivery
  DELIVER_REQUEST: 'DELIVER_REQUEST',
  DELIVER_SUCCESS: 'DELIVER_SUCCESS',
  DELIVER_FAIL: 'DELIVER_FAIL',
  DELIVER_RESET: 'DELIVER_RESET',
};
// Initial States
const initialState = {
  loading: true,
  error: '',
  order: {},
  successPay: false,
  loadingPay: false,
};

// Reducer Function
const reducer = (state, action) => {
  switch (action.type) {
    // Get Order
    case GETORDERED.FETCH_REQUEST:
      return { ...state, loading: true, error: '' };
    case GETORDERED.FETCH_SUCCESS:
      return { ...state, order: action.payload, loading: false, error: '' };
    case GETORDERED.FETCH_FAIL:
      return { ...state, error: action.payload, loading: false };

    // Payment
    case GETORDERED.PAY_REQUEST:
      return { ...state, loadingPay: true };
    case GETORDERED.PAY_SUCCESS:
      return { ...state, loadingPay: false, successPay: true };
    case GETORDERED.PAY_FAIL:
      return { ...state, loadingPay: false };
    case GETORDERED.PAY_RESET:
      return { ...state, loadingPay: false, successPay: false };
    // Delivery
    case GETORDERED.DELIVER_REQUEST:
      return { ...state, loadingDeliver: true };
    case GETORDERED.DELIVER_SUCCESS:
      return { ...state, loadingDeliver: false, successDeliver: true };
    case GETORDERED.DELIVER_FAIL:
      return { ...state, loadingDeliver: false };
    case GETORDERED.DELIVER_RESET:
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      return state;
  }
};

const GetOrdered = () => {
  const [
    {
      loading,
      error,
      order,
      loadingPay,
      successPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  // myContext items
  const { state } = useContext(myContext);
  const { userInfo } = state;

  //! useParams is used to find the "orderId" from the url
  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  //! PayPal Step 5: paypal loading and "paypalDispatch" function from "usePayPalScriptReducer"
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  //============================================================
  // Function that handle when you click on the paypal button
  //============================================================
  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  };

  //============================================================
  // Function that handle successful paypal payment
  //============================================================
  const onApprove = (data, actions) => {
    //! "details" contain user info and payment info in the payPal side
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: GETORDERED.PAY_REQUEST });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: GETORDERED.PAY_SUCCESS, payload: data });
        toast.success('Order is successfully paid!');
      } catch (err) {
        dispatch({ type: GETORDERED.PAY_FAIL, payload: GetError(err) });
        toast.error(GetError(err));
      }
    });
  };

  //============================================================
  // Function that handle error in paying the order using paypal
  //============================================================
  const onError = (err) => {
    toast.error(GetError(err));
  };

  // Using useEffect display in the browser
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: GETORDERED.FETCH_REQUEST });
        const { data } = await axios.get(
          process.env.REACT_APP_SERVER_URL + `/api/orders/${orderId}`,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({ type: GETORDERED.FETCH_SUCCESS, payload: data });
      } catch (err) {
        dispatch({ type: GETORDERED.FETCH_FAIL, payload: GetError(err) });
      }
    };

    // IF there is no user
    if (!userInfo) {
      return navigate('/login');
    }

    // If there is no "order._id" and if "order._id and order._id" is not equal to "orderId" call "fetchOrder()" function
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();

      // Reset
      if (successPay) {
        dispatch({ type: GETORDERED.PAY_RESET });
      }
    } else {
      //!PayPal Step 6: Implement loadPayPalScript function
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get(process.env.REACT_APP_SERVER_URL + '/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        // In the paypalDispatch funtion, set the type and the value of the paypal
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'EUR',
          },
        });
        //Set the "setLoadingStatus" to "pending"
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox> {error} </MessageBox>
  ) : (
    <main className="ordered-page">
      <Helmet>
        <title> Order ID {orderId} </title>
      </Helmet>
      <section className="order-container">
        <h1 className="order-title"> Your Order ID - {order._id} </h1>
        <div className="order-details">
          <div className="ordered-items-address-payment">
            <article className="ordered-items">
              <h4> Ordered Items </h4>
              <div className="items-info">
                {order.orderItems.map((item) => {
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
              </div>
            </article>

            <article className="shipping-address">
              <h4>Shipping</h4>
              <p>
                <strong>Name:</strong> {order.shippingAddress.fullName}
              </p>
              <p>
                <strong>Address: </strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.houseNumber},{' '}
                {order.shippingAddress.postalCode}, {order.shippingAddress.city}
                , {order.shippingAddress.country}{' '}
              </p>

              {/* //! Check Delivery to customers */}
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger"> Not yet delivered! </MessageBox>
              )}
            </article>

            <article className="payment-method">
              <h4>Payment</h4>
              <p>
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              {/* //! Check order payment */}
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger"> Not Paid </MessageBox>
              )}
            </article>
          </div>

          <article className="order-summary">
            <h4>Order Summary</h4>
            <div className="order-summary-details">
              <div className="total-of-items">
                <p>
                  <strong>Items:</strong>
                </p>
                <p>${order.itemsPrice.toFixed(2)}</p>
              </div>

              <div className="total-of-items">
                <p>
                  <strong>Shipping:</strong>
                </p>
                <p>${order.shippingPrice.toFixed(2)}</p>
              </div>

              <div className="total-of-items">
                <p>
                  <strong>Tax</strong>
                </p>
                <p>${order.taxPrice.toFixed(2)}</p>
              </div>

              <hr />

              <div className="total-of-items">
                <p>
                  <strong>Total</strong>
                </p>
                <p>
                  <strong>${order.totalPrice.toFixed(2)}</strong>
                </p>
              </div>
            </div>
            {/* //! Paypal Step 7:	Render PayPal button */}
            {!order.isPaid && (
              <div>
                {isPending ? (
                  <LoadingBox />
                ) : (
                  <div>
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    ></PayPalButtons>
                  </div>
                )}
                {loadingPay && <LoadingBox></LoadingBox>}
              </div>
            )}
          </article>
        </div>
      </section>
    </main>
  );
};

export default GetOrdered;
