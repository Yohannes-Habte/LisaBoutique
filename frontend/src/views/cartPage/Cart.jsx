import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ACTION_STORE,
  myContext,
} from '../../components/storeProvider/StoreProvider';
import { FaTrash } from 'react-icons/fa';
import './Cart.scss';
import MessageBox from '../../components/messageBox/MessageBox';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const navigate = useNavigate();
  // Get the myContext elements to run the add to cart function below
  const { state, dispatch: contextDispatch } = useContext(myContext);
  const {
    cart: { cartItems },
  } = state;

  //! 1. Function to increate or decreate item quantity in the cart
  const updateCart = async (item, quantity) => {
    // Find the item from the backend
    const { data } = await axios.get(
      process.env.REACT_APP_SERVER_URL + `/api/products/${item._id}`
    );
    if (data.countInStock < quantity) {
      window.alert(
        'Sorry, Product is out of stock. Please send us message how to meet your need!'
      );
      return;
    } else {
      contextDispatch({
        type: ACTION_STORE.ADD_ITEM_TO_CART,
        payload: { ...item, quantity },
      });
    }
  };

  // Function to remove Item from the cart
  const removeItem = (item) => {
    contextDispatch({
      type: ACTION_STORE.REMOVE_ITEM_FROM_CART,
      payload: item,
    });
  };

  // Function that handle checkout
  const checkoutHandler = async () => {
    //! Step One: check whether user is signin. If user is logged in, direct the user to shipping address. Otherwise direct the user to login page
    navigate('/signin?redirect=/shipping');
  };

  return (
    <main className="cart-page">
      <Helmet>
        <title> Shopping Cart </title>
      </Helmet>
      <h1 className="cart-title"> Shopping Cart </h1>

      {cartItems.length === 0 ? (
        <MessageBox>
          Cart is empty. <NavLink to={'/'}> Go to Shopping </NavLink>
        </MessageBox>
      ) : (
        <div className="cart-items-details">
          <div className="itmes-info">
            {cartItems.map((item) => {
              return (
                <div key={item._id} className="cart-item-controller">
                  <div className="item-image-price">
                    <div className="image-container">
                      <img src={item.image} alt={item.name} className="image" />
                    </div>
                    <div className="name">
                      <NavLink to={`/product/${item.slug}`}>
                        {item.name}
                      </NavLink>
                    </div>
                  </div>

                  <div className="buttons-quantity-container">
                    <button
                      onClick={() => updateCart(item, item.quantity - 1)} //! 3. Function to decrease quantity
                      disabled={item.quantity === 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity"> {item.quantity} </span>
                    <button
                      onClick={() => updateCart(item, item.quantity + 1)}  //! 2. Function to increate quantity
                      disabled={item.quantity === item.countInStock}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>

                  <div className="item-price"> ${item.price} </div>

                  <div className="trash-icon">
                    <button
                      onClick={() => removeItem(item)}
                      className="trash-btn"
                    >
                      <FaTrash className="icon" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="total-items-and-price">
            <h3 className="total">
              Subtotal (
              {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}) Items:
              $
              {cartItems.reduce(
                (acc, curr) => acc + curr.price * curr.quantity,
                0
              )}
            </h3>
            <button
              onClick={checkoutHandler}
              type="button"
              disabled={cartItems.length <= 1}
              className="checkout-btn"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Cart;
