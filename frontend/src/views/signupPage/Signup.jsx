import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';
import "./Signup.scss"
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import {
  ACTION_STORE,
  myContext,
} from '../../components/storeProvider/StoreProvider';
import { toast } from 'react-toastify';
import GetError from '../../components/errors/GetError';
import CheckoutSteps from '../../components/checkoutSteps/CheckoutSteps';

const Signup = () => {
  const navigate = useNavigate();
  //! Step 2: To get the value of "redirect" in the NavLink "Create your Account" you have to use useLocation
  const { search } = useLocation();
  // From the "search" you can get the "redirectInUrl"
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';
  // State variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Function that updates login data
  const updateData = (e) => {
    switch (e.target.name) {
      case 'name':
        setName(e.target.value);
        break;
      case 'email':
        setEmail(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      case 'confirmPassword':
        setConfirmPassword(e.target.value);
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

    //! Check password confirmation 
    if(password !== confirmPassword) {
      toast.error("Password do not match!")
      return;
    }

    // Login user
    const signupUser = {
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    };

    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER_URL + '/api/users/signup',
        signupUser
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
    <main className="signup-page">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>

      <CheckoutSteps step1></CheckoutSteps>

      <section className="signup-container">
        <h1 className="signup-title"> Sign-Up </h1>
        <fieldset className="signup-fieldset">
          <legend className="signup-icon">
            <FaUserAlt className="icon" />
          </legend>

          <form onSubmit={submitUser} className="signup-form">
            <div className="signup-label-input">
              <label htmlFor="name"> Name </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={updateData}
                placeholder="Enter Name"
              />
            </div>
            <div className="signup-label-input">
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

            <div className="signup-label-input">
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

            <div className="signup-label-input">
              <label htmlFor="confirmPassword"> Confirm Password: </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                onChange={updateData}
                value={confirmPassword}
                placeholder="Confirm Password"
              />
            </div>

            <button className="signup-btn">Sign Up</button>
          </form>
          <div className="already-have-account">
            <p>Already have an account?</p>
            {/* //! Step 1: You can get the "redirect" from the url using useLocatiion */}
            <NavLink to={`/signin?redirect=${redirect}`}>Log In</NavLink>
          </div>
        </fieldset>
      </section>
    </main>
  );
};

export default Signup;
