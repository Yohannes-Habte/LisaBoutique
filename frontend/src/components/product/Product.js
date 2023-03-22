import axios from 'axios';
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Rating from '../rating/Rating';
import { ACTION_STORE, myContext } from '../storeProvider/StoreProvider';
import './Product.scss';

const Product = (props) => {
  const { product } = props;

  // Get the myContext elements to run the add to cart function below
  const { state, dispatch: contextDispatch } = useContext(myContext);
  const {
    cart: { cartItems },
  } = state;

  // Add to cart function from the home page
  const addToCartHandler = async (item) => {
    // Find the item that need to add to the cart
    const existingItem = cartItems.find((item) => item._id === product._id);
    // Find the quantity of an existing item (existingItem) in the cart
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    // Get the count (countInStock) of a particular item from the database
    const { data } = await axios.get(
      `http://localhost:5000/api/products/${item._id}`
    );
    if (data.countInStock < quantity) {
      window.alert(
        'Sorry, Product is out of stock. Please send us message how to meet your need!'
      );
      return;
    } else {
      contextDispatch({
        type: ACTION_STORE.ADD_ITEM_TO_CART,
        payload: { ...product, quantity },
      });
    }

    //navigate('/cart');
  };

  return (
    <article className="product">
      <NavLink to={`/product/${product.slug}`}>
        <img src={product.image} alt={product.name} className="product-image" />
      </NavLink>

      <NavLink to={`/product/${product.slug}`}>
        <h5 className="product-name"> {product.name} </h5>
      </NavLink>

      <div className="product-details">
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <p className="product-price">
          <strong> ${product.price} </strong>
        </p>
        {product.countInStock === 0 ? (
          <button disabled> Out of Stock </button>
        ) : (
          <button
            onClick={() => addToCartHandler(product)}
            className="product-btn"
          >
            Add to Cart
          </button>
        )}
      </div>
    </article>
  );
};

export default Product;
