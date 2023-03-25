import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';
import './Signin.scss';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
  ACTION_STORE,
  myContext,
} from '../../components/storeProvider/StoreProvider';
import { toast } from 'react-toastify';
import GetError from '../../components/errors/GetError';
import CheckoutSteps from '../../components/checkoutSteps/CheckoutSteps';

const Signin = () => {
  const navigate = useNavigate();
  //! Step 2: To get the value of "redirect" in the NavLink "Create your Account" you have to use useLocation
  const { search } = useLocation();
  // From the "search" you can get the "redirectInUrl"
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function that updates login data
  const updateData = (e) => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  };


  const { state, dispatch: contextDispatch } = useContext(myContext);
  const { userInfo } = state;

  // Function to submit user signin
  const submitUser = async (e) => {
    // to prevent refreshing the page when the user click sign in button
    e.preventDefault();

    // Login user
    const loginUser = {
      email: email,
      password: password,
    };

    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER_URL + '/api/users/signin',
        loginUser
      );
      contextDispatch({ type: ACTION_STORE.USER_SIGNIN, payload: data });
      //! User-step-1: Save user info in the browser local storage
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/'); 
    } catch (err) {
      //! toast-step-3: display the err using the GetError function from the component
      toast.error(GetError(err));
    }
  };

  // While you logged in, if the browser direct you to the signin page, you can solve it using:
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <main className="login-page">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <CheckoutSteps step1 > </CheckoutSteps>
      <section className="login-container">
        <h1 className="login-title"> Login </h1>
        <fieldset className="login-fieldset">
          <legend className="login-icon">
            <FaUserAlt className="icon" />
          </legend>

          <form onSubmit={submitUser} className="login-form">
            <div className="login-email">
              <label htmlFor="email"> Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={updateData}
                placeholder="Enter Email"
              />
            </div>
            <div className="login-password">
              <label htmlFor="password"> Password: </label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={updateData}
                value={password}
                placeholder="Enter Password"
              />
            </div>
            <div className="keep-login-and-forget-password">
              <div className="checkbox-keep-signed-in">
                <input type="checkbox" name="keepMe" id="keepMe" />
                <label htmlFor="keepMe">Keep me signed in</label>
              </div>
              <p className="forget-password">
                <a href="#"> Forget your password? </a>
              </p>
            </div>
            <button className="login-btn">Sign In</button>
          </form>
          <div className="if-no-account">
            <p>Don't have an account?</p>
            {/* //! Step 1: You can get the "redirect" from the url using useLocatiion */}
            <NavLink to={`/signup?redirect=${redirect}`}>
              Create your Account
            </NavLink>
          </div>
        </fieldset>
      </section>
    </main>
  );
};

export default Signin;
