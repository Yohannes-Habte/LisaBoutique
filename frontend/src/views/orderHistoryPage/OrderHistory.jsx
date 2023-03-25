import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import GetError from '../../components/errors/GetError';
import LoadingBox from '../../components/loading/LoadingBox';
import MessageBox from '../../components/messageBox/MessageBox';
import { myContext } from '../../components/storeProvider/StoreProvider';
import './OrderHistory.scss';

// Order History Object
const ORDER_HISTORY = {
  FETCH_REQUEST: 'FETCH_REQUEST',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAIL: 'FETCH_FAIL',
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case ORDER_HISTORY.FETCH_REQUEST:
      return { ...state, loading: true, error: '' };
    case ORDER_HISTORY.FETCH_SUCCESS:
      return { ...state, orders: action.payload, loading: false, error: '' };
    case ORDER_HISTORY.FETCH_FAIL:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const OrderHistory = () => {
  // useReducer State varibles
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  // Imported variables
  const { state } = useContext(myContext);
  const { userInfo } = state;

  // navigate to ...
  const navigate = useNavigate();

  // useEffect function to get order history
  useEffect(() => {
    const fetchOrders = async () => {
      dispatch({ type: ORDER_HISTORY.FETCH_REQUEST });
      try {
        const settings = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(
          process.env.REACT_APP_SERVER_URL + '/api/orders/user/orderHistory',
          settings
        );
        dispatch({ type: ORDER_HISTORY.FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: ORDER_HISTORY.FETCH_FAIL, payload: GetError(error) });
      }
    };
    fetchOrders();
  }, [userInfo]);

  return (
    <main className="order-history-page">
      <Helmet>
        <title> Order History </title>
      </Helmet>

      <section className="order-history-container">
        <h1 className="order-history-title"> Order History </h1>

        <div className="table-container">
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox> {error} </MessageBox>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Delivered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  return (
                    <tr>
                      <td> {order._id} </td>
                      {/* //! substring is used to show only the date, but not the time of order */}
                      <td> {order.createdAt.substring(0, 10)} </td>
                      <td> {order.totalPrice.toFixed(2)} </td>
                      <td>
                        {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                      </td>
                      <td>
                        {order.deliveredAt
                          ? order.deliveredAt.substring(0, 10)
                          : 'No'}
                      </td>
                      <td>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => navigate(`/order/${order._id}`)}
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
};

export default OrderHistory;
