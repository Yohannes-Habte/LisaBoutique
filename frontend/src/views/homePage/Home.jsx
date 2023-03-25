import React, { useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import Product from '../../components/product/Product';
import LoadingBox from "../../components/loading/LoadingBox"
import './Home.scss';
import MessageBox from '../../components/messageBox/MessageBox';
import GetError from '../../components/errors/GetError';


// Object
const ACTION_PRODUCTS = {
  FETCH_REQUEST: 'FETCH_REQUEST',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAIL: 'FETCH_FAIL',
};

// Reducer Function
const reducer = (state, action) => {
  switch (action.type) {
    case ACTION_PRODUCTS.FETCH_REQUEST:
      return { ...state, loading: true };
    case ACTION_PRODUCTS.FETCH_SUCCESS:
      return { ...state, products: action.payload, loading: false };
    case ACTION_PRODUCTS.FETCH_FAIL:
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const Home = () => {
  // useReducer that save the products from the backend
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    products: [],
  });
  // State Variable that save the products from the backend
  //const [products, setProducts] = useState([]);

  // useEffect to display the products in the browser
  useEffect(() => {
    const fetchProducts = async () => {
      dispatch({ type: ACTION_PRODUCTS.FETCH_REQUEST });
      try {
        const response = await axios.get(process.env.REACT_APP_SERVER_URL + '/api/products');
        dispatch({ type: ACTION_PRODUCTS.FETCH_SUCCESS, payload: response.data });
      } catch (error) {
        dispatch({ type: ACTION_PRODUCTS.FETCH_FAIL, payload: GetError(error) });
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="home-page">
      <Helmet>
        <title> LisaBoutique </title>
      </Helmet>

      <section className="home-page-container">
        <h1 className="home-page-title"> Featured Products </h1>

        <section className="products">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger"> {error} </MessageBox>
          ) : (
            products.map((product) => {
              return (
                /* to get the attribut of the map product in the component Product, you need product={product} */
                <div key={product.slug}>
                  <Product product={product} />
                </div>
              );
            })
          )}
        </section>
      </section>
    </main>
  );
};

export default Home;
