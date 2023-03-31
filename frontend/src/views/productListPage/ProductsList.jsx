import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import GetError from '../../components/errors/GetError';
import { myContext } from '../../components/storeProvider/StoreProvider';
import './ProductsList.scss';

// Products Object
const ADMIN_PRODUCTS = {
  // When admin request products
  FETCH_REQUEST: 'FETCH_REQUEST',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAIL: 'FETCH_FAIL',
  // When admin create products
  CREATE_REQUEST: 'CREATE_REQUEST',
  CREATE_SUCCESS: 'CREATE_SUCCESS',
  CREATE_FAIL: 'CREATE_FAIL',
  // WHen admin delete product
  DELETE_REQUEST: 'DELETE_REQUEST',
  DELETE_SUCCESS: 'DELETE_SUCCESS',
  DELETE_FAIL: 'DELETE_FAIL',
  DELETE_RESET: 'DELETE_RESET',
};

// reducer unction
const reducer = (state, action) => {
  switch (action.type) {
    // Requesting Products by an admin
    case ADMIN_PRODUCTS.FETCH_REQUEST:
      return { ...state, loading: true };
    case ADMIN_PRODUCTS.FETCH_SUCCESS:
      return {
        ...state,
        products: action.payload.products,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    // Creating Products by an admin
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

    // Deleting Products by an admin
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
const ProductsList = () => {
  // useReducer variables
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  //! Page and useLocation
  const navigate = useNavigate();

  const { state } = useContext(myContext);
  const { userInfo } = state;

  // useEffect
  useEffect(() => {
    const fetchData = async () => {
      const settings = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      try {
        const { data } = await axios.get(
          process.env.REACT_APP_SERVER_URL + `/api/products/admin `,
          settings
        );

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  // Create Product function
  const createHandler = async () => {
    if (window.confirm('Are you sure to create?')) {
      try {
        const settings = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          process.env.REACT_APP_SERVER_URL + '/api/products',
          settings
        );
        toast.success('product created successfully');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        toast.error(GetError(error));
        dispatch({
          type: 'CREATE_FAIL',
        });
      }
    }
  };

  // Delete handler function
  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await axios.delete(
          process.env.REACT_APP_SERVER_URL + `/api/products/${product._id}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('product deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(GetError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <main className="products-page">
      <Helmet>
        <title>Products</title>
      </Helmet>

      <section className="products-container">
        <h1 className="products-title">Products</h1>
        <div className="product-btn-container">
          <button className="product-btn">Create Product</button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          <tr>
            <td>2ß22ß52</td>
            <td>Lisa</td>
            <td>Akrur</td>
            <td>Nike</td>
            <td>Delet</td>
          </tr>
                
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default ProductsList;
