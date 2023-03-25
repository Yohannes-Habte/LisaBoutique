import React, { useContext, useReducer, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ACTION_STORE, myContext } from '../../components/storeProvider/StoreProvider';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import './Profile.scss';
import GetError from '../../components/errors/GetError';
import { toast } from 'react-toastify';
import axios from 'axios';

// Update Object
const UPDATE_LOADING = {
  FETCH_REQUEST: 'FETCH_REQUEST',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAIL: 'FETCH_FAIL',
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_LOADING.FETCH_REQUEST:
      return { ...state, loadingUpdate: true };
    case UPDATE_LOADING.FETCH_SUCCESS:
      return { ...state, loadingUpdate: false };
    case UPDATE_LOADING.FETCH_FAIL:
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

const Profile = () => {
  // loading for update using ureReducer
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });
  // get userInfo from myContext
  const { state, dispatch: contextDispatch } = useContext(myContext);
  const { userInfo } = state;
  // State variables
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState(false);
  const [confirmPasswordStatus, setConfirmPasswordStatus] = useState(false);

  // Validation
  const [nameValidation, setNameValidation] = useState(false);
  const [emailValidation, setEmailValidation] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(false);
  const [confirmPasswordValidation, setConfirmPasswordValidation] =
    useState(false);

  // userRef
  const emailRef = useRef();
  const passwordRef = useRef();

  // Function to check if the email is valid
  const checkEmailFormat = () => {
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email);
    if (emailRegex) {
      emailRef.current.className = 'errorInvisible';
      //emailRef.current.style.display = 'none';
    } else {
      emailRef.current.className = 'errorVisible';
      //passwordRef.current.style.display = 'block';
    }
  };

  // Function to check if the password is valid
  const checkPasswordFormat = () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      );
    if (passwordRegex) {
      passwordRef.current.className = 'errorInvisible';
      //passwordRef.current.style.display = 'none';
    } else {
      passwordRef.current.className = 'errorVisible';
      //passwordRef.current.style.display = 'block';
    }
  };

  // handle change function
  const handleChange = (e) => {
    switch (e.target.name) {
      case 'name':
        setName(e.target.value);
        setNameValidation(true);
        break;
      case 'email':
        setEmail(e.target.value);
        setEmailValidation(true);
        break;
      case 'password':
        setPassword(e.target.value);
        setPasswordValidation(true);
        break;
      case 'confirmPassword':
        setConfirmPassword(e.target.value);
        setConfirmPasswordValidation(true);
        break;
      default:
        break;
    }
  };

  // Function to show/hide password
  const displayPassword = () => {
    setPasswordStatus((prevState) => !prevState);
  };

  // Function to show or hide confirm password
  const displayConfirmPassword = () => {
    setConfirmPasswordStatus((prevState) => !prevState);
  };

  // Function to reste the state variables
  const reset = () => {
    setName('');
    setNameValidation(false);
    setEmail('');
    setEmailValidation(false);
    setPassword('');
    setPasswordValidation(false);
    setConfirmPassword('');
    setConfirmPasswordValidation(false);
  };

  // submit handler function
  const submitHandler = async (e) => {
    e.preventDefault();

    //! Check password confirmation 
    if(password !== confirmPassword) {
      toast.error("Password do not match!")
      return;
    }

    const updateUser = {
      name: name,
      email: email,
      password: password,
    };

    const settings = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    try {
      const { data } = await axios.put(
        process.env.REACT_APP_SERVER_URL + `/api/users/profile`,
        updateUser,
        settings
      );
      dispatch({type: UPDATE_LOADING.FETCH_SUCCESS})
      contextDispatch({type: ACTION_STORE.USER_SIGNIN, payload: data})
      toast.success("User biodata updated successfully.")
    } catch (err) {
      toast.error(GetError(err));
    }
  };

  return (
    <main className="profile-page">
      <Helmet>
        <title>User Profile</title>
      </Helmet>

      <section className="profile-container">
        <h1 className="profile-title"> User Profile </h1>

        <p className="profile-paragraph">
          Dear user, you can update your profile as you wish.
        </p>

        <form onSubmit={submitHandler} action="" className="profile-form">
          <div className="input-label">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleChange}
              value={name}
              placeholder="Name"
            />
            <div
              className={
                nameValidation && name.trim().length === 0
                  ? 'errorVisible'
                  : 'errorInvisible'
              }
            >
              Enter Name!
            </div>
          </div>

          <div className="input-label">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              value={email}
              onBlur={checkEmailFormat}
              placeholder="Email"
            />

            <div
              className={
                emailValidation && email.trim().length === 0
                  ? 'errorVisible'
                  : 'errorInvisible'
              }
            >
              Email is required!
            </div>
            <div className="errorInvisible" ref={emailRef}>
              Incorrect email format!
            </div>
          </div>

          <div className="input-label">
            <label htmlFor="password">Password</label>
            <input
              type={passwordStatus ? 'text' : 'password'}
              name="password"
              id="password"
              onChange={handleChange}
              value={password}
              placeholder="Password"
            />
            <span onClick={displayPassword} className="password-status">
              {passwordStatus ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>

            <div
              className={
                passwordValidation && password.trim().length === 0
                  ? 'errorVisible'
                  : 'errorInvisible'
              }
            >
              Enter Password!
            </div>
          </div>

          <div className="input-label">
            <label htmlFor="password"> Confirm Password</label>
            <input
              type={confirmPasswordStatus ? 'text' : 'password'}
              name="confirmPassword"
              id="confirmPassword"
              onChange={handleChange}
              value={confirmPassword}
              placeholder="confirm Password"
            />
            <span onClick={displayConfirmPassword} className="password-status">
              {confirmPasswordStatus ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
            <div
              className={
                confirmPasswordValidation && confirmPassword.trim().length === 0
                  ? 'errorVisible'
                  : 'errorInvisible'
              }
            >
              Enter Confirm Password!
            </div>
          </div>
          <div>
            <button className="profile-btn"> Update Profile </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Profile;
