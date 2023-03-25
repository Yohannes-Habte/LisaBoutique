import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import GetError from '../../components/errors/GetError';
import LoadingBox from '../../components/loading/LoadingBox';
import MessageBox from '../../components/messageBox/MessageBox';
import Rating from '../../components/rating/Rating';
import {
  ACTION_STORE,
  myContext,
} from '../../components/storeProvider/StoreProvider';
import './SingleProduct.scss';

// Object
const ACTION_PRODUCT = {
  FETCH_REQUEST: 'FETCH_REQUEST',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAIL: 'FETCH_FAIL',
};

// Reducer Function
const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_PRODUCT.FETCH_REQUEST:
      return { ...state, loading: true };
    case ACTION_PRODUCT.FETCH_SUCCESS:
      return { ...state, product: action.payload, loading: false };
    case ACTION_PRODUCT.FETCH_FAIL:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const SingleProduct = (props) => {
  // Navigate to cart page
  const navigate = useNavigate();

  // To get params from the url, you need to use useParams Hook
  const params = useParams();
  const { slug } = params;

  // useReducer that save a single product from the backend
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    product: [],
  });

  // useEffect that display a single product to the frontend from the backend
  useEffect(() => {
    const fetchProduct = async () => {
      dispatch({ type: ACTION_PRODUCT.FETCH_REQUEST });
      try {
        const response = await axios.get(
          process.env.REACT_APP_SERVER_URL + `/api/products/slug/${slug}`
        );
        dispatch({
          type: ACTION_PRODUCT.FETCH_SUCCESS,
          payload: response.data,
        });
      } catch (error) {
        dispatch({ type: ACTION_PRODUCT.FETCH_FAIL, payload: GetError(error) });
      }
    };
    fetchProduct();
  }, [slug]);

  // Get the myContext elements to run the add to cart function below
  const { state, dispatch: contextDispatch } = useContext(myContext);
  const { cart } = state;

  // Add to cart function
  //! First Step. To add to cart and increasing the quantity of a particular item
  const addToCart = async () => {
    // Find the item that need to add to the cart
    const existingItem = cart.cartItems.find(
      (item) => item._id === product._id
    );
    // Find the quantity of an existing item (existingItem) in the cart
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    // Get the count (countInStock) of a particular item from the database
    const { data } = await axios.get(
      `http://localhost:5000/api/products/${product._id}`
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

    navigate('/cart');
  };

  return (
    <main className="product-page">
      <section className="product-container">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger"> {error} </MessageBox>
        ) : (
          <article className="single-product">
            <figure className="product-image-container">
              <img
                src={product.image}
                alt={product.name}
                className="single-product-image"
              />
            </figure>

            <article>
              <Helmet>
                <title> {product.name} </title>
              </Helmet>

              <h1 className="single-product-nane"> {product.name} </h1>
              <Rating numReviews={product.numReviews} rating={product.rating} />
              <p>
                <strong>Price</strong>: ${product.price}
              </p>
              <p>
                <strong>Description</strong>: {product.description}
              </p>
            </article>

            <aside className="sigle-product-status">
              <p className="price">
                <strong>Price:</strong> ${product.price}
              </p>
              <div className="status-container">
                <strong>Status:</strong>
                {product.countInStock > 0 ? (
                  <span>
                    <span className="in-stock"> In Stock</span>
                    <div className="btn-container">
                      <button onClick={addToCart} className="sigle-product-btn">
                        Add to Cart
                      </button>
                    </div>
                  </span>
                ) : (
                  <span className="out-of-stock"> Out of stock </span>
                )}
              </div>
            </aside>
          </article>
        )}
      </section>
    </main>
  );
};

export default SingleProduct;
